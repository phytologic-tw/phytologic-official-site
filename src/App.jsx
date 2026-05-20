import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  Dumbbell,
  Eye,
  FlaskConical,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  X,
} from "lucide-react";
import HealthAssessment from "./components/HealthAssessment";
import AdminDashboard from "./components/admin/AdminDashboard";
import FloatingLineButton from "./components/line/FloatingLineButton";
import LineQRCode from "./components/line/LineQRCode";
import { handleOpenLine } from "./components/line/lineConfig";
import { listPublicRecords, submitPublicRecord } from "./lib/adminData";

const logo = "/logo.png";
const lineId = "@phytologic";

const products = [
  {
    id: "green",
    name: "青檸植萃",
    english: "Emerald Green",
    colorName: "翡翠綠",
    theme: "代謝循環・腸道順暢・體內環保",
    icon: Leaf,
    accent: "#DDE8D5",
    deep: "#2F6E4E",
    plantCount: 12,
    formula: "由地瓜葉、青江菜、黑木耳、芭樂、檸檬等共 12 項蔬果穀植物所組成，建立以代謝循環與體內環保為核心的植物機能系統。",
    desc: "以深綠植萃、膳食纖維與清爽青檸酸香，支持外食族的日常代謝循環與排便順暢。",
    tags: ["代謝循環", "腸道順暢", "膳食纖維", "外食族"],
    aiHint: "Dr.Marvin 可能會在你的快篩出現腸胃與代謝警訊時推薦此產品。",
    sections: [
      { title: "核心成分｜純天然無化學添加", text: "由地瓜葉、青江菜、黑木耳、芭樂、檸檬等共 12 項蔬果穀植物所組成，搭配鉑金基底液，保留葉綠素、膳食纖維與維生素 C 的自然機能。" },
      { title: "植物機能與身體影響", text: "深綠蔬菜提供葉綠素與植化素，黑木耳與芭樂補上纖維與清爽感，有助於維持消化節奏、支持代謝循環，讓身體在高油、高鹽與外食頻率高的生活中回到輕盈狀態。" },
      { title: "最適合的目標族群", text: "適合外食族、久坐上班族、排便節奏不固定、常覺得身體沉重，或希望以更自然方式建立每日體內環保習慣的人。" },
      { title: "產品獨家特色", text: "不是單一果汁邏輯，而是以綠色蔬果、木耳纖維與堅果基底組成的植物機能系統，同時兼顧清爽入口與飽足感。" },
      { title: "具備層次的感官味道", text: "前段是清爽青檸香氣，中段帶出綠色蔬果清甜，尾韻由鉑金基底液的堅果感收束，乾淨、有層次、不厚重。" },
    ],
  },
  {
    id: "white",
    name: "雪山植萃",
    english: "Pearl White",
    colorName: "珍珠白",
    theme: "溫和修復・抗發炎支持・腸胃滋養",
    icon: Sparkles,
    accent: "#EEE6D8",
    deep: "#9D8360",
    plantCount: 11,
    formula: "由山藥、銀耳、生核桃、蘋果、紅棗等共 11 項蔬果穀植物所組成，建立溫和修復與抗發炎支持的植物機能系統。",
    desc: "以山藥、銀耳與核桃建立溫潤基底，支持熬夜、壓力疲勞與腸胃敏感時的日常穩定。",
    tags: ["溫和修復", "植物多醣", "熬夜族", "壓力疲勞"],
    aiHint: "Dr.Marvin 可能會在你的快篩出現睡眠、壓力或免疫警訊時推薦此產品。",
    sections: [
      { title: "核心成分｜純天然無化學添加", text: "由山藥、銀耳、生核桃、蘋果、紅棗等共 11 項蔬果穀植物所組成，以植物多醣、水溶性膳食纖維與 Omega-3 形成溫和機能基底。" },
      { title: "植物機能與身體影響", text: "山藥與銀耳提供細緻滑順的植物多醣，核桃帶來植物性脂肪酸，老薑提供溫熱感，有助於支持壓力疲勞後的平衡感與腸胃滋養。" },
      { title: "最適合的目標族群", text: "適合熬夜族、壓力疲勞明顯、腸胃容易敏感、早晨精神不穩，或希望用溫和植物配方照顧日常狀態的人。" },
      { title: "產品獨家特色", text: "以白色與溫潤食材建立低刺激、柔順、可長期飲用的機能層次，讓植物支持不尖銳、不沉重。" },
      { title: "具備層次的感官味道", text: "入口有蘋果與紅棗果香，中段是溫潤堅果奶香，尾段帶出老薑溫熱尾韻，像一杯清醒而安定的植物飲。" },
    ],
  },
  {
    id: "rose",
    name: "玫瑰植萃",
    english: "Ruby Rose",
    colorName: "寶石紅",
    theme: "女性保養・氣色循環・抗氧化支持",
    icon: Heart,
    accent: "#EAD4D8",
    deep: "#A64F61",
    plantCount: 12,
    formula: "由甜菜根、紫甘藍、芭樂、百香果、玫瑰花瓣等共 12 項蔬果穀植物所組成，建立女性保養與抗氧化支持的植物機能系統。",
    desc: "以紅紫色植化素、維生素 C 與玫瑰尾韻，支持氣色循環、女性保養與膠原蛋白生成。",
    tags: ["女性保養", "氣色循環", "花青素", "維生素 C"],
    aiHint: "Dr.Marvin 可能會在你的快篩出現女性保養、氣色或抗氧化需求時推薦此產品。",
    sections: [
      { title: "核心成分｜純天然無化學添加", text: "由甜菜根、紫甘藍、芭樂、百香果、玫瑰花瓣等共 12 項蔬果穀植物所組成，提供花青素、維生素 C 與紅紫色植化素。" },
      { title: "植物機能與身體影響", text: "甜菜根與紫甘藍支持紅潤氣色與循環感，芭樂與百香果補充維生素 C，有助於膠原蛋白生成支持與日常抗氧化防護。" },
      { title: "最適合的目標族群", text: "適合重視女性保養、氣色管理、肌膚光澤、外在狀態與日常抗氧化支持的人，也適合作為忙碌生活中的美感機能飲。" },
      { title: "產品獨家特色", text: "以紅紫植萃搭配玫瑰花瓣，讓女性保養不只停留在甜美風味，而是具備可感知的植物機能架構。" },
      { title: "具備層次的感官味道", text: "前段是酸甜莓果香，中段有百香果的明亮感，尾韻延伸玫瑰花香與紅棗溫潤感，細緻而不膩。" },
    ],
  },
  {
    id: "gold",
    name: "桂香植萃",
    english: "Golden Osmanthus",
    colorName: "金鑽黃",
    theme: "運動恢復・能量代謝・增肌支持",
    icon: Dumbbell,
    accent: "#EDE0B4",
    deep: "#A57921",
    plantCount: 12,
    formula: "由甜玉米、香蕉、新鮮薑黃、黃甜椒、桂花等共 12 項蔬果穀植物所組成，建立運動恢復與能量代謝支持的植物機能系統。",
    desc: "以甜玉米、香蕉與新鮮薑黃組成金色能量系統，支持訓練後恢復、代謝能量與體能續航。",
    tags: ["運動恢復", "薑黃素", "鉀離子", "維生素 B6"],
    aiHint: "Dr.Marvin 可能會在你的快篩出現肌肉、運動恢復或能量代謝警訊時推薦此產品。",
    sections: [
      { title: "核心成分｜純天然無化學添加", text: "由甜玉米、香蕉、新鮮薑黃、黃甜椒、桂花等共 12 項蔬果穀植物所組成，含薑黃素、鉀離子與維生素 B6 等營養線索。" },
      { title: "植物機能與身體影響", text: "香蕉與甜玉米提供訓練後需要的溫和能量，黃甜椒與薑黃支持抗氧化防護與代謝循環，有助於運動恢復與日常體能管理。" },
      { title: "最適合的目標族群", text: "適合規律運動者、訓練後需要補給的人、體能消耗大、久站外勤，或希望兼顧增肌支持與代謝能量的人。" },
      { title: "產品獨家特色", text: "把運動飲品從單純甜味補給升級成植物機能系統，用金色蔬果、薑黃與桂花建立乾淨又有辨識度的恢復感。" },
      { title: "具備層次的感官味道", text: "前味是百香果與桂花香，中味有玉米香蕉的柔和甜感，最後以堅果基底尾韻收束，飽滿但不負擔。" },
    ],
  },
  {
    id: "purple",
    name: "紫莓植萃",
    english: "Tourmaline Purple",
    colorName: "碧璽紫",
    theme: "護眼抗氧化・3C族群・長時間用眼",
    icon: Eye,
    accent: "#DED6E9",
    deep: "#69528E",
    plantCount: 13,
    formula: "由藍莓、桑椹、紫薯、木鱉果、紫色高麗菜等共 13 項蔬果穀植物所組成，建立護眼抗氧化與長時間用眼支持的植物機能系統。",
    desc: "以紫色植萃與類胡蘿蔔素建立視覺支持網，為長時間用眼與 3C 族群提供日常抗氧化防護。",
    tags: ["長時間用眼", "3C族群", "花青素", "類胡蘿蔔素"],
    aiHint: "Dr.Marvin 可能會在你的快篩出現眼睛疲勞、螢幕使用或抗氧化需求時推薦此產品。",
    sections: [
      { title: "核心成分｜純天然無化學添加", text: "由藍莓、桑椹、紫薯、木鱉果、紫色高麗菜等共 13 項蔬果穀植物所組成，結合花青素與類胡蘿蔔素的紫色機能矩陣。" },
      { title: "植物機能與身體影響", text: "藍莓、桑椹與紫色高麗菜提供花青素，木鱉果帶來類胡蘿蔔素線索，有助於支持長時間用眼、暗處視覺適應與日常抗氧化防護。" },
      { title: "最適合的目標族群", text: "適合 3C 族群、長時間盯螢幕、夜間工作、閱讀量大、眼睛容易乾澀疲勞，或希望維持清晰視覺節奏的人。" },
      { title: "產品獨家特色", text: "以紫色蔬果與木鱉果建立水脂雙向的植化素配置，讓護眼不只是補充單一成分，而是完整植物機能系統。" },
      { title: "具備層次的感官味道", text: "前段是莓果酸香，中段有紫薯甘甜，尾韻由堅果基底帶出圓潤感，酸、甜、厚度平衡清楚。" },
    ],
  },
];

