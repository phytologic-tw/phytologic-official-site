import crypto from "crypto";
import { getSupabaseAdmin } from "../_member-utils.js";

const SYSTEMS = [
  "brain_nerve",
  "digestive",
  "detox_liver",
  "blood_sugar_cardio",
  "endocrine_hormone",
  "muscle_bone",
  "immune",
];

const HEALTH_CONCERN_SYSTEM_MAP = {
  頭部: "brain_nerve",
  頭痛: "brain_nerve",
  睡眠: "brain_nerve",
  注意力: "brain_nerve",
  情緒: "brain_nerve",
  消化系統: "digestive",
  腸胃: "digestive",
  排便: "digestive",
  代謝: "blood_sugar_cardio",
  體態: "blood_sugar_cardio",
  體重: "blood_sugar_cardio",
  體脂: "blood_sugar_cardio",
  水腫: "detox_liver",
  皮膚: "immune",
  痘痘: "immune",
  過敏: "immune",
  能量: "endocrine_hormone",
  疲勞: "endocrine_hormone",
  精神: "endocrine_hormone",
  活力: "endocrine_hormone",
  四肢: "muscle_bone",
  關節: "muscle_bone",
  肌肉: "muscle_bone",
  痠痛: "muscle_bone",
};

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00+08:00`);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

function mapAgeToGroup(age, fallback) {
  const normalizedFallback = String(fallback || "").trim();
  if (["teen", "young_adult", "middle_adult", "senior", "elder"].includes(normalizedFallback)) {
    return normalizedFallback;
  }

  const n = Number(age);
  if (!Number.isFinite(n)) return null;
  if (n >= 12 && n <= 19) return "teen";
  if (n >= 20 && n <= 34) return "young_adult";
  if (n >= 35 && n <= 49) return "middle_adult";
  if (n >= 50 && n <= 64) return "senior";
  if (n >= 65) return "elder";
  return "teen";
}

function normalizeGender(gender) {
  const value = String(gender || "").trim();
  if (value === "female" || value === "male") return value;
  return "all";
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function hashString(input = "") {
  let hash = 0;
  const str = String(input);
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function shuffle(list, seed) {
  const next = [...list];
  const random = seededRandom(seed);
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildQuota(profile, lastReportScores = {}) {
  const quota = Object.fromEntries(SYSTEMS.map((system) => [system, 2]));

  const scoreEntries = Object.entries(lastReportScores || {})
    .filter(([system, score]) => SYSTEMS.includes(system) && Number.isFinite(Number(score)));
  if (scoreEntries.length) {
    const minScore = Math.min(...scoreEntries.map(([, score]) => Number(score)));
    scoreEntries
      .filter(([, score]) => Number(score) === minScore)
      .forEach(([system]) => {
        quota[system] += 1;
      });
  }

  const concerns = Array.isArray(profile.health_concerns) ? profile.health_concerns : [];
  concerns.forEach((concern) => {
    const mapped = HEALTH_CONCERN_SYSTEM_MAP[concern];
    if (mapped) quota[mapped] += 1;
  });

  return quota;
}

function rankQuestions(questions, seed) {
  const random = seededRandom(seed);
  return [...questions]
    .map((question) => ({ ...question, jitter: random() }))
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (Number(b.weight) !== Number(a.weight)) return Number(b.weight) - Number(a.weight);
      return a.jitter - b.jitter;
    });
}

function selectQuestions({ questions, profile, lastReportScores, recentQuestionIds, sessionSeed, targetCount = 25 }) {
  const recentSet = new Set(recentQuestionIds);
  const primaryPool = questions.filter((question) => !recentSet.has(question.id));
  const quota = buildQuota(profile, lastReportScores);
  const selected = [];
  const selectedIds = new Set();

  SYSTEMS.forEach((system) => {
    const pool = rankQuestions(
      primaryPool.filter((question) => question.system_category === system),
      hashString(`${sessionSeed}:${system}`)
    );

    pool.slice(0, quota[system]).forEach((question) => {
      if (!selectedIds.has(question.id)) {
        selected.push(question);
        selectedIds.add(question.id);
      }
    });
  });

  const fillFromPool = (pool) => {
    rankQuestions(pool, hashString(`${sessionSeed}:refill`)).forEach((question) => {
      if (selected.length < targetCount && !selectedIds.has(question.id)) {
        selected.push(question);
        selectedIds.add(question.id);
      }
    });
  };

  fillFromPool(primaryPool);
  if (selected.length < targetCount) fillFromPool(questions);

  return shuffle(selected.slice(0, targetCount), hashString(`${sessionSeed}:final`));
}

async function findProfile(supabase, { profileId, lineUserId }) {
  if (profileId) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle();
    if (error) throw error;
    return data;
  }

  if (lineUserId) {
    const { data, error } = await supabase.from("profiles").select("*").eq("line_user_id", lineUserId).maybeSingle();
    if (error) throw error;
    return data;
  }

  return null;
}

async function fetchLastReportScores(supabase, profileId) {
  const { data, error } = await supabase
    .from("dr_marvin_reports")
    .select("scores")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return {};
  return data?.scores || {};
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const input = req.method === "GET" ? req.query : req.body || {};
  const profileId = input.profile_id || input.profileId;
  const lineUserId = input.line_user_id || input.lineUserId;

  try {
    const supabase = getSupabaseAdmin();
    const profile = await findProfile(supabase, { profileId, lineUserId });
    if (!profile) return res.status(404).json({ error: "Member profile not found" });

    const age = Number(input.age) || calculateAge(profile.birth_date || profile.birthdate);
    const ageGroup = mapAgeToGroup(input.age_group || input.ageGroup || age, profile.age_group);
    if (!ageGroup) return res.status(400).json({ error: "Cannot resolve age group" });

    const gender = normalizeGender(input.gender || profile.gender);
    const genderFilters = gender === "all" ? ["all"] : ["all", gender];

    const { data: questions, error: questionsError } = await supabase
      .from("question_bank")
      .select("id, system_category, age_groups, gender_filter, question_text, question_type, options, weight, priority")
      .contains("age_groups", [ageGroup])
      .in("gender_filter", genderFilters)
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (questionsError) throw questionsError;
    if (!questions?.length) return res.status(404).json({ error: "No questions available for this profile" });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentRows, error: recentError } = await supabase
      .from("member_question_history")
      .select("question_id")
      .eq("profile_id", profile.id)
      .gte("shown_at", thirtyDaysAgo);

    if (recentError) throw recentError;

    const lastReportScores =
      input.last_report_scores || input.lastReportScores || (await fetchLastReportScores(supabase, profile.id));
    const assessmentSessionId = crypto.randomUUID();
    const sessionSeed = `${profile.id}:${ageGroup}:${gender}:${assessmentSessionId}`;
    const selectedQuestions = selectQuestions({
      questions,
      profile,
      lastReportScores,
      recentQuestionIds: (recentRows || []).map((row) => row.question_id),
      sessionSeed,
      targetCount: 25,
    });

    const historyRows = selectedQuestions.map((question) => ({
      profile_id: profile.id,
      question_id: question.id,
      assessment_session_id: assessmentSessionId,
    }));

    const { error: historyError } = await supabase.from("member_question_history").insert(historyRows);
    if (historyError) throw historyError;

    return res.status(200).json({
      success: true,
      profile_id: profile.id,
      age_group: ageGroup,
      gender,
      assessment_session_id: assessmentSessionId,
      count: selectedQuestions.length,
      questions: selectedQuestions.map((question) => ({
        id: question.id,
        system_category: question.system_category,
        age_groups: question.age_groups,
        gender_filter: question.gender_filter,
        question_text: question.question_text,
        question_type: question.question_type,
        options: question.options,
        weight: Number(question.weight),
        priority: question.priority,
      })),
    });
  } catch (error) {
    console.error("[dr-marvin/questions] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
