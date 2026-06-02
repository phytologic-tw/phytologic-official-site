-- ============================================================
-- Dr. Marvin anti_inflammation_protocols seed
-- Source: 01_DOCS/dr-marvin/DR_MARVIN_KNOWLEDGE_BASE.md
-- Generated: 2026-06-02
--
-- Notes:
--   - Seed only. Requires public.anti_inflammation_protocols to exist.
--   - Each of seven systems has nutrition / supplement / lifestyle records.
-- ============================================================

do $$
begin
  if to_regclass('public.anti_inflammation_protocols') is null then
    raise exception 'public.anti_inflammation_protocols does not exist. Run supabase/dr_marvin_question_engine.sql before this seed.';
  end if;

  alter table public.anti_inflammation_protocols
    add column if not exists system_category text,
    add column if not exists protocol_code text,
    add column if not exists protocol_type text,
    add column if not exists protocol_title text,
    add column if not exists protocol_body text,
    add column if not exists items jsonb not null default '[]'::jsonb,
    add column if not exists priority integer not null default 5,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now(),
    add column if not exists is_active boolean not null default true;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'anti_inflammation_protocols'
      and column_name = 'title'
  ) then
    alter table public.anti_inflammation_protocols
      alter column title set default '';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'anti_inflammation_protocols'
      and column_name = 'body'
  ) then
    alter table public.anti_inflammation_protocols
      alter column body set default '';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'anti_inflammation_protocols'
      and column_name = 'description'
  ) then
    alter table public.anti_inflammation_protocols
      alter column description set default '';
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'anti_inflammation_protocols_protocol_code_key'
      and conrelid = 'public.anti_inflammation_protocols'::regclass
  ) then
    alter table public.anti_inflammation_protocols
      add constraint anti_inflammation_protocols_protocol_code_key
      unique (protocol_code);
  end if;
end $$;