const productCards = [
  {
    id: "white",
    name: "雪山植萃",
    english: "Pearl White",
    colorName: "珍珠白",
    theme: "修復、滋養、抗發炎",
    icon: Sparkles,
    accent: "#EEE6D8",
    deep: "#9D8360",
    formula: "山藥、蘋果、白木耳、生核桃等天然蔬果穀物組成。",
    desc: "熬夜疲勞、腸胃敏感與身體修復時的溫和滋養。",
    forWho: "久坐辦公室、腸胃敏感、熬夜族",
    tags: ["熬夜疲勞", "腸胃敏感", "身體修復"],
    aiHint: "Dr.Marvin 會在睡眠、壓力、腸胃敏感與修復需求偏高時，優先把雪山植萃列為溫和支持選項。",
    sections: [
      { title: "適合族群", text: "適合熬夜族、壓力疲勞明顯、腸胃容易敏感，或希望用低刺激植物配方照顧日常狀態的人。" },
      { title: "核心食材", text: "以山藥、蘋果、白木耳、生核桃等天然蔬果穀物建立溫潤基底，提供植物多醣、纖維與堅果油脂線索。" },
      { title: "機能說明", text: "重點放在抗發炎支持、腸胃修復與溫和滋養，讓身體在疲勞與敏感狀態下回到穩定節奏。" },
      { title: "飲用情境", text: "適合早晨狀態不穩、熬夜隔天、壓力後恢復，或想用一杯溫和植物飲作為日常保養時飲用。" },
      { title: "AI 推薦邏輯", text: "當 Dr.Marvin 健康分析偵測到睡眠、壓力、免疫或消化訊號較高時，會將此配方作為修復與穩定的推薦方向。" },
      { title: "研究資料入口", text: "完整營養學、植化素與相關科學邏輯，請由研究資料入口集中閱讀，不在首頁一次鋪陳。" },
    ],
  },
  {
    id: "green",
    name: "青檸植萃",
    english: "Emerald Green",
    colorName: "翡翠綠",
    theme: "代謝、循環、體內環保",
    icon: Leaf,
    accent: "#DDE8D5",
    deep: "#2F6E4E",
    formula: "地瓜葉、青江菜、黑木耳、芭樂、檸檬等天然蔬果組成。",
    desc: "代謝卡卡、外食負擔與排除需求的清爽植物支持。",
    forWho: "水腫、代謝慢、想排清體內廢物的人",
    tags: ["代謝卡卡", "外食族", "排除負擔"],
    aiHint: "Dr.Marvin 會在腸胃、代謝、外食頻率與身體沉重感訊號偏高時，優先考慮青檸植萃。",
    sections: [
      { title: "適合族群", text: "適合外食族、久坐上班族、排便節奏不固定、常覺得身體沉重，或想建立每日體內環保習慣的人。" },
      { title: "核心食材", text: "以地瓜葉、青江菜、黑木耳、芭樂、檸檬等天然蔬果組成，補上深綠植萃與膳食纖維線索。" },
      { title: "機能說明", text: "重點放在膳食纖維、促進腸胃蠕動與代謝排除，支持高油、高鹽與外食生活後的清爽感。" },
      { title: "飲用情境", text: "適合外食隔天、久坐後、身體覺得悶重，或需要讓消化節奏回到輕盈狀態時飲用。" },
      { title: "AI 推薦邏輯", text: "當 Dr.Marvin 健康分析偵測到消化、代謝、水腫或外食相關訊號較高時，會推薦此配方作為清理型支持。" },
      { title: "研究資料入口", text: "膳食纖維、植化素、SGS 模擬與更完整科學邏輯，統一收進研究資料入口。" },
    ],
  },
  {
    id: "rose",
    name: "玫瑰植萃",
    english: "Rose Red",
    colorName: "玫瑰紅",
    theme: "氣色、膠原、女性保養",
    icon: Heart,
    accent: "#EAD4D8",
    deep: "#A64F61",
    formula: "甜菜根、紫甘藍、芭樂、百香果、玫瑰花瓣等天然蔬果組成。",
    desc: "好氣色、抗氧化與肌膚彈性的女性日常保養。",
    forWho: "想維持好氣色、注重女性日常保養的人",
    tags: ["好氣色", "抗氧化", "肌膚彈性"],
    aiHint: "Dr.Marvin 會在氣色、抗氧化、女性保養與膠原生成支持需求出現時，推薦玫瑰植萃。",
    sections: [
      { title: "適合族群", text: "適合重視氣色管理、女性保養、肌膚光澤、日常抗氧化與外在狀態的人。" },
      { title: "核心食材", text: "以甜菜根、紫甘藍、芭樂、百香果、玫瑰花瓣等天然蔬果組成，提供紅紫色植化素與維生素 C 線索。" },
      { title: "機能說明", text: "重點放在維生素 C、膠原蛋白生成支持與紅潤氣色，讓保養更接近日常飲食。" },
      { title: "飲用情境", text: "適合重要場合前、忙碌工作日、肌膚狀態需要維持，或想把保養變成每日儀式時飲用。" },
      { title: "AI 推薦邏輯", text: "當 Dr.Marvin 健康分析偵測到氣色、女性保養、抗氧化或美感機能需求時，會把此配方列為推薦。" },
      { title: "研究資料入口", text: "維生素 C、花青素與膠原生成相關科學資料，集中於研究資料入口閱讀。" },
    ],
  },
  {
    id: "gold",
    name: "桂香植萃",
    english: "Golden Osmanthus",
    colorName: "金鑽黃",
    theme: "力量、運動、增肌修復",
    icon: Dumbbell,
    accent: "#EDE0B4",
    deep: "#A57921",
    formula: "甜玉米、香蕉、紅蘿蔔、百香果、新鮮薑黃等天然蔬果組成。",
    desc: "運動恢復、肌肉修復與能量補給的金色植物系統。",
    forWho: "有健身習慣、重視體態管理、想維持活力的人",
    tags: ["運動恢復", "肌肉修復", "能量補給"],
    aiHint: "Dr.Marvin 會在肌肉、運動恢復、能量代謝與體能消耗訊號偏高時，推薦桂香植萃。",
    sections: [
      { title: "適合族群", text: "適合規律運動者、訓練後需要補給的人、體能消耗大、久站外勤，或想兼顧增肌修復與能量管理的人。" },
      { title: "核心食材", text: "以甜玉米、香蕉、紅蘿蔔、百香果、新鮮薑黃等天然蔬果組成，建立金色能量與抗氧化線索。" },
      { title: "機能說明", text: "重點放在運動修復、蛋白質利用與抗氧化支持，讓訓練後補給更乾淨、日常化。" },
      { title: "飲用情境", text: "適合運動後、久站外勤後、體能消耗大的一天，或需要溫和能量補給時飲用。" },
      { title: "AI 推薦邏輯", text: "當 Dr.Marvin 健康分析偵測到肌肉緊繃、運動恢復、體力消耗或能量代謝訊號時，會推薦此配方。" },
      { title: "研究資料入口", text: "薑黃、抗氧化與運動修復相關研究資料，集中於研究資料入口閱讀。" },
    ],
  },
  {
    id: "purple",
    name: "紫莓植萃",
    english: "Crystal Purple",
    colorName: "水晶紫",
    theme: "護眼、專注、抗氧化",
    icon: Eye,
    accent: "#DED6E9",
    deep: "#69528E",
    formula: "木鱉果、紫薯、藍莓、桑椹、紫色高麗菜等天然蔬果組成。",
    desc: "3C 用眼、眼睛疲勞與視覺保養的紫色抗氧化支持。",
    forWho: "長時間使用螢幕、眼睛疲勞、重視抗氧化的人",
    tags: ["3C 用眼", "眼睛疲勞", "視覺保養"],
    aiHint: "Dr.Marvin 會在眼睛疲勞、長時間螢幕使用與抗氧化需求偏高時，推薦紫莓植萃。",
    sections: [
      { title: "適合族群", text: "適合 3C 族群、長時間盯螢幕、夜間工作、閱讀量大、眼睛容易乾澀疲勞，或希望維持視覺節奏的人。" },
      { title: "核心食材", text: "以木鱉果、紫薯、藍莓、桑椹、紫色高麗菜等天然蔬果組成，結合紫色植萃與類胡蘿蔔素線索。" },
      { title: "機能說明", text: "重點放在花青素、類胡蘿蔔素與護眼抗氧化，支持長時間用眼後的日常保養。" },
      { title: "飲用情境", text: "適合長時間使用手機與電腦後、閱讀或工作量大的一天，或需要專注與視覺保養時飲用。" },
      { title: "AI 推薦邏輯", text: "當 Dr.Marvin 健康分析偵測到眼睛疲勞、螢幕使用、睡眠不足或抗氧化需求時，會推薦此配方。" },
      { title: "研究資料入口", text: "花青素、類胡蘿蔔素與視覺保養相關科學資料，集中於研究資料入口閱讀。" },
    ],
  },
];

