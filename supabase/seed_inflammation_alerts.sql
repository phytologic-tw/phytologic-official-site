-- ============================================================
-- Dr. Marvin inflammation_alerts seed
-- Source: 01_DOCS/dr-marvin/DR_MARVIN_KNOWLEDGE_BASE.md
-- Generated: 2026-06-02
--
-- Notes:
--   - Seed only. Requires public.inflammation_alerts to exist.
--   - Alert copy uses risk-oriented language, not diagnosis.
-- ============================================================

do $$
begin
  if to_regclass('public.inflammation_alerts') is null then
    raise exception 'public.inflammation_alerts does not exist. Run supabase/dr_marvin_question_engine.sql before this seed.';
  end if;

  alter table public.inflammation_alerts
    add column if not exists alert_code text,
    add column if not exists trigger_systems text[] not null default '{}',
    add column if not exists trigger_min_score numeric not null default 8,
    add column if not exists alert_title text,
    add column if not exists alert_body text,
    add column if not exists priority integer not null default 5,
    add column if not exists recommended_action text,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now(),
    add column if not exists is_active boolean not null default true;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'inflammation_alerts_alert_code_key'
      and conrelid = 'public.inflammation_alerts'::regclass
  ) then
    alter table public.inflammation_alerts
      add constraint inflammation_alerts_alert_code_key
      unique (alert_code);
  end if;
end $$;

insert into public.inflammation_alerts
(alert_code, trigger_systems, trigger_min_score, alert_title, alert_body, priority, recommended_action)
values
  ('gut_immune_leaky', ARRAY['digestive', 'immune'], 8, '腸漏症高風險警示', '消化與免疫系統同時出現高發炎分數，可能代表腸道屏障與過敏反應互相牽動。', 9, '建議先執行四週飲食觀察，暫停常見致敏來源如麩質與乳製品，並以高纖蔬果、發酵食物與腸道黏膜修復營養素支持日常調整。'),
  ('brain_endocrine_adrenal', ARRAY['brain_nerve', 'endocrine_hormone'], 8, '腎上腺疲勞風險警示', '大腦神經與內分泌系統同時偏高，可能與長期壓力、睡眠負債與自律神經失衡有關。', 9, '優先調整睡眠時段、減少晚間刺激物，安排腹式呼吸、冥想或溫和伸展，並觀察下午疲勞與夜間亢奮是否改善。'),
  ('metabolic_liver_syndrome', ARRAY['blood_sugar_cardio', 'detox_liver'], 8, '代謝症候群風險警示', '血糖心血管與肝膽排毒分數同時偏高，可能反映精緻糖、酒精、外食油脂與肝臟代謝負擔交互影響。', 9, '建議降低精緻澱粉與含糖飲，增加原型蔬菜、優質蛋白與低溫烹調，並以健檢數據追蹤血糖、血脂與肝指數。'),
  ('muscle_immune_joint', ARRAY['muscle_bone', 'immune'], 8, '自體免疫關節發炎風險', '肌肉骨骼與免疫系統同時偏高時，需留意對稱性關節痛、晨僵、皮膚與過敏反覆發作等線索。', 8, '建議記錄關節不適時間、位置與飲食關聯，減少高糖與高溫油炸食物，並在症狀持續時尋求專業評估。'),
  ('thyroid_brain_signal', ARRAY['endocrine_hormone', 'brain_nerve'], 8, '甲狀腺失衡風險提示', '內分泌與大腦神經分數偏高，可能與疲勞、腦霧、手腳冰冷、眉毛外側稀疏或睡眠節律不穩有關。', 8, '建議整理睡眠、體溫、精神狀態與近期健檢資料，優先穩定作息與壓力，再視情況諮詢專業人員。'),
  ('insulin_hormone_resistance', ARRAY['blood_sugar_cardio', 'endocrine_hormone'], 8, '胰島素阻抗風險提示', '血糖心血管與內分泌系統同時偏高，可能代表血糖波動、壓力荷爾蒙與體脂調節互相影響。', 9, '建議先降低含糖飲與宵夜，將每餐蛋白質、蔬菜與全穀根莖比例固定，並追蹤飯後精神、飢餓感與腰圍變化。'),
  ('detox_immune_mast_cell', ARRAY['detox_liver', 'immune'], 8, '肥大細胞不穩定風險', '排毒肝膽與免疫系統同時偏高，可能與環境毒素、組織胺反應、皮膚或呼吸道過敏反覆相關。', 8, '建議觀察食物、酒精、清潔用品與環境刺激的關聯，減少加工品與高組織胺食物，補足蔬果與抗氧化來源。'),
  ('multi_system_high', ARRAY['brain_nerve', 'digestive', 'detox_liver', 'blood_sugar_cardio', 'endocrine_hormone', 'muscle_bone', 'immune'], 8, '多系統高發炎警示', '若七大系統中有五個以上達高分，代表身體可能處於多系統耗損狀態，需要先降低總發炎負荷。', 10, '建議先做兩週基礎重整：固定睡眠、停高糖與油炸、增加蔬菜與水分、降低壓力刺激；若分數持續偏高，應尋求醫師或營養師協助。')
on conflict (alert_code) do update set
  trigger_systems = excluded.trigger_systems,
  trigger_min_score = excluded.trigger_min_score,
  alert_title = excluded.alert_title,
  alert_body = excluded.alert_body,
  priority = excluded.priority,
  recommended_action = excluded.recommended_action;
