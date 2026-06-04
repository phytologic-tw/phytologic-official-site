-- ============================================================================
-- Phytologic products catalog V2
-- ============================================================================
-- Purpose:
--   Upsert the 2026-06-04 seven-item product catalog into public.products.
--
-- Source:
--   ../../04_AI/ai-architecture/products/product-database-v1.json
--   ../../04_AI/ai-architecture/products/recommendation-rules-v1.json
--
-- Notes:
--   - Safe to rerun.
--   - This does not recreate public.products.
--   - Existing app code still uses short IDs: snow / lime / rose / cinna / berry.
--   - Canonical product IDs are stored in metadata.canonical_id to avoid breaking
--     current Dr. Marvin recommendation rules and existing reports.
--   - white_gold_base and platinum are new app-compatible IDs.
--   - Nutrition data remains estimated_internal until official lab verification.
-- ============================================================================

insert into public.products (
  id,
  slug,
  sort_order,
  name,
  short_name,
  color_name,
  theme,
  description,
  focus,
  tags,
  audience,
  ingredients,
  best_for,
  system_keys,
  line_summary,
  bg_color,
  text_color,
  status,
  metadata
)
values
(
  'white_gold_base',
  'white-gold-base',
  5,
  '白金基底液',
  '白金基底',
  '白金',
  '五色植萃共同乳化載體',
  '白金｜以大豆蛋白、南杏脂質與白蓮子膠體建立絲滑口感，讓五色植萃更好喝、更穩定。',
  'base / emulsion / texture',
  array['天然乳化', '絲滑口感', '五色底盤']::text[],
  '五色植萃共同基底，不作為單獨強效商品',
  array['大黃豆', '南杏片', '白蓮子', '葛鬱金粉']::text[],
  array['口感穩定', '腸胃友善', '營養承載', '脂溶性植化素分散']::text[],
  array['base', 'digestion', 'carrier']::text[],
  '五色植萃的共同乳化載體，讓植物蛋白、脂質與膠體形成更穩定的絲滑口感。',
  '#EFE7D4',
  '#B79A5B',
  'active',
  '{
    "canonical_id": "white_gold_base_liquid",
    "product_role": "base_carrier",
    "nutrition_status": "estimated_internal",
    "safety_notes": {
      "absolute_avoid": ["已知大豆或堅果嚴重過敏者"],
      "relative_caution": ["急性痛風發作期", "需控制嘌呤攝取者"],
      "consult_professional": ["孕期、慢性腎臟病或特殊飲食限制者"]
    }
  }'::jsonb
),
(
  'snow',
  'snow',
  10,
  '雪山植萃',
  '雪山',
  '珍珠白',
  '溫和絲滑・腸胃友善・用腦支持',
  '珍珠白｜溫和絲滑的白色植萃，適合腸胃敏感、用腦多、需要日常修復感的人。',
  'sleep / stress / immune',
  array['溫和白色植萃', '腸胃友善', '用腦支持']::text[],
  '腸胃敏感、高壓用腦、睡眠品質不穩者',
  array['核桃', '銀耳', '山藥', '蘋果', '豆薯']::text[],
  array['用腦多', '睡眠節奏', '壓力日常', '腸胃敏感']::text[],
  array['sleep', 'stress', 'immune']::text[],
  '適合高壓用腦、睡眠節奏不穩與腸胃敏感時，作為溫和的日常保養起點。',
  '#F5EFE4',
  '#A98E61',
  'active',
  '{
    "canonical_id": "snow_mountain_white",
    "product_role": "functional_drink",
    "nutrition_status": "estimated_internal",
    "price": { "currency": "TWD", "unit_price": 80, "pack_7_member": 532, "pack_21_member": 1428 },
    "safety_notes": {
      "absolute_avoid": ["堅果嚴重過敏者"],
      "relative_caution": ["需嚴格控糖或低碳飲食者需注意總碳水"],
      "consult_professional": ["糖尿病、腎臟病、特殊飲食治療者"]
    }
  }'::jsonb
),
(
  'lime',
  'lime',
  20,
  '青檸植萃',
  '青檸',
  '翡翠綠',
  '清爽高纖・代謝節奏・體內環保',
  '翡翠綠｜清爽高纖的綠色植萃，適合外食多、想讓身體輕盈一點的人。',
  'digestion / metabolism',
  array['高纖蔬果', '代謝節奏', '清爽輕盈']::text[],
  '外食族、久坐少動、消化節奏不順者',
  array['地瓜葉', '青江菜', '黑木耳', '芭樂', '檸檬']::text[],
  array['外食多', '飲食負擔', '代謝節奏', '蔬果不足']::text[],
  array['digestion', 'metabolism']::text[],
  '適合外食較多、飲食負擔重或蔬果攝取不足時，補充清爽高纖與綠色植化素。',
  '#DDEEDB',
  '#1E6B43',
  'active',
  '{
    "canonical_id": "lime_green",
    "product_role": "functional_drink",
    "nutrition_status": "estimated_internal",
    "price": { "currency": "TWD", "unit_price": 80, "pack_7_member": 532, "pack_21_member": 1428 },
    "safety_notes": {
      "absolute_avoid": [],
      "relative_caution": ["慢性腎臟病需控制鉀攝取者", "服用抗凝血藥物且需穩定維生素 K 攝取者"],
      "consult_professional": ["孕期、腎臟病、特殊藥物使用者"]
    }
  }'::jsonb
),
(
  'rose',
  'rose',
  30,
  '玫瑰植萃',
  '玫瑰',
  '寶石紅',
  '女性保養・氣色・抗氧化',
  '寶石紅｜為氣色與日常保養設計的紅色植萃，補充維 C 與紅紫色植化素。',
  'female / beauty / circulation',
  array['女性日常', '紅紫植化素', '氣色光澤']::text[],
  '重視氣色、肌膚與女性日常保養者',
  array['甜菜根', '紫甘藍', '玫瑰花瓣', '芭樂', '百香果']::text[],
  array['氣色', '肌膚光澤', '女性日常', '抗氧化營養']::text[],
  array['circulation', 'female', 'beauty']::text[],
  '適合重視氣色、肌膚光澤與女性日常保養時，補充紅紫色植化素與維 C。',
  '#F5DDE2',
  '#AA3F57',
  'active',
  '{
    "canonical_id": "rose_red",
    "product_role": "functional_drink",
    "nutrition_status": "estimated_internal",
    "price": { "currency": "TWD", "unit_price": 80, "pack_7_member": 532, "pack_21_member": 1428 },
    "safety_notes": {
      "absolute_avoid": [],
      "relative_caution": ["甲狀腺功能低下或甲狀腺腫大者需留意十字花科蔬菜攝取頻率"],
      "consult_professional": ["孕期、特殊婦科病史、慢性病或藥物使用者"]
    }
  }'::jsonb
),
(
  'cinna',
  'cinna',
  40,
  '桂香植萃',
  '桂香',
  '金鑽黃',
  '運動後補給・黃色植化素',
  '金鑽黃｜為運動後與體力補給設計的黃色植萃，補充能量、植化素與清爽桂香。',
  'muscle / exercise / energy',
  array['運動後補給', '黃色植化素', '薑黃']::text[],
  '運動健身族、體力消耗大、需要運動後補給者',
  array['甜玉米', '紅蘿蔔', '黃甜椒', '薑黃', '桂華精釀液']::text[],
  array['運動後', '體力消耗', '能量補給', '黃色植化素']::text[],
  array['musculoskeletal', 'energy', 'metabolism']::text[],
  '適合運動後或體力消耗大的情境，補充能量與黃色植化素；控糖族群需先確認。',
  '#F8E6AD',
  '#B8871B',
  'active',
  '{
    "canonical_id": "cinnamon_gold",
    "product_role": "functional_drink",
    "nutrition_status": "estimated_internal",
    "price": { "currency": "TWD", "unit_price": 110, "pack_7_member": 731.5, "pack_21_member": 1963.5 },
    "variant_notes": ["【待 Bryan 確認】低糖日常版：將桂華精釀液調降至 15-20g 或改無糖桂花茶濃縮液。"],
    "safety_notes": {
      "absolute_avoid": [],
      "relative_caution": ["糖尿病、胰島素阻抗、妊娠糖尿病或極低碳飲食者不建議使用標準運動版", "睡前不建議飲用標準運動版"],
      "consult_professional": ["控糖、孕期、慢性病或特殊飲食限制者"]
    }
  }'::jsonb
),
(
  'berry',
  'berry',
  50,
  '紫莓植萃',
  '紫莓',
  '水晶紫',
  '3C 護眼・紫色植化素',
  '水晶紫｜為長時間使用 3C 的現代人設計，補充紫色花青素與橘紅色植化素。',
  'eye / screen / antioxidant',
  array['3C族保養', '花青素', '紫色植化素']::text[],
  '長時間使用 3C、護眼與抗氧化需求族群',
  array['木鱉果', '藍莓', '桑椹', '紫薯', '紫甘藍']::text[],
  array['長時間螢幕', '3C疲勞', '用眼過度', '抗氧化營養']::text[],
  array['eye', 'screen', 'antioxidant', 'energy']::text[],
  '適合長時間使用螢幕與用眼過度的日常，補充紫色花青素與橘紅色植化素。',
  '#E7DDF6',
  '#65439A',
  'active',
  '{
    "canonical_id": "berry_purple",
    "product_role": "functional_drink",
    "nutrition_status": "estimated_internal",
    "price": { "currency": "TWD", "unit_price": 110, "pack_7_member": 731.5, "pack_21_member": 1963.5 },
    "safety_notes": {
      "absolute_avoid": [],
      "relative_caution": ["限鈉或重度高血壓者需注意海鹽添加", "腎臟病者需配合每日鈉與鉀攝取"],
      "consult_professional": ["腎臟病、高血壓、特殊藥物使用者"]
    }
  }'::jsonb
),
(
  'platinum',
  'platinum',
  60,
  '鉑金植萃',
  '鉑金',
  '鉑金',
  '高蛋白・低糖感・輕盈管理',
  '鉑金｜高蛋白、低糖感、輕盈管理的進階植萃基底，適合體態與蛋白補充需求。',
  'protein / body composition / lightness',
  array['高植物蛋白', '低糖感', '輕盈管理']::text[],
  '體態管理、蛋白補充、運動與熟齡族群',
  array['大黃豆', '大薏仁', '南杏片', '葛鬱金粉']::text[],
  array['蛋白補充', '體態管理', '低糖感需求', '熟齡營養']::text[],
  array['protein', 'body_composition', 'musculoskeletal', 'metabolism']::text[],
  '高植物蛋白、低糖感與輕盈管理的進階商品；痛風、大豆過敏或腎臟病族群需先確認。',
  '#E9E3D6',
  '#7E735F',
  'active',
  '{
    "canonical_id": "platinum_elixir",
    "product_role": "advanced_base",
    "nutrition_status": "estimated_internal",
    "price": { "currency": "TWD", "unit_price": 50, "pack_7_member": 332.5, "pack_21_member": 892.5 },
    "safety_notes": {
      "absolute_avoid": ["急性痛風發作期", "大豆嚴重過敏者"],
      "relative_caution": ["高尿酸或需控制嘌呤攝取者", "腎臟病或需限制蛋白質者"],
      "consult_professional": ["痛風、腎臟病、孕期、慢性病或特殊飲食限制者"]
    }
  }'::jsonb
)
on conflict (id) do update set
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  name = excluded.name,
  short_name = excluded.short_name,
  color_name = excluded.color_name,
  theme = excluded.theme,
  description = excluded.description,
  focus = excluded.focus,
  tags = excluded.tags,
  audience = excluded.audience,
  ingredients = excluded.ingredients,
  best_for = excluded.best_for,
  system_keys = excluded.system_keys,
  line_summary = excluded.line_summary,
  bg_color = excluded.bg_color,
  text_color = excluded.text_color,
  status = excluded.status,
  metadata = excluded.metadata;