const colorStories = [
  { color: "珍珠白", title: "保持清楚與清醒", text: "希望未來有一天，還能把自己這一輩子學到的東西，好好地分享給孩子。", card: "#F7F1E7", border: "#FFFFFF", textColor: "#2C4739", muted: "#61756A", number: "#A98E61" },
  { color: "翡翠綠", title: "吃得下，才活得好", text: "代謝與腸胃，是一切修復真正的起點。", card: "#DDEEDB", border: "#BFDABC", textColor: "#123828", muted: "#3E6350", number: "#1E6B43" },
  { color: "玫瑰紅", title: "愛美想帥，是想陪伴更久", text: "不是害怕老，而是希望還能保有好的狀態陪孩子長大。", card: "#F5DDE2", border: "#E9BBC6", textColor: "#67283A", muted: "#8A4F5F", number: "#AA3F57" },
  { color: "金鑽黃", title: "真正的力量", text: "當家人需要你的時候，你還有力氣站在前面。", card: "#F8E6AD", border: "#E6C76B", textColor: "#5D4212", muted: "#7B6229", number: "#B8871B" },
  { color: "水晶紫", title: "看見人生重要的瞬間", text: "想再多看看家人的樣子、世界的風景與人生的回憶。", card: "#E7DDF6", border: "#D4C1EF", textColor: "#3E2866", muted: "#654D86", number: "#65439A" },
];

const homeNews = [
  { date: "2026.05", category: "品牌公告", title: "植本邏輯官方網站籌備啟動", text: "以品牌形象、產品教育、Dr.Marvin 與合作加盟為核心，建立完整官方資訊入口。", detail: "官方網站將作為植本邏輯的品牌門面，整合創辦理念、產品教育、Dr.Marvin、加盟合作與最新活動資訊，讓消費者、合作夥伴與加盟主都能快速理解品牌價值。" },
  { date: "2026.07", category: "展會消息", title: "高雄加盟展合作計畫啟動", text: "招募城市合作者、門市加盟與衛星據點，共同推動植物機能飲品進入日常生活。", detail: "高雄加盟展將以試飲體驗、品牌說明、城市合作者洽談與門市模型展示為核心，目標建立可複製、可落地、可擴張的植物機能飲品合作系統。" },
  { date: "COMING", category: "系統開發", title: "LINE會員與AI健康推薦系統", text: "以生活狀態、身體反應與個人化資料，建立每日飲品建議與健康陪伴服務。", detail: "第一階段將以LINE作為會員入口，導入AI超級客服、每日推播、飲品推薦、好運顏色、生活任務與回訪紀錄，讓健康服務變得更輕、更近、更容易持續。" },
];