insert into public.anti_inflammation_protocols
(system_category, protocol_code, protocol_type, protocol_title, protocol_body, items, priority)
values
  ('brain_nerve', 'brain_nerve_nutrition', 'nutrition', '大腦神經抗氧化飲食', '大腦神經抗氧化飲食：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"食物四分法","description":"蔬菜、水果、優質蛋白質、全穀根莖各 25%，建立低發炎餐盤。","dosage":"每日主要餐盤執行"},{"name":"低溫原型飲食","description":"減少油炸、燒烤與高度加工食品，降低 AGEs 與氧化油脂。","dosage":"每日至少 2 餐"}]'::jsonb, 7),
  ('brain_nerve', 'brain_nerve_supplement', 'supplement', '大腦神經標靶營養素', '大腦神經標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持抗氧化、膠原蛋白合成、血管與黏膜修復。","dosage":"依產品標示與個人耐受"},{"name":"Omega-3","description":"協助平衡 Omega-6 促發炎路徑，支持血管、腦部與關節。","dosage":"依產品標示每日補充"}]'::jsonb, 7),
  ('brain_nerve', 'brain_nerve_lifestyle', 'lifestyle', '自律神經修復節律', '自律神經修復節律：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"黃金睡眠","description":"睡眠是組織修復與大腦排毒的核心時段。","dosage":"每晚 7-8 小時"},{"name":"腹式呼吸","description":"啟動副交感神經，協助壓力降載與修復。","dosage":"每日 5-10 分鐘"}]'::jsonb, 7),
  ('digestive', 'digestive_nutrition', 'nutrition', '腸道屏障飲食重整', '腸道屏障飲食重整：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"飲食剔除觀察","description":"暫停常見致敏來源，觀察腹脹、腹瀉、皮膚與腦霧變化。","dosage":"連續 4 週"},{"name":"高纖蔬菜","description":"支持腸道菌相與短鏈脂肪酸生成。","dosage":"每餐至少半碗"}]'::jsonb, 7),
  ('digestive', 'digestive_supplement', 'supplement', '消化黏膜標靶營養素', '消化黏膜標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持抗氧化、膠原蛋白合成、血管與黏膜修復。","dosage":"依產品標示與個人耐受"},{"name":"Omega-3","description":"協助平衡 Omega-6 促發炎路徑，支持血管、腦部與關節。","dosage":"依產品標示每日補充"}]'::jsonb, 7),
  ('digestive', 'digestive_lifestyle', 'lifestyle', '消化節律修復', '消化節律修復：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"黃金睡眠","description":"睡眠是組織修復與大腦排毒的核心時段。","dosage":"每晚 7-8 小時"},{"name":"腹式呼吸","description":"啟動副交感神經，協助壓力降載與修復。","dosage":"每日 5-10 分鐘"}]'::jsonb, 7),
  ('detox_liver', 'detox_liver_nutrition', 'nutrition', '肝膽排毒飲食降載', '肝膽排毒飲食降載：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"十字花科蔬菜","description":"提供含硫化合物，支持肝臟代謝路徑。","dosage":"每日 1 份"},{"name":"低溫水煮或清蒸","description":"減少油脂氧化與高溫毒素。","dosage":"每日至少 1 餐"}]'::jsonb, 7),
  ('detox_liver', 'detox_liver_supplement', 'supplement', '肝膽排毒標靶營養素', '肝膽排毒標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持抗氧化、膠原蛋白合成、血管與黏膜修復。","dosage":"依產品標示與個人耐受"},{"name":"Omega-3","description":"協助平衡 Omega-6 促發炎路徑，支持血管、腦部與關節。","dosage":"依產品標示每日補充"}]'::jsonb, 7),
  ('detox_liver', 'detox_liver_lifestyle', 'lifestyle', '環境毒素降載', '環境毒素降載：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"黃金睡眠","description":"睡眠是組織修復與大腦排毒的核心時段。","dosage":"每晚 7-8 小時"},{"name":"腹式呼吸","description":"啟動副交感神經，協助壓力降載與修復。","dosage":"每日 5-10 分鐘"}]'::jsonb, 7),
  ('blood_sugar_cardio', 'blood_sugar_cardio_nutrition', 'nutrition', '血糖心血管穩定餐盤', '血糖心血管穩定餐盤：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"食物四分法","description":"蔬菜、水果、優質蛋白質、全穀根莖各 25%，建立低發炎餐盤。","dosage":"每日主要餐盤執行"},{"name":"低溫原型飲食","description":"減少油炸、燒烤與高度加工食品，降低 AGEs 與氧化油脂。","dosage":"每日至少 2 餐"}]'::jsonb, 7),
  ('blood_sugar_cardio', 'blood_sugar_cardio_supplement', 'supplement', '血管內皮標靶營養素', '血管內皮標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持抗氧化、膠原蛋白合成、血管與黏膜修復。","dosage":"依產品標示與個人耐受"},{"name":"Omega-3","description":"協助平衡 Omega-6 促發炎路徑，支持血管、腦部與關節。","dosage":"依產品標示每日補充"}]'::jsonb, 7),
  ('blood_sugar_cardio', 'blood_sugar_cardio_lifestyle', 'lifestyle', '飯後代謝啟動', '飯後代謝啟動：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"飯後步行","description":"協助肌肉利用血糖，降低食睏。","dosage":"飯後 10-15 分鐘"},{"name":"含糖飲停用","description":"減少游離糖與血糖波動。","dosage":"連續 14 天"}]'::jsonb, 7),
  ('endocrine_hormone', 'endocrine_hormone_nutrition', 'nutrition', '內分泌穩定飲食', '內分泌穩定飲食：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"食物四分法","description":"蔬菜、水果、優質蛋白質、全穀根莖各 25%，建立低發炎餐盤。","dosage":"每日主要餐盤執行"},{"name":"低溫原型飲食","description":"減少油炸、燒烤與高度加工食品，降低 AGEs 與氧化油脂。","dosage":"每日至少 2 餐"}]'::jsonb, 7),
  ('endocrine_hormone', 'endocrine_hormone_supplement', 'supplement', '壓力軸標靶營養素', '壓力軸標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持抗氧化、膠原蛋白合成、血管與黏膜修復。","dosage":"依產品標示與個人耐受"},{"name":"Omega-3","description":"協助平衡 Omega-6 促發炎路徑，支持血管、腦部與關節。","dosage":"依產品標示每日補充"}]'::jsonb, 7),
  ('endocrine_hormone', 'endocrine_hormone_lifestyle', 'lifestyle', '腎上腺節律修復', '腎上腺節律修復：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"咖啡因截止時間","description":"降低夜間亢奮與睡眠破碎。","dosage":"每日 14:00 後不攝取"},{"name":"壓力降載時段","description":"建立固定放鬆儀式，降低交感神經長期亢奮。","dosage":"每日 10 分鐘"}]'::jsonb, 7),
  ('muscle_bone', 'muscle_bone_nutrition', 'nutrition', '肌骨結締組織餐盤', '肌骨結締組織餐盤：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"食物四分法","description":"蔬菜、水果、優質蛋白質、全穀根莖各 25%，建立低發炎餐盤。","dosage":"每日主要餐盤執行"},{"name":"低溫原型飲食","description":"減少油炸、燒烤與高度加工食品，降低 AGEs 與氧化油脂。","dosage":"每日至少 2 餐"}]'::jsonb, 7),
  ('muscle_bone', 'muscle_bone_supplement', 'supplement', '關節筋膜標靶營養素', '關節筋膜標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持抗氧化、膠原蛋白合成、血管與黏膜修復。","dosage":"依產品標示與個人耐受"},{"name":"Omega-3","description":"協助平衡 Omega-6 促發炎路徑，支持血管、腦部與關節。","dosage":"依產品標示每日補充"}]'::jsonb, 7),
  ('muscle_bone', 'muscle_bone_lifestyle', 'lifestyle', '低衝擊活動修復', '低衝擊活動修復：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"溫和有氧","description":"促進微循環與粒線體功能。","dosage":"每週 3-5 次，每次 20-30 分鐘"},{"name":"伸展與筋膜放鬆","description":"改善肌肉緊繃與關節活動度。","dosage":"每日 10 分鐘"}]'::jsonb, 7),
  ('immune', 'immune_nutrition', 'nutrition', '免疫屏障飲食', '免疫屏障飲食：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"食物四分法","description":"蔬菜、水果、優質蛋白質、全穀根莖各 25%，建立低發炎餐盤。","dosage":"每日主要餐盤執行"},{"name":"低溫原型飲食","description":"減少油炸、燒烤與高度加工食品，降低 AGEs 與氧化油脂。","dosage":"每日至少 2 餐"}]'::jsonb, 7),
  ('immune', 'immune_supplement', 'supplement', '免疫抗氧化標靶營養素', '免疫抗氧化標靶營養素：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"維生素 C","description":"支持免疫屏障、膠原蛋白與抗氧化。","dosage":"依產品標示"},{"name":"槲皮素","description":"協助穩定肥大細胞與組織胺反應。","dosage":"依產品標示"}]'::jsonb, 7),
  ('immune', 'immune_lifestyle', 'lifestyle', '過敏觸發紀錄', '過敏觸發紀錄：依據 Dr. Marvin 七大系統標靶滅火邏輯，提供非診斷性的日常支持建議。', '[{"name":"黃金睡眠","description":"睡眠是組織修復與大腦排毒的核心時段。","dosage":"每晚 7-8 小時"},{"name":"腹式呼吸","description":"啟動副交感神經，協助壓力降載與修復。","dosage":"每日 5-10 分鐘"}]'::jsonb, 7)
on conflict (protocol_code) do update set
  system_category = excluded.system_category,
  protocol_type = excluded.protocol_type,
  protocol_title = excluded.protocol_title,
  protocol_body = excluded.protocol_body,
  items = excluded.items,
  priority = excluded.priority;
