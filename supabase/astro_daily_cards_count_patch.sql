-- ============================================================
-- Phytologic 命理資料庫 Patch
-- 修正今日四卡與抽卡牌組 seed 筆數
--
-- Target:
--   numerology_daily_cards: 27 -> 36
--   numerology_card_deck:   36 -> 40
--
-- Safe to run more than once.
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS numerology_daily_cards_flow_type_unique
  ON numerology_daily_cards(flow_number, card_type);

CREATE UNIQUE INDEX IF NOT EXISTS numerology_card_deck_illustration_key_unique
  ON numerology_card_deck(illustration_key);

INSERT INTO numerology_daily_cards
  (flow_number, card_type, title, content, positive_affirmation)
SELECT flow_number, 'draw_card', title, content, positive_affirmation
FROM (VALUES
  (1, '今日抽卡：啟動', '今天的數字牌提醒你：先行動，再校準。抽一張牌，讓直覺替你選出第一個小方向。', '我允許自己先開始，答案會在行動中浮現。'),
  (2, '今日抽卡：聆聽', '今天的數字牌提醒你：不用急著決定。抽一張牌，聽見關係、情緒與直覺裡真正的訊號。', '我安靜聆聽，溫柔接住自己的感受。'),
  (3, '今日抽卡：表達', '今天的數字牌提醒你：靈感需要出口。抽一張牌，把腦中的光變成一句話、一個行動或一份作品。', '我誠實表達，讓創意自然流動。'),
  (4, '今日抽卡：落地', '今天的數字牌提醒你：穩定就是力量。抽一張牌，替今天選一件可以完成的具體小事。', '我踏實完成一件事，讓生活更有秩序。'),
  (5, '今日抽卡：流動', '今天的數字牌提醒你：改變不是失控，而是生命更新。抽一張牌，讓自己多一點彈性與自由。', '我信任變化，在流動裡照顧自己。'),
  (6, '今日抽卡：照顧', '今天的數字牌提醒你：美與愛都需要被創造。抽一張牌，選一個能讓自己或他人變柔軟的行動。', '我用愛創造，也允許自己被愛照顧。'),
  (7, '今日抽卡：洞察', '今天的數字牌提醒你：慢下來，智慧才會說話。抽一張牌，讓內在替你指出真正需要整理的地方。', '我信任內在智慧，答案正在成形。'),
  (8, '今日抽卡：力量', '今天的數字牌提醒你：豐盛來自清楚的自我價值。抽一張牌，看看今天該如何穩穩使用力量。', '我知道自己的價值，穩定迎向豐盛。'),
  (9, '今日抽卡：完成', '今天的數字牌提醒你：放下也是一種完成。抽一張牌，為舊週期收尾，也為新開始留空間。', '我感謝過去，輕盈地迎接新的開始。')
) AS v(flow_number, title, content, positive_affirmation)
WHERE NOT EXISTS (
  SELECT 1
  FROM numerology_daily_cards c
  WHERE c.flow_number = v.flow_number
    AND c.card_type = 'draw_card'
);

INSERT INTO numerology_card_deck
  (number, card_title, card_message, action_hint, energy_type, illustration_key)
SELECT number, card_title, card_message, action_hint, energy_type, illustration_key
FROM (VALUES
  (1, '新的名字', '今天的你可以替自己取一個新的名字：不是身份證上的名字，而是你想成為的狀態。當你命名自己，你也開始創造自己。', '寫下一個今天想活出的狀態，例如「穩定的人」、「勇敢的人」或「清楚的人」。', 'high', 'card_1_new_name'),
  (4, '小小紀律', '真正改變生活的，往往不是巨大的決心，而是一個小到不會失敗的紀律。今天，讓紀律成為溫柔的支撐。', '設定一個今天一定能完成的 3 分鐘健康行動，並真的完成它。', 'neutral', 'card_4_tiny_discipline'),
  (6, '溫柔邊界', '照顧別人之前，也要記得照顧自己的邊界。今天的愛不是無限付出，而是清楚、溫柔、有界線。', '對一件讓你消耗的事，練習說一句溫柔但清楚的拒絕。', 'reflective', 'card_6_boundary'),
  (8, '穩定收穫', '你已經累積了比自己以為更多的力量。今天不必急著證明，只要穩定整理資源，收穫就會慢慢靠近。', '整理一項你的資源：時間、金錢、人脈或技能，看看它能如何支持接下來的你。', 'neutral', 'card_8_harvest')
) AS v(number, card_title, card_message, action_hint, energy_type, illustration_key)
WHERE NOT EXISTS (
  SELECT 1
  FROM numerology_card_deck c
  WHERE c.illustration_key = v.illustration_key
);

SELECT 'numerology_daily_cards' AS table_name, COUNT(*) AS count FROM numerology_daily_cards
UNION ALL
SELECT 'numerology_card_deck', COUNT(*) FROM numerology_card_deck;