const philosophyCards = [
  { title: "不是飲料，是食物", text: "每一杯都以每天敢給家人吃為底線，回到植物、營養與身體真正需要的本質。", detail: "植本邏輯的產品不是短暫流行的飲料，而是每天會進入身體、長期被吸收、影響未來十年與二十年的食物。因此我們以家人的標準設計產品，重視食材來源、營養邏輯、風味接受度與長期可持續性。" },
  { title: "三好原則", text: "好喝、好看、好吸收。真正能持續的健康，一定要能融入生活。", detail: "好喝，才能每天持續；好看，才能被願意靠近；好吸收，才真正對身體有意義。植本邏輯把健康產品從『忍耐』變成『享受』，讓機能飲品不只是有效，而是能被長期喜歡。" },
  { title: "三無鐵律", text: "無人工、無化學、無合成。真正重要的人，值得最乾淨的選擇。", detail: "我們拒絕人工香精、化學合成風味與不必要的工業添加，盡可能回到真正從土地長出來的植物本源。因為這不是做給市場看的產品，而是做給家人每天吃的東西。" },
];

function DataState({ loading, error, empty, children }) {
  if (loading) {
    return <div className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">資料載入中...</div>;
  }
  if (error) {
    return <div className="rounded-2xl border border-[#E8B4A8] bg-[#FFF7F5] p-7 text-center text-[#9A3C2D]">{error}</div>;
  }
  if (empty) {
    return <div className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">{children || "目前尚無公開資料。"}</div>;
  }
  return null;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#B89B5E]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#123828] md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-[#49675A] md:text-lg">{text}</p>}
    </div>
  );
}

function Pill({ children }) {
  return <span className="rounded-full border border-[#D8C99C]/70 bg-white/70 px-4 py-2 text-sm text-[#355548] shadow-sm">{children}</span>;
}

function ProductMetric({ product }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 shadow-sm backdrop-blur">
      <div className="text-4xl font-semibold leading-none" style={{ color: product.deep }}>{product.plantCount}</div>
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#49675A]">
        種植物機能
        <span className="mt-1 block text-[10px] tracking-[0.16em] text-[#8B7A4C]">PLANT SYSTEM</span>
      </div>
    </div>
  );
}

function ProductSections({ product, compact = false }) {
  const defaultOpen = new Set(["植物機能與身體影響", "最適合的目標族群"]);
  if (compact) {
    return (
      <div className="space-y-3">
        {product.sections.map((section) => (
          <details key={section.title} open={defaultOpen.has(section.title)} className="group rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#123828]">
              {section.title}
              <ChevronDown className="h-4 w-4 shrink-0 text-[#8B7A4C] transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-7 text-[#49675A]">{section.text}</p>
          </details>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {product.sections.map((section, index) => (
        <div key={section.title} className="rounded-2xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: product.deep }}>0{index + 1}</span>
            <h4 className="text-base font-semibold text-[#123828]">{section.title}</h4>
          </div>
          <p className="mt-3 text-sm leading-7 text-[#49675A]">{section.text}</p>
        </div>
      ))}
    </div>
  );
}

function ProductSystemCard({ product, onMore }) {
  const Icon = product.icon;
  return (
    <article className="group flex min-h-[460px] flex-col rounded-[1.5rem] border border-white/80 bg-white/72 p-6 shadow-sm shadow-[#123828]/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#123828]/10 md:p-7" style={{ background: `linear-gradient(145deg, rgba(255,255,255,.86), ${product.accent}88)` }}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B7A4C]">{product.colorName}｜{product.english}</div>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#123828]">{product.name}</h3>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: product.deep }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-6 text-lg font-medium leading-8 text-[#123828]">{product.theme}</p>
      <p className="mt-3 text-sm leading-7 text-[#49675A]">{product.desc}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {product.tags.map((tag) => <span key={tag} className="rounded-full border border-white/90 bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#355548] shadow-sm">{tag}</span>)}
      </div>

      <div className="mt-6 rounded-2xl border border-white/80 bg-white/72 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7A4C]">核心食材</div>
        <p className="mt-2 text-sm leading-7 text-[#49675A]">{product.formula}</p>
      </div>

      <button type="button" onClick={() => onMore(product)} className="mt-auto inline-flex w-full items-center justify-between rounded-full bg-[#123828] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#123828]/12 transition hover:bg-[#1E6B43]">
        了解更多
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

const productSlugs = {
  white: "snow",
  green: "lime",
  rose: "rose",
  gold: "gold",
  purple: "purple",
};

const productBySlug = productCards.reduce((items, product) => ({
  ...items,
  [productSlugs[product.id]]: product,
}), {});

function ProductOverviewCard({ product, go }) {
  const Icon = product.icon;
  return (
    <article className="flex min-h-[360px] flex-col rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-sm shadow-[#123828]/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#123828]/10" style={{ background: `linear-gradient(145deg, rgba(255,255,255,.9), ${product.accent}8C)` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8B7A4C]">{product.colorName}</p>
          <h3 className="mt-3 text-3xl font-semibold text-[#123828]">{product.name}</h3>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: product.deep }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium leading-8 text-[#123828]">{product.theme}</p>
      <p className="mt-3 inline-flex items-start gap-2 rounded-full bg-white/55 px-4 py-1.5 text-sm leading-6 text-[#49675A]">
        <span className="shrink-0 text-[#8B7A4C]">適合</span>
        <span className="text-[#123828]">{product.forWho}</span>
      </p>
      <p className="mt-4 text-sm leading-7 text-[#49675A]">{product.formula}</p>
      <button type="button" onClick={() => go(`/products/${productSlugs[product.id]}`)} className="mt-auto inline-flex items-center justify-between rounded-full bg-[#123828] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E6B43]">
        了解更多
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const go = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [route, go];
}

function usePublished(table, order = "published_at") {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        let data = await listPublicRecords(table, { order });
        if (table === "announcements") data = [...data].sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));
        if (!ignore) setItems(data || []);
      } catch (requestError) {
        if (!ignore) {
          setError(`資料讀取失敗：${requestError.message}`);
          setItems([]);
        }
      }
      if (!ignore) setLoading(false);
    }
    load();
    return () => {
      ignore = true;
    };
  }, [table, order]);
  return { items, loading, error };
}

function Header({ route, go }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    { label: "品牌精神", path: "/about" },
    { label: "全植物機能飲", path: "/products" },
    { label: "Dr.Marvin 健康分析", path: "/assessment" },
    { label: "合作募集", path: "/join" },
    { label: "最新消息", path: "/news" },
    { label: "精彩剪影", path: "/gallery" },
  ];
  const handleNav = (item) => {
    setMenuOpen(false);
    go(item.path);
  };
  return (
    <header className="sticky top-0 z-50 border-b border-[#D9D2C4]/55 bg-[#F8F4EC]/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 md:py-3.5">
        <button type="button" onClick={() => go("/")} className="flex items-center gap-3 text-left">
          <img src={logo} alt="植本邏輯 PHYTOLOGIC Logo" className="h-7 w-7 object-contain opacity-90 drop-shadow-[0_7px_15px_rgba(50,62,52,0.10)] md:h-8 md:w-8" />
          <span>
            <span className="block text-[14px] font-medium tracking-[0.22em] text-[#293C34]">植本邏輯</span>
            <span className="block text-[9px] tracking-[0.34em] text-[#8E9588]">PHYTOLOGIC</span>
          </span>
        </button>
        <nav className="hidden items-center gap-7 text-[12px] font-normal text-[#4B5B51] xl:flex">
          {nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className={`transition duration-500 ease-out hover:text-[#9B8558] ${route === item.path ? "text-[#9B8558]" : ""}`}>{item.label}</button>)}
        </nav>
        <button type="button" onClick={handleOpenLine} className="hidden rounded-full border border-[#B7A06B]/45 bg-white/10 px-4 py-1.5 text-[11px] font-normal tracking-[0.1em] text-[#59513F] transition duration-500 ease-out hover:border-[#B7A06B]/75 hover:bg-[#F2EBDD]/50 hover:text-[#7C6738] hover:shadow-[0_0_22px_rgba(183,160,107,0.10)] md:block">會員登入 / 加入會員</button>
        <button type="button" className="xl:hidden" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="border-t border-[#D8CFBE]/55 bg-[#F8F4EC]/96 px-5 py-5 xl:hidden"><div className="grid gap-4">{nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className="text-left text-sm text-[#46584D]">{item.label}</button>)}<button type="button" onClick={handleOpenLine} className="w-fit rounded-full border border-[#B7A06B]/45 px-4 py-1.5 text-[11px] tracking-[0.1em] text-[#4F4A36]">會員登入 / 加入會員</button></div></div>}
    </header>
  );
}

function HomePage({ go }) {
  const entries = [
    { label: "品牌精神", path: "/about", tone: "pearl", icon: ShieldCheck, text: "六個家庭的健康起點" },
    { label: "全植物機能飲", path: "/products", tone: "emerald", icon: Leaf, text: "植物營養的日常支持" },
    { label: "Dr.Marvin\n健康分析", path: "/assessment", tone: "gold", icon: Activity, text: "理解身體當下需求" },
    { label: "合作募集", path: "/join", tone: "rose", icon: Users, text: "讓系統進入更多城市" },
  ];
  return (
    <main>
      <section className="luxury-hero relative isolate overflow-hidden bg-[#F8F4EC] px-5 py-12 md:px-8 md:py-10">
        <div className="luxury-hero-wash pointer-events-none absolute inset-0 -z-10" />
        <div className="luxury-hero-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute left-1/2 top-[48%] -z-10 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A89566]/[0.07]" />
        <div className="mx-auto flex min-h-[calc(100svh-70px)] max-w-6xl flex-col justify-start">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mx-auto max-w-5xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#A89566]/20 bg-[#FBF8F1]/20 shadow-[0_16px_44px_rgba(48,57,49,0.06)] md:h-[3.75rem] md:w-[3.75rem]">
              <img src={logo} alt="植本邏輯 Logo" className="h-9 w-9 object-contain opacity-90 drop-shadow-[0_10px_20px_rgba(60,64,53,0.10)] md:h-9 md:w-9" />
            </div>
            <p className="luxury-kicker mt-7 text-[10px] font-medium uppercase tracking-[0.48em] text-[#9F8B63]">PHYTOLOGIC HEALTH OPERATING SYSTEM</p>
            <h1 className="mx-auto mt-6 max-w-5xl text-[2.35rem] font-medium leading-[1.22] tracking-[0.015em] text-[#243A31] md:text-[3rem] lg:text-[3.25rem]">全植物機能飲 × Dr.Marvin 健康系統</h1>
            <p className="mt-6 whitespace-pre-line text-[1.35rem] font-light leading-[1.7] tracking-[0.02em] text-[#4F6258] md:text-[1.62rem]">讓每一個人活得久，{"\n"}也活得好精彩。</p>
            <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-8 text-[#707D73] md:text-[15px]">以植物、營養與生活型態資料，建立一套能被日常持續的健康入口。</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => go("/assessment")} className="rounded-full border border-[#253A31]/90 bg-[#253A31] px-6 py-3 text-[13px] font-medium tracking-[0.02em] text-[#F8F4EC] shadow-[0_14px_30px_rgba(35,59,49,0.10)] transition duration-500 ease-out hover:-translate-y-px hover:bg-[#2D463B] hover:shadow-[0_16px_36px_rgba(35,59,49,0.13)]">免費分析我的身體狀態</button>
              <button type="button" onClick={() => go("/products")} className="rounded-full border border-[#B7A06B]/60 bg-white/[0.18] px-6 py-3 text-[13px] font-normal tracking-[0.02em] text-[#253A31] transition duration-500 ease-out hover:-translate-y-px hover:border-[#A58B58]/80 hover:bg-[#EFE7D5]/40">探索產品系列</button>
              <button type="button" onClick={handleOpenLine} className="rounded-full border border-[#D8CFBE]/80 bg-transparent px-6 py-3 text-xs font-normal tracking-[0.02em] text-[#6C756D] transition duration-500 ease-out hover:-translate-y-px hover:bg-white/35 hover:text-[#4F6258]">加入 LINE</button>
            </div>
          </motion.div>
          <div className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-x-7 gap-y-8 md:mt-10 md:grid-cols-4 md:gap-x-10">
            {entries.map((entry) => (
              <button key={entry.path} type="button" onClick={() => go(entry.path)} className={`hex-entry hex-entry-${entry.tone} group`}>
                <div className="hex-entry-inner">
                  <entry.icon className="h-4 w-4 opacity-55" />
                  <h2 className="mt-2 whitespace-pre-line text-center text-[12px] font-medium leading-[1.45] tracking-[0.03em] text-[#293C34]">{entry.label}</h2>
                  <p className="mt-1 max-w-[6.75rem] text-center text-[9.5px] font-light leading-[1.65] text-[#707B72]">{entry.text}</p>
                  <ArrowRight className="mt-2 h-3 w-3 opacity-35 transition duration-500 ease-out group-hover:translate-x-px group-hover:opacity-60" />
                </div>
              </button>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-sm font-light leading-8 tracking-[0.02em] text-[#5F6F65]">我們不是在販售飲料，我們是在用自然、科學與愛，守護人生裡真正重要的人。</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-[#9F8B63]">Six Families · Plant Science · Health Identity</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Brand Philosophy" title="品牌精神" text="六個家庭，是植本邏輯重新理解健康之後的起點。" />
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[2rem] border border-[#E7DDBF] bg-white/75 p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold tracking-[0.28em] text-[#B89B5E]">FOUNDER STORY</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-[#123828]">從國際品牌經理人，到一位父親。</h2>
          <div className="mt-7 space-y-5 text-base leading-8 text-[#49675A]">
            <p>年輕時，我們總以為人生最重要的是成功、速度與規模。直到創辦人成為父親，健康才從抽象概念變成能不能陪孩子長大、陪家人旅行、陪愛的人慢慢變老的人生問題。</p>
            <p>植本邏輯因此從六個家庭的真實願望出發，重新研究植物、營養、人體修復、東方藥食智慧與西方營養學。</p>
            <p>真正重要的問題不是能不能賣，而是如果這是每天要給家人吃的東西，它應該長成什麼樣子。</p>
          </div>
        </div>
        <div className="rounded-[2rem] bg-[#123828] p-8 text-white shadow-xl shadow-[#123828]/10 md:p-12">
          <p className="text-sm font-semibold tracking-[0.28em] text-[#D8C99C]">CORE BELIEF</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight">重視生命、尊重自然、相信邏輯。</h2>
          <p className="mt-7 text-base leading-8 text-white/75">我們不是在販售飲料，而是在建立每天會進入身體、長期影響未來十年與二十年的食物系統。</p>
          <div className="mt-8 flex flex-wrap gap-3"><Pill>重視生命</Pill><Pill>尊重自然</Pill><Pill>相信邏輯</Pill></div>
        </div>
      </section>
      <section className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-3">
        {philosophyCards.map((card) => (
          <article key={card.title} className="rounded-[1.5rem] border border-[#E2D5B5] bg-white/70 p-7 shadow-sm">
            <h3 className="text-2xl font-semibold text-[#123828]">{card.title}</h3>
            <p className="mt-4 leading-8 text-[#49675A]">{card.detail}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto mt-10 grid max-w-7xl gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-[#E7DDBF] bg-white/75 p-8">
          <img src={logo} alt="植本邏輯 Logo" className="h-24 w-24 object-contain" />
          <h2 className="mt-6 text-3xl font-semibold text-[#123828]">品牌 LOGO 意義</h2>
          <p className="mt-4 leading-8 text-[#49675A]">以植物為根、以邏輯為形，象徵自然食材、科學判斷與長期陪伴的交會。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {colorStories.slice(0, 3).map((story) => (
            <article key={story.color} className="rounded-[1.5rem] border p-6" style={{ backgroundColor: story.card, borderColor: story.border, color: story.textColor }}>
              <h3 className="text-2xl font-semibold">{story.color}</h3>
              <p className="mt-3 font-medium">{story.title}</p>
              <p className="mt-4 leading-7" style={{ color: story.muted }}>{story.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductsPage({ go }) {
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Product System" title="全植物機能飲" text="先選擇產品，再進入完整介紹。產品總覽只保留核心定位與食材摘要。" />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-5">
        {productCards.map((product) => <ProductOverviewCard key={product.id} product={product} go={go} />)}
      </div>
    </main>
  );
}

function ProductDetailPage({ slug, go }) {
  const product = productBySlug[slug];
  if (!product) {
    return (
      <main className="px-5 py-20 text-center md:px-8">
        <SectionTitle eyebrow="Product" title="找不到這款產品" text="請回到產品總覽重新選擇。" />
        <button type="button" onClick={() => go("/products")} className="rounded-full bg-[#123828] px-7 py-4 font-semibold text-white">回產品總覽</button>
      </main>
    );
  }
  const Icon = product.icon;
  return (
    <main className="px-5 py-16 md:px-8">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-sm" style={{ background: `linear-gradient(145deg, rgba(255,255,255,.9), ${product.accent}99)` }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: product.deep }}><Icon className="h-8 w-8" /></div>
          <p className="mt-7 text-sm font-semibold tracking-[0.28em] text-[#8B7A4C]">{product.colorName}｜{product.english}</p>
          <h1 className="mt-3 text-5xl font-semibold text-[#123828]">{product.name}</h1>
          <p className="mt-5 text-xl leading-9 text-[#49675A]">{product.theme}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => go("/assessment")} className="rounded-full bg-[#123828] px-7 py-4 font-semibold text-white">開始 Dr.Marvin 分析</button>
            <button type="button" onClick={handleOpenLine} className="rounded-full border border-[#06C755] bg-white/75 px-7 py-4 font-semibold text-[#087E3A]">加入官方 LINE</button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["核心定位", product.desc],
            ["主要食材", product.formula],
            ["適合族群", product.sections.find((section) => section.title === "適合族群")?.text],
            ["營養邏輯", product.sections.find((section) => section.title === "機能說明")?.text],
          ].map(([title, text]) => (
            <article key={title} className="rounded-[1.5rem] border border-[#E7DDBF] bg-white/75 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#123828]">{title}</h2>
              <p className="mt-4 leading-8 text-[#49675A]">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function AssessmentPage() {
  return (
    <main className="bg-[#F5F2EB] px-5 py-16 md:px-8">
      <HealthAssessment />
    </main>
  );
}

function JoinPage({ go }) {
  const [formOpen, setFormOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [contactStatus, setContactStatus] = useState("idle");
  const [contactNotice, setContactNotice] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", type: "合作類型", message: "" });
  const updateContact = (field, value) => setContactForm((prev) => ({ ...prev, [field]: value }));
  const submitContact = async (event) => {
    event.preventDefault();
    setContactNotice("");
    if (!contactForm.name || !contactForm.phone || !contactForm.email || contactForm.type === "合作類型" || !contactForm.message) {
      setContactStatus("error");
      setContactNotice("請先完成姓名、電話、Email、合作類型與需求內容。");
      return;
    }
    setContactStatus("loading");
    try {
      await submitPublicRecord("contact_submissions", { ...contactForm, status: "unread" });
      setContactForm({ name: "", phone: "", email: "", type: "合作類型", message: "" });
      setContactStatus("success");
      setFormSent(true);
      setContactNotice("感謝您的洽詢，品牌團隊將儘快與您聯繫。");
    } catch (requestError) {
      setContactStatus("error");
      setContactNotice(`送出失敗：${requestError.message}`);
    }
  };
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Partnership" title="合作募集" text="一起把全植物機能飲與 Dr.Marvin 健康分析帶進更多城市與日常生活。" />
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.9fr]">
        <div className="rounded-[2rem] bg-[#123828] p-8 text-white md:p-12">
          <h2 className="text-4xl font-semibold leading-tight">合作理念</h2>
          <p className="mt-6 text-lg leading-9 text-white/75">我們尋找的不是只想賣產品的人，而是願意一起推動植物機能、健康教育與長期會員陪伴的城市夥伴。</p>
          <div className="mt-8 flex flex-wrap gap-3"><Pill>城市合作者</Pill><Pill>門市加盟</Pill><Pill>衛星據點</Pill><Pill>企業健康方案</Pill></div>
        </div>
        <div className="rounded-[2rem] border border-[#E7DDBF] bg-white/75 p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-[#123828]">合作流程</h2>
          <ol className="mt-6 grid gap-4 text-[#49675A]">
            {["提交合作需求", "品牌團隊初步洽談", "確認合作模式與城市條件", "導入產品、LINE 與 Dr.Marvin 服務", "展開試飲與會員經營"].map((item, index) => (
              <li key={item} className="rounded-2xl bg-[#F9F5EA] p-4"><span className="font-semibold text-[#B89B5E]">0{index + 1}</span> {item}</li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
        {["品牌與產品教育完整建置", "試飲活動與加盟展轉換流程", "LINE 會員與 Dr.Marvin 健康分析導入"].map((item) => (
          <article key={item} className="rounded-[1.5rem] border border-[#E7DDBF] bg-white/75 p-7 shadow-sm">
            <h3 className="text-xl font-semibold text-[#123828]">{item}</h3>
            <p className="mt-4 leading-7 text-[#49675A]">總部提供可複製的營運內容與品牌支持，讓合作夥伴能更快進入市場。</p>
          </article>
        ))}
      </section>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap gap-3">
        <button type="button" onClick={() => setFormOpen((open) => !open)} className="rounded-full bg-[#123828] px-8 py-4 font-semibold text-white">{formOpen ? "收起合作表單" : "我要合作"}</button>
        <button type="button" onClick={() => go("/partners")} className="rounded-full border border-[#B89B5E] bg-white/70 px-8 py-4 font-semibold text-[#123828]">合作據點入口</button>
      </div>
      {formOpen && (
        <form onSubmit={submitContact} className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-[#E7DDBF] bg-white/80 p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2"><input value={contactForm.name} onChange={(e) => updateContact("name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="姓名" /><input value={contactForm.phone} onChange={(e) => updateContact("phone", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="電話" /><input value={contactForm.email} onChange={(e) => updateContact("email", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="Email" /><select value={contactForm.type} onChange={(e) => updateContact("type", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]"><option>合作類型</option><option>門市加盟</option><option>城市合作者</option><option>企業健康方案</option><option>試飲活動</option><option>媒體/其他</option></select></div>
          <textarea value={contactForm.message} onChange={(e) => updateContact("message", e.target.value)} className="mt-5 min-h-36 w-full rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="請留下您的需求與所在城市" />
          <button disabled={contactStatus === "loading"} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#123828] px-8 py-4 font-medium text-white shadow-xl shadow-[#123828]/15 transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]">{contactStatus === "loading" ? "送出中..." : formSent ? "已收到洽詢" : "送出洽詢"} <ArrowRight className="h-4 w-4" /></button>
          {contactNotice && <p className={`mt-4 rounded-2xl px-5 py-4 ${contactStatus === "error" ? "bg-[#FFF7F5] text-[#9A3C2D]" : "bg-[#DDEEDB] text-[#1E6B43]"}`}>{contactNotice}</p>}
        </form>
      )}
    </main>
  );
}

function PartnersPage() {
  const { items: partners, loading, error } = usePublished("partners", "created_at");
  const initialPartnerForm = { partner_name: "", city: "", partner_type: "門市", contact_name: "", phone: "", email: "", description: "", partner_logo: null };
  const samplePartner = {
    partner_name: "植本邏輯 高雄健康據點",
    city: "高雄市",
    category: "健康顧問",
    contact_name: "品牌顧問",
    description: "提供植物機能飲品體驗、健康需求初談與 Dr.Marvin 快篩導入服務。",
    isSample: true,
  };
  const [form, setForm] = useState(initialPartnerForm);
  const [formOpen, setFormOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [notice, setNotice] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const displayPartners = partners.length ? partners : [samplePartner];
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateLogo = (event) => {
    const file = event.target.files?.[0] || null;
    update("partner_logo", file);
    if (!file) {
      setLogoPreview("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    if (!form.partner_name || !form.city || !form.contact_name || !form.phone || !form.email) {
      setNotice("請先完成必填欄位。");
      return;
    }
    setSubmitStatus("loading");
    const { partner_logo: _partnerLogo, partner_type, ...formPayload } = form;
    try {
      await submitPublicRecord("partners", { ...formPayload, category: partner_type, status: "pending" });
    } catch (insertError) {
      setNotice(`送出失敗：${insertError.message}`);
      setSubmitStatus("error");
      return;
    }
    setNotice("已送出合作申請，審核通過後會出現在展示牆。");
    setForm(initialPartnerForm);
    setLogoPreview("");
    setSubmitStatus("success");
  };

  return (
    <main className="bg-[#F9F5EA] px-5 py-16 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#B89B5E]">Partners</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#123828] md:text-6xl">合作夥伴平台</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#49675A]">展示已核准合作夥伴，提供合作申請入口。</p>
          </div>
          <button type="button" onClick={() => setFormOpen((open) => !open)} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#123828] px-7 py-4 font-semibold text-white shadow-xl shadow-[#123828]/15 transition hover:bg-[#1E6B43]">
            申請成為合作夥伴 <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading && <div className="mt-10 rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">資料載入中...</div>}
        {error && <div className="mt-10 rounded-2xl border border-[#E8B4A8] bg-[#FFF7F5] p-7 text-center text-[#9A3C2D]">{error}</div>}
        {!loading && !error && partners.length === 0 && <div className="mt-10 rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 text-center text-[#49675A]">目前尚無已核准合作夥伴</div>}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayPartners.map((partner) => (
            <article key={partner.id || partner.partner_name} className="rounded-2xl border border-[#E2D5B5] bg-white/85 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#123828]/8">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#D8C99C] bg-[#F5F2EB] text-2xl font-semibold text-[#B89B5E]">
                  {partner.partner_name?.slice(0, 1) || "植"}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-[#123828]">{partner.partner_name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-[#F5F2EB] px-3 py-1 text-[#6C5A2F]">{partner.city}</span>
                    <span className="rounded-full bg-[#DDEEDB] px-3 py-1 text-[#1E6B43]">類型：{partner.category}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-[#E7DDBF] pt-5">
                <div className="text-sm text-[#8B7A4C]">聯絡人</div>
                <div className="mt-1 font-semibold text-[#123828]">{partner.contact_name || "合作窗口"}</div>
                <p className="mt-4 min-h-20 leading-8 text-[#49675A]">{partner.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                <a className="rounded-full border border-[#D8C99C] bg-white px-4 py-2 font-medium text-[#123828] transition hover:border-[#B89B5E]" href={partner.website_url || "#合作申請"}>查看據點</a>
                <a className="rounded-full bg-[#123828] px-4 py-2 font-medium text-white transition hover:bg-[#1E6B43]" href={partner.instagram_url || partner.facebook_url || "#合作申請"}>聯繫合作夥伴</a>
                {partner.isSample && <span className="rounded-full bg-[#F5F2EB] px-4 py-2 text-[#8B7A4C]">範例卡片</span>}
              </div>
            </article>
          ))}
        </div>

        {formOpen && (
          <form id="合作申請" onSubmit={submit} className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#D8C99C] bg-white/90 p-7 shadow-xl shadow-[#123828]/8">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B89B5E]">Application</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#123828]">合作申請表單</h2>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="w-fit rounded-full border border-[#D8C99C] px-5 py-2 text-sm font-medium text-[#123828] transition hover:bg-[#F5F2EB]">收起表單</button>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-dashed border-[#D8C99C] bg-[#FDFBF6] p-5 md:col-span-2">
                <span className="block text-sm font-medium text-[#8B7A4C]">上傳品牌 Logo 或大頭貼</span>
                <input name="partner_logo" type="file" accept="image/*" onChange={updateLogo} className="mt-3 block w-full text-sm text-[#49675A] file:mr-4 file:rounded-full file:border-0 file:bg-[#123828] file:px-5 file:py-2 file:font-semibold file:text-white" />
                {logoPreview && <img src={logoPreview} alt="合作夥伴 Logo 預覽" className="mt-4 h-24 w-24 rounded-2xl border border-[#E2D5B5] object-cover" />}
              </label>
              <input value={form.partner_name} onChange={(e) => update("partner_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="合作夥伴名稱 *" />
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="城市 *" />
              <select value={form.partner_type} onChange={(e) => update("partner_type", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]">
                {["門市", "工作室", "健康顧問", "活動據點"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <input value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="聯絡人 *" />
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="電話 *" />
              <input value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E]" placeholder="Email *" />
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="min-h-32 rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-[#B89B5E] md:col-span-2" placeholder="簡短介紹" />
            </div>
            <button disabled={submitStatus === "loading"} className="mt-5 rounded-full bg-[#123828] px-8 py-4 font-medium text-white transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]">{submitStatus === "loading" ? "送出中..." : "送出合作申請"}</button>
            {notice && <p className={`mt-4 rounded-2xl px-5 py-4 ${submitStatus === "error" || notice.includes("失敗") || notice.includes("尚未設定") ? "bg-[#FFF7F5] text-[#9A3C2D]" : "bg-[#DDEEDB] text-[#1E6B43]"}`}>{notice}</p>}
          </form>
        )}
      </section>
    </main>
  );
}

function NewsPage() {
  const { items: news, loading, error } = usePublished("announcements");
  const sorted = useMemo(() => [...news].sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned)), [news]);
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="News" title="植本公布欄" text="品牌活動、試飲活動、加盟說明會、合作公告與健康文章。" />
      <DataState loading={loading} error={error} empty={!loading && !error && sorted.length === 0}>目前尚無已發布公告。</DataState>
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {sorted.map((item) => (
          <article key={item.id || item.title} className="rounded-2xl border border-[#E7DDBF] bg-white/75 p-7 shadow-sm">
            <div className="flex items-center justify-between text-sm text-[#8B7A4C]"><span>{item.category}</span><span>{item.is_pinned ? "置頂" : item.published_at}</span></div>
            {item.cover_image_url && <img src={item.cover_image_url} alt="" className="mt-5 aspect-[16/10] w-full rounded-xl object-cover" />}
            <h3 className="mt-5 text-2xl font-semibold">{item.title}</h3>
            <p className="mt-4 leading-7 text-[#49675A]">{item.summary}</p>
            <p className="mt-5 text-sm leading-7 text-[#7D8D7F]">{item.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function GalleryPage() {
  const { items, loading, error } = usePublished("gallery_items");
  return (
    <main className="px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Gallery" title="精彩剪影" text="活動現場、消費者體驗、合作夥伴、產品製作與品牌故事。" />
      <DataState loading={loading} error={error} empty={!loading && !error && items.length === 0}>目前尚無已發布剪影。</DataState>
      <div className="mx-auto columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3 max-w-7xl">
        {items.map((item, index) => (
          <article key={item.id || item.title} className="break-inside-avoid overflow-hidden rounded-2xl border border-[#E7DDBF] bg-white/80 shadow-sm">
            {item.type === "video" ? (
              <div className="aspect-video bg-[#123828] p-6 text-white">影片：{item.media_url}</div>
            ) : (
              <img src={item.thumbnail_url || item.media_url || "/logo.png"} alt={item.title} className={`w-full object-cover ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`} />
            )}
            <div className="p-6">
              <div className="text-sm text-[#8B7A4C]">{item.category}</div>
              <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#49675A]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Footer({ go }) {
  return (
    <footer className="border-t border-[#E7DDBF] bg-[#F9F5EA] px-5 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.2fr] md:gap-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="植本邏輯 Logo" className="h-10 w-10 object-contain" />
              <div>
                <div className="font-semibold tracking-[0.18em] text-[#123828]">植本邏輯</div>
                <div className="text-xs tracking-[0.24em] text-[#7D8D7F]">PHYTOLOGIC</div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#49675A]">
              以植物、科學與愛，<br />守護人生裡真正重要的人。
            </p>
            <button type="button" onClick={handleOpenLine} className="mt-5 rounded-full bg-[#06C755] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#05B64D]">加入 LINE</button>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-[#8B7A4C]">品牌</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#49675A]">
              <li><button type="button" onClick={() => go("/about")} className="transition hover:text-[#123828]">品牌精神</button></li>
              <li><button type="button" onClick={() => go("/products")} className="transition hover:text-[#123828]">全植物機能飲</button></li>
              <li><button type="button" onClick={() => go("/assessment")} className="transition hover:text-[#123828]">Dr.Marvin 健康分析</button></li>
              <li><button type="button" onClick={() => go("/news")} className="transition hover:text-[#123828]">最新消息</button></li>
              <li><button type="button" onClick={() => go("/gallery")} className="transition hover:text-[#123828]">精彩剪影</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-[#8B7A4C]">合作</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#49675A]">
              <li><button type="button" onClick={() => go("/join")} className="transition hover:text-[#123828]">合作募集</button></li>
              <li><button type="button" onClick={() => go("/partners")} className="transition hover:text-[#123828]">合作夥伴</button></li>
              <li><button type="button" onClick={() => { go("/join"); setTimeout(() => document.querySelector("#合作申請")?.scrollIntoView({ behavior: "smooth" }), 80); }} className="transition hover:text-[#123828]">送出合作申請</button></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[#E7DDBF] bg-white/70 p-5">
            <div className="text-sm text-[#8B7A4C]">官方 LINE</div>
            <div className="mt-1 font-semibold text-[#123828]">{lineId}</div>
            <LineQRCode className="mt-3 w-24" />
            <button type="button" onClick={handleOpenLine} className="mt-3 inline-flex rounded-full bg-[#06C755] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#05B64D]">立即加入 LINE</button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#E7DDBF]/70 pt-5 text-xs text-[#9A8C68] md:flex-row md:items-center md:justify-between">
          <span>© 2026 植本邏輯 PHYTOLOGIC. All rights reserved. ・ 熱愛・尊重・相信</span>
          <button type="button" onClick={() => go("/admin")} className="w-fit transition hover:text-[#123828]">管理入口</button>
        </div>
      </div>
    </footer>
  );
}

export default function PhytologicWebsite() {
  const [route, go] = useRoute();
  const isAdminRoute = route === "/admin" || route.startsWith("/admin/");
  const productMatch = route.match(/^\/products\/([^/]+)$/);
  const page = isAdminRoute
    ? <AdminDashboard route={route} go={go} />
    : route === "/about"
      ? <AboutPage />
      : route === "/products"
        ? <ProductsPage go={go} />
        : productMatch
          ? <ProductDetailPage slug={productMatch[1]} go={go} />
          : route === "/assessment"
            ? <AssessmentPage />
            : route === "/join"
              ? <JoinPage go={go} />
              : route === "/partners"
                ? <PartnersPage />
                : route === "/news"
                  ? <NewsPage />
                  : route === "/gallery"
                    ? <GalleryPage />
                    : <HomePage go={go} />;
  return (
    <div className="min-h-screen bg-[#F9F5EA] text-[#123828]">
      {!isAdminRoute && <Header route={route} go={go} />}
      {page}
      {!isAdminRoute && <Footer go={go} />}
      {!isAdminRoute && <FloatingLineButton />}
    </div>
  );
}
