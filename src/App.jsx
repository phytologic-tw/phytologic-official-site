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

const LineEntry = React.lazy(() => import("./pages/line/LineEntry"));
const LineMemberHomePage = React.lazy(() => import("./pages/line/LineMemberHomePage"));
const LineTodayPage = React.lazy(() => import("./pages/line/LineTodayPage"));
const LineAnalysisPage = React.lazy(() => import("./pages/line/LineAnalysisPage"));
const LineAssessmentPage = React.lazy(() => import("./pages/line/LineAssessmentPage"));
const LineCheckinPage = React.lazy(() => import("./pages/line/LineCheckinPage"));
const LineProfilePage = React.lazy(() => import("./pages/line/LineProfilePage"));
const LineReportsPage = React.lazy(() => import("./pages/line/LineReportsPage"));
const LineCardsPage = React.lazy(() => import("./pages/line/LineCardsPage"));
const LineTasksPage = React.lazy(() => import("./pages/line/LineTasksPage"));
const LineEventsPage = React.lazy(() => import("./pages/line/LineEventsPage"));
const LineReferralPage = React.lazy(() => import("./pages/line/LineReferralPage"));
const LineShopPage = React.lazy(() => import("./pages/line/LineShopPage"));
const EncyclopediaListPage = React.lazy(() => import("./pages/line/EncyclopediaListPage"));
const LineEncyclopediaProductPage = React.lazy(() => import("./pages/line/ProductDetailPage"));
const WikiDetailPage = React.lazy(() => import("./pages/line/WikiDetailPage"));

const logo = "/logo.png";
const lineId = "@phytologic";

const products = [
  {
    id: "white",
    name: "雪山植萃",
    english: "Pearl White",
    colorName: "珍珠白",
    theme: "慢性發炎修復 · 腸胃黏膜修護 · 溫和植物重啟",
    icon: Sparkles,
    accent: "#EDE3D0",
    deep: "#A98E61",
    desc: "身體一直感覺「差一點」，不是沒睡夠，是沒給夠修復的材料。讓植物做那一次最需要的溫柔重啟。",
    tags: ["Omega-3 抗炎", "銀耳多醣體", "腸胃修護", "壓力族適用", "無人工添加"],
  },
  {
    id: "green",
    name: "青檸植萃",
    english: "Emerald Green",
    colorName: "翡翠綠",
    theme: "腸道促排 · 代謝重啟 · 體內環保",
    icon: Leaf,
    accent: "#D8EDD4",
    deep: "#3B8C52",
    desc: "身體堆積的東西，需要一個出口。地瓜葉、黑木耳、檸檬、芭樂，讓腸道重新動起來，讓代謝重新跑起來。",
    tags: ["膳食纖維複合體", "天然維生素C", "腸道促排", "代謝重啟", "無人工添加"],
  },
  {
    id: "rose",
    name: "玫瑰植萃",
    english: "Rose Red",
    colorName: "寶石紅",
    theme: "女性養顏保養 · 氣色紅潤 · 抗氧化",
    icon: Heart,
    accent: "#F2D8DE",
    deep: "#C4607A",
    desc: "氣色不是化妝品補出來的，是從細胞底層養出來的。Beetroot、紫甘藍、百香果、玫瑰花瓣，讓紅潤從裡面透出來。",
    tags: ["甜菜紅素", "花青素雙重來源", "膠原蛋白支持", "女性日常保養", "無人工添加"],
  },
  {
    id: "gold",
    name: "桂香植萃",
    english: "Golden Yellow",
    colorName: "金鑽黃",
    theme: "運動修復 · 增肌代謝 · 抗訓練後發炎",
    icon: Dumbbell,
    accent: "#F5E8B0",
    deep: "#C49020",
    desc: "練完之後，身體需要的不只是蛋白質，而是一套完整的修復邏輯。薑黃、玉米、豆薯、香蕉，讓肌肉真正恢復，讓下一次更有力量。",
    tags: ["薑黃素雙路徑抗炎", "蛋白質節省作用", "電解質補充", "延遲性痠痛修復", "無人工添加"],
  },
  {
    id: "purple",
    name: "紫莓植萃",
    english: "Crystal Purple",
    colorName: "水晶紫",
    theme: "護眼抗氧化 · 3C族保養 · 水脂雙溶",
    icon: Eye,
    accent: "#E8DDF5",
    deep: "#7B52C0",
    desc: "眼睛每天都在燒，卻沒有人認真補充它需要的東西。木鱉果、紫薯、藍莓、桑椹，建構水脂雙溶的護眼網路。",
    tags: ["微脂體類胡蘿蔔素", "花青素雙重來源", "水脂雙溶護眼", "3C族保養", "無人工添加"],
  },
];

const productDetails = {
  white: {
    colors: { bg: "#FAF5EC", border: "#D4C4A0", accent: "#A98E61", deep: "#2C1F0A", text: "#4A3318", hex: "#E8DCC8", hexBorder: "#C4A87A" },
    naturalForce: {
      intro: "現代人每天熬夜、壓力、外食，身體其實都在偷偷「發炎冒火」。雪山植萃裡的每一味食材，都是大自然給身體準備好的滅火工具——不是硬把你叫醒，而是默默把你的底子慢慢養回來。",
      items: [
        { icon: "🥜", name: "生核桃", preview: "核桃的 Omega-3 就像「派消防隊進身體」，直接抑制促發炎介質釋放，從源頭讓身體降火。", full: "核桃的 Omega-3 就像「派消防隊進身體」，直接抑制促發炎介質釋放，從源頭讓身體降火。維生素 E 則像幫每顆細胞擦上保養品，防止身體「生鏽」。長期補充，思緒更清晰、比較不容易昏沉、恢復也更快——不是瞬間爆發型，而是默默把底子慢慢養回來。", key: "α-次亞麻油酸 · 抗炎脂質 · 維生素E抗氧化" },
        { icon: "🍄", name: "白木耳", preview: "白木耳的水溶性多醣體，在腸胃道形成一層保護性膠質，修護受損的腸胃黏膜。", full: "白木耳的水溶性多醣體，在腸胃道形成一層保護性膠質，修護受損的腸胃黏膜。它同時是腸道好菌最喜歡的食物，喝進去之後，腸道環境會一點一點變得更穩定。對於長期腸胃敏感、容易消化不良的人來說，這是最溫和也最直接的修復方式。", key: "銀耳多醣體 · 腸胃黏膜修護 · 益生元" },
        { icon: "🍠", name: "山藥", preview: "山藥的黏蛋白像一件保護衣，包覆在腸壁上，薯蕷皂苷幫助調節免疫反應。", full: "山藥的黏蛋白像一件保護衣，包覆在腸壁上；薯蕷皂苷幫助調節免疫反應，讓一直「亢奮」的身體慢慢靜下來。幾千年的藥食同源食材，溫和不燥補，任何體質都能長期食用，是最沒有負擔的免疫調節方式。", key: "薯蕷皂苷 · 黏蛋白 · 免疫調節" },
        { icon: "🍎", name: "蘋果", preview: "帶皮萃取保留果皮裡的槲皮素，天然的抗組織胺植化素，幫助對抗過敏反應。", full: "帶皮一起萃取，保留果皮裡的槲皮素。槲皮素是天然的抗組織胺植化素，幫助對抗過敏反應、減少慢性發炎中的組織損傷；果膠則促進腸道蠕動，讓整體消化更順暢。一顆蘋果，從皮到肉都在幫你。", key: "槲皮素 · 抗組織胺 · 果膠促腸蠕動" },
      ],
    },
    earthStory: {
      items: [
        { icon: "🥜", name: "生核桃", sub: "一棵樹，等了七年才能結果", story: "核桃從種下到穩定結果，常常需要五年、七年，甚至更久。它會經歷冬天的寒冷、夏天的烈日、大雨與乾旱，一年一年把力量慢慢存進果實裡。外面硬得像石頭，打開之後卻是充滿油脂與營養的生命——很像很多成年人，外表撐著，身體早就累了。真正有力量的東西，從來都不是快速長大的。", key: "α-次亞麻油酸 · 維生素E · 植物多酚" },
        { icon: "🍄", name: "白木耳", sub: "潮濕山林裡的天然保水精靈", story: "白木耳生長在潮濕的山林環境，需要特定的溫濕度才能長得好。它含有水溶性多醣體，保水力極高，是腸胃黏膜和皮膚底層最溫和的滋養來源。古人拿它來「養顏」，現代科學證實了它對腸道益菌的培養作用——大地給的禮物，跨越千年仍然有效。", key: "銀耳多醣體 · 黏多醣 · 益生元" },
        { icon: "🍠", name: "山藥", sub: "幾千年的藥食同源智慧", story: "山藥喜歡疏鬆肥沃的土地，生長週期長，根莖裡慢慢積累了黏蛋白與薯蕷皂苷。幾千年前，人們就知道拿它來補脾胃、調身體，是最溫和的食補食材之一。它不搶戲、不刺激，靜靜地幫腸壁穿上一件保護衣。", key: "薯蕷皂苷 · 黏蛋白 · 多醣體" },
        { icon: "🍎", name: "蘋果", sub: "連皮帶核，才是完整的蘋果", story: "我們習慣削皮吃蘋果，但最有價值的槲皮素和果膠，幾乎都藏在果皮裡。雪山植萃帶皮萃取，讓蘋果的完整植化素一起進入配方。果皮的天然多酚抗氧化，果肉的果膠促進腸道蠕動，一顆蘋果說完整整個故事。", key: "槲皮素 · 果膠 · 多酚類" },
      ],
    },
    bodyNeed: {
      intro: "雪山植萃不是為所有人設計的補品，而是為那些說不清哪裡不對、但整個人就是不在狀態的人，量身設計的修復起點。",
      items: [
        { icon: "💼", who: "長時間高壓工作者", why: "壓力荷爾蒙長期偏高，腸胃蠕動失調、黏膜修復緩慢，整個人說不上哪裡不對但就是很累。" },
        { icon: "🌙", who: "熬夜族、作息不穩定", why: "睡眠不足使發炎指數持續上升，身體根本沒有足夠的時間進行深層修復。" },
        { icon: "🫃", who: "腸胃敏感、常感不適", why: "不需要刺激性的東西，需要溫和包覆腸壁、能直接修護黏膜的植物成分。" },
        { icon: "🤧", who: "反覆過敏、免疫失衡", why: "槲皮素與山藥皂苷協同平衡過激的免疫反應，從根源減少發作頻率。" },
        { icon: "🧘", who: "想調養、不知從哪入門", why: "溫和不燥補，任何體質都能作為起點，不怕補錯方向。" },
        { icon: "👪", who: "想讓家人每天安心喝", why: "無人工色素、無化學乳化劑、無合成添加，看得懂成分才敢給家人。" },
      ],
    },
    science: {
      intro: "每一個數字背後都是真實的配方計算，不是行銷數字，是你喝下去的東西的實際成分。",
      stats: [
        { value: "88.8", label: "大卡 / 每 100g" },
        { value: "4.2g", label: "蛋白質 / 每 100g" },
        { value: "350ml", label: "標準份量（10 塊冰磚）" },
        { value: "0", label: "人工添加物種類" },
      ],
      marvinRange: "6–20",
      marvinDotLeft: "22%",
      marvinDotRight: "65%",
      marvinNote: "特別適合「腦部與神經壓力」、「消化與腸胃負擔」、「免疫與過敏反應」三類得分偏高的人。這三類族群的共同根源，往往是長期慢性發炎與腸腦軸失衡——雪山植萃的配方邏輯，正是從這裡切入。",
    },
  },

  green: {
    colors: { bg: "#EDF6EB", border: "#B8D9B4", accent: "#3B8C52", deep: "#0F3320", text: "#1E4A2C", hex: "#C8E4C4", hexBorder: "#5BAD72" },
    naturalForce: {
      intro: "很多人都以為「吃得少」才能瘦，但身體真正需要的，是吃得動。代謝不是靠餓出來的，是靠腸道真正清空、循環真正順暢，讓身體重新啟動。青檸植萃的四個食材，就是為這件事設計的。",
      items: [
        { icon: "🍃", name: "地瓜葉", preview: "台灣田間最謙遜的蔬菜，卻同時是膳食纖維之王、葉綠素之王、抗氧化之王，三冠加身。", full: "外表樸實，營養密度卻遠超許多昂貴的超級食物。葉綠素清掃腸道有害菌、水溶性纖維促進蠕動排出廢物、β-胡蘿蔔素與多酚類對抗自由基——三冠加身，每一冠都在幫身體做真正需要的事。", key: "葉綠素 · 水溶性纖維 · β-胡蘿蔔素 · 多酚類抗氧化" },
        { icon: "🖤", name: "黑木耳", preview: "黑木耳的水溶性膳食纖維能吸附腸道中多餘的膽固醇與脂質，幫助代謝更順暢。", full: "水溶性纖維進入腸道後，像海綿一樣吸附多餘的膽固醇與脂質，再隨著代謝帶走。多醣體結構同時延長飽足感，讓身體不容易在餐後馬上感到餓——對血脂偏高、體重管理中的人，是最溫和的天然輔助。", key: "水溶性膳食纖維 · 植物性多醣 · 膽固醇代謝" },
        { icon: "🍋", name: "檸檬", preview: "檸檬的維生素 C 是天然的代謝觸媒，幫助身體把脂肪轉換為能量，讓循環真正動起來。", full: "維生素 C 是脂肪代謝不可缺少的輔酶，缺了它身體就算想燃燒也燒不動。檸檬酸則直接參與身體的能量代謝循環，讓每一口食物的能量被更有效率地利用，而不是堆積下來。", key: "維生素C · 檸檬酸 · 類黃酮抗氧化" },
        { icon: "🍈", name: "芭樂", preview: "芭樂是維生素 C 含量極高的熱帶水果，同時富含膳食纖維，幫助穩定血糖、延緩吸收。", full: "與檸檬形成雙重維生素 C 強化組合，讓代謝支援更完整。果膠與膳食纖維同步穩定餐後血糖、延緩糖分吸收速度，讓代謝節奏更穩定——想控制體重、改善飯後血糖反應，芭樂是最天然的選擇。", key: "高單位維生素C · 果膠 · 血糖穩定" },
      ],
    },
    earthStory: {
      items: [
        { icon: "🍃", name: "地瓜葉", sub: "台灣田間最謙遜的清道夫", story: "地瓜葉生命力極強，幾乎不需要農藥就能長得好，是台灣最親民的蔬菜之一。它貼著地面生長，在烈日與雨水之間，默默積累了大量的葉綠素與纖維。早年農家把它當主食，現代科學才發現它的營養密度遠超過很多昂貴的蔬菜——謙遜的外表，藏著巨大的清掃力。", key: "葉綠素 · 水溶性纖維 · β-胡蘿蔔素 · 多酚類" },
        { icon: "🖤", name: "黑木耳", sub: "森林裡的天然清道夫", story: "黑木耳附生在闊葉樹的枯木上，靠著分解木質素為生，本身就是大自然的循環代謝者。這種分解與吸附的特性，也體現在它的功效上——進入腸道後，水溶性纖維吸附多餘的膽固醇與脂質，像森林裡的分解者一樣，把身體裡不需要的東西帶走。", key: "水溶性膳食纖維 · 植物性多醣 · 鐵質" },
        { icon: "🍋", name: "檸檬", sub: "陽光與酸味，濃縮在一顆果實裡", story: "檸檬喜歡充足的陽光與溫暖的氣候，吸收越多陽光，果實裡的維生素 C 含量越高。每一顆檸檬，都是陽光能量的濃縮儲存。它的酸味來自檸檬酸，不只是味道，而是身體能量代謝循環的重要參與者——讓每一口食物的能量，都能被更有效率地燃燒。", key: "維生素C · 檸檬酸 · 類黃酮 · 香豆素" },
        { icon: "🍈", name: "芭樂", sub: "台灣最低調的維生素 C 之王", story: "芭樂在台灣的平原與丘陵地帶廣泛種植，耐熱、耐旱，一年四季都能結果。很多人不知道，芭樂的維生素 C 含量是柳橙的好幾倍，果肉裡的果膠也相當豐富。它是最樸實的熱帶水果，卻藏著最完整的代謝輔助力——穩血糖、促排便、補充維生素 C，一顆果實同時做三件事。", key: "高單位維生素C · 果膠 · 類黃酮 · 膳食纖維" },
      ],
    },
    bodyNeed: {
      intro: "青檸植萃不是減肥產品，而是為那些身體「卡住了」的人設計的——吃進去的排不出去，代謝跑不動，整個人感覺沉重。",
      items: [
        { icon: "⚖️", who: "體重管理、想瘦但代謝慢", why: "代謝緩慢不是意志力的問題，是腸道環境的問題。清空腸道，代謝才能重新啟動。" },
        { icon: "🍱", who: "外食族、飲食油膩不均衡", why: "長期外食累積大量油脂與精緻澱粉，身體需要天然纖維幫忙清理。" },
        { icon: "💉", who: "血脂偏高、膽固醇控制中", why: "黑木耳水溶性纖維吸附腸道多餘膽固醇，從源頭降低吸收量。" },
        { icon: "🚶", who: "久坐少動、腸胃蠕動差", why: "缺乏運動讓腸道蠕動變慢，膳食纖維複合體是最溫和的腸道啟動方式。" },
        { icon: "😴", who: "常常脹氣、消化不順暢", why: "腸道環境失衡是脹氣的根源，纖維與多醣體幫助調整腸道菌叢比例。" },
        { icon: "🌿", who: "想從飲食開始調整生活", why: "低熱量、高纖維、無人工添加，是最無負擔的每日體內環保習慣。" },
      ],
    },
    science: {
      intro: "每一個數字背後都是真實的配方計算，不是行銷數字，是你喝下去的東西的實際成分。",
      stats: [
        { value: "67.8", label: "大卡 / 每 100g" },
        { value: "4.1g", label: "蛋白質 / 每 100g" },
        { value: "350ml", label: "標準份量（10 塊冰磚）" },
        { value: "0", label: "人工添加物種類" },
      ],
      marvinRange: "12–25",
      marvinDotLeft: "40%",
      marvinDotRight: "83%",
      marvinNote: "特別適合「消化與腸胃負擔」、「體重與代謝壓力」、「血脂與循環負擔」三類得分偏高的人。這三類族群的共同根源，往往是腸道環境失衡與代謝效率下降——青檸植萃從膳食纖維與維生素 C 雙管齊下，讓身體重新跑起來。",
    },
  },

  rose: {
    colors: { bg: "#FAF0F2", border: "#E8C0CA", accent: "#C4607A", deep: "#3D1020", text: "#5A1E30", hex: "#EDD0D8", hexBorder: "#D4909F" },
    naturalForce: {
      intro: "很多人花大錢買保養品，卻忽略了一件事——皮膚的原料，是從嘴巴吃進去的。膠原蛋白的合成、氣色的紅潤、肌膚的保水，全部都需要特定的植化素作為原料。玫瑰植萃的四個食材，就是直接把這些原料送進身體裡。",
      items: [
        { icon: "🟣", name: "Beetroot", preview: "甜菜紅素是自然界極罕見的天然色素，強效抗氧化、促進血液循環，讓臉色從蠟黃變紅潤。", full: "甜菜紅素只存在於甜菜根，是自然界極為罕見的天然色素，抗氧化能力強，對抗讓皮膚暗沉的自由基。它同時是亞硝酸鹽的天然前驅物，促進血管擴張與血液循環——讓臉色從蠟黃變紅潤，不是妝出來的顏色，是循環好起來的顏色。", key: "甜菜紅素 · 促進血液循環 · 亞硝酸鹽前驅物 · 葉酸" },
        { icon: "🫐", name: "紫甘藍", preview: "紫甘藍的花青素含量極高，是皮膚抗氧化的第一道防線，同時富含維生素 C 支持膠原蛋白合成。", full: "紫甘藍的深紫色來自豐富的花青素，是對抗皮膚氧化壓力最直接的植化素之一。花青素能穩定膠原蛋白結構，防止它被自由基分解；同時搭配維生素 C，雙管齊下促進新的膠原蛋白合成，讓肌膚彈性從底層建立起來。", key: "花青素 · 維生素C · 抗氧化 · 膠原蛋白支持" },
        { icon: "🌺", name: "百香果", preview: "百香果富含維生素 A 前驅物與類黃酮，幫助肌膚保水、修復受損細胞，同時舒緩壓力引起的氧化反應。", full: "百香果不只是酸甜的熱帶水果，它的類黃酮與維生素 A 前驅物，直接參與皮膚細胞的修復與保水。壓力大的時候皮膚特別容易乾燥敏感，百香果的植化素幫助舒緩這種氧化壓力，讓肌膚在最脆弱的時候也能保持彈潤。", key: "類黃酮 · 維生素A前驅物 · 保水修復 · 舒緩抗敏" },
        { icon: "🌹", name: "玫瑰花瓣", preview: "玫瑰多酚調節女性荷爾蒙波動帶來的皮膚問題，讓生理期前後的暗沉與敏感有植物的支撐。", full: "玫瑰花瓣中的多酚與花青素，能調節荷爾蒙波動帶來的皮膚問題，包括生理期前後的暗沉與敏感。它同時有溫和的舒緩作用，減少壓力引起的肌膚氧化反應——讓皮膚在最脆弱的時候，也能有一道植物的保護。", key: "玫瑰多酚 · 花青素 · 荷爾蒙調節輔助 · 舒緩抗敏" },
      ],
    },
    earthStory: {
      items: [
        { icon: "🟣", name: "Beetroot", sub: "大地最深處的紅色能量", story: "甜菜根生長在土壤深處，把大地的礦物質與養分一點一點儲存在根莖裡。那一抹鮮豔的深紅，來自甜菜紅素——一種在自然界極為罕見的天然色素，只有甜菜根才有。切開的瞬間，像是把土地的生命力濃縮在一個切面裡，深沉、飽滿、充滿力量。", key: "甜菜紅素 · 葉酸 · 鐵質 · 亞硝酸鹽前驅物" },
        { icon: "🫐", name: "紫甘藍", sub: "寒冷季節裡最頑強的紫色", story: "紫甘藍偏好涼爽的氣候，生長在溫差大的環境裡，正是這樣的環境讓它積累了大量的花青素——那是植物用來保護自己抵抗環境壓力的天然防禦機制。我們吃下去，就等於借用了這套防禦系統，讓皮膚也能抵抗外在的氧化壓力。", key: "花青素 · 維生素C · 維生素K · 硫代葡萄糖苷" },
        { icon: "🌺", name: "百香果", sub: "熱帶雨林裡的保水精靈", story: "百香果生長在熱帶與亞熱帶的高溫高濕環境，攀附在藤蔓上，以旺盛的生命力結出飽滿的果實。它的果汁濃縮了大量的類黃酮與維生素 A 前驅物，是台灣本地最具代表性的熱帶養顏水果，酸甜之中藏著皮膚最需要的修復原料。", key: "類黃酮 · β-胡蘿蔔素 · 維生素C · 鉀離子" },
        { icon: "🌹", name: "玫瑰花瓣", sub: "最短暫的美麗，最持久的力量", story: "玫瑰花期很短，但花瓣裡積累的植化素卻非常豐富。人工採摘、低溫處理，才能保留多酚與花青素的完整活性。幾千年來，玫瑰不只是愛情的象徵，更是女性保養的傳統食材——東西方都有拿玫瑰花瓣入藥、入茶、入食的悠久歷史，美麗從來不只是外表。", key: "玫瑰多酚 · 花青素 · 玫瑰精油成分 · 單寧酸" },
      ],
    },
    bodyNeed: {
      intro: "玫瑰植萃不是為了「變美」而設計的，而是為了讓身體有足夠的原料，自然呈現它本來應該有的狀態。",
      items: [
        { icon: "🫣", who: "氣色蠟黃、看起來很累", why: "不是睡不夠，是血液循環不足。Beetroot 甜菜紅素促進循環，讓臉色從內部紅潤起來。" },
        { icon: "💆", who: "生理期前後皮膚特別差", why: "荷爾蒙波動影響皮膚狀態，玫瑰多酚幫助調節波動帶來的暗沉與敏感。" },
        { icon: "🪞", who: "想改善膚質、增加彈性", why: "花青素穩定膠原蛋白結構，維生素 C 促進合成，雙管齊下從底層建立肌膚彈性。" },
        { icon: "💧", who: "皮膚乾燥、容易脫皮", why: "百香果類黃酮與維生素 A 前驅物，幫助修復皮膚保水屏障，讓肌膚維持彈潤。" },
        { icon: "😰", who: "壓力大、皮膚容易敏感", why: "壓力引起的氧化反應加速皮膚老化，紫甘藍花青素是皮膚抗氧化的第一道防線。" },
        { icon: "🌸", who: "想從日常飲食開始保養", why: "低熱量、無人工添加，是最無負擔、最自然的每日女性養顏習慣。" },
      ],
    },
    science: {
      intro: "每一個數字背後都是真實的配方計算，不是行銷數字，是你喝下去的東西的實際成分。",
      stats: [
        { value: "75.6", label: "大卡 / 每 100g" },
        { value: "4.1g", label: "蛋白質 / 每 100g" },
        { value: "350ml", label: "標準份量（10 塊冰磚）" },
        { value: "0", label: "人工添加物種類" },
      ],
      marvinRange: "8–20",
      marvinDotLeft: "27%",
      marvinDotRight: "65%",
      marvinNote: "特別適合「皮膚與氣色負擔」、「女性生理循環」、「氧化壓力累積」三類得分偏高的人。氣色蠟黃、膚質下滑、生理期波動——這些往往不是單一問題，而是身體缺少特定植化素原料的訊號。",
    },
  },

  gold: {
    colors: { bg: "#FBF3D0", border: "#E8D080", accent: "#C49020", deep: "#2C1A00", text: "#4A3200", hex: "#EEE0A0", hexBorder: "#D4B840" },
    naturalForce: {
      intro: "很多人練完就喝蛋白粉，以為補了蛋白質就夠了。但身體要真正修復，需要的是讓蛋白質用對地方的環境——消炎、補醣、補水、補電解質。桂香植萃的四個食材，分工明確，缺一不可。",
      items: [
        { icon: "🫚", name: "薑黃", preview: "薑黃素同時抑制 COX 與 LOX 兩條發炎路徑，對抗訓練後肌肉發炎與延遲性痠痛，這是很多消炎藥只能做到一條的事。", full: "使用新鮮薑黃而非粉末，保留完整的薑黃醇與精油成分，讓抗炎效果更全面。薑黃素是目前研究最充分的天然抗炎植化素，同時抑制 COX 與 LOX 兩條發炎路徑——幫助訓練後的肌肉真正靜下來、修復好，而不是靠忍耐硬撐過去。", key: "薑黃素 · COX/LOX雙路徑抑制 · 薑黃醇 · 抗氧化" },
        { icon: "🌽", name: "玉米", preview: "玉米的複合醣類讓血糖穩定回補，啟動「蛋白質節省作用」，讓蛋白質不被當成能量燒掉，真正用在肌肉修復上。", full: "運動後血糖下降，身體會開始分解蛋白質當能量——這是肌肉修復最大的敵人。玉米的複合醣類快速穩定血糖，讓蛋白質能專心用在肌肉合成上。玉米黃素同時清除運動產生的自由基，B 群維生素支援持續的能量代謝。", key: "複合醣類 · 玉米黃素 · 維生素B群 · 膳食纖維" },
        { icon: "🥔", name: "豆薯", preview: "豆薯富含天然菊糖與維生素 C，補充運動流失的水分與電解質，同時作為益生元支援腸道修復。", full: "豆薯水分含量極高，是天然的補水食材，幫助運動後快速恢復水分平衡。天然菊糖是優質的益生元，支援腸道好菌，讓修復期的消化吸收更順暢；維生素 C 則進一步幫助膠原蛋白合成，支援結締組織與肌腱的修復，讓關節也跟著一起恢復。", key: "天然菊糖 · 維生素C · 益生元 · 高水分補充" },
        { icon: "🍌", name: "香蕉", preview: "香蕉的鉀離子補充流失的電解質防止抽筋，維生素 B6 是蛋白質代謝的關鍵輔酶，讓修復更有效率。", full: "香蕉是全球運動員最普遍的天然補給食材，不需要任何加工就能提供身體最需要的鉀離子與複合醣類。維生素 B6 是蛋白質代謝不可缺少的輔酶，讓吃進去的蛋白質真正被肌肉利用，而不是走冤枉路。色胺酸則幫助運動後的神經放鬆，讓身體更容易進入深度修復的狀態。", key: "鉀離子 · 維生素B6 · 複合醣類 · 色胺酸" },
      ],
    },
    earthStory: {
      items: [
        { icon: "🫚", name: "薑黃", sub: "幾千年的抗炎智慧，長在土裡", story: "薑黃在熱帶與亞熱帶的土壤裡緩慢生長，根莖裡慢慢積累薑黃素。幾千年前，印度阿育吠陀醫學就把薑黃當成最重要的抗炎藥材；現代科學花了大量研究才追上這個智慧。使用新鮮薑黃，保留完整的薑黃醇與精油，比粉末更直接、更完整地把這份抗炎力量帶進身體。", key: "薑黃素 · 薑黃醇 · 精油成分 · COX/LOX雙路徑抑制" },
        { icon: "🌽", name: "玉米", sub: "陽光穿透而成的金黃果實", story: "玉米喜歡充足的日照與溫暖的土壤，在陽光的照射下，玉米粒慢慢積累甜分與玉米黃素。那一串金黃，是土地與陽光共同完成的作品。玉米黃素與複合醣類的組合，讓身體在能量補充的同時，也能對抗運動產生的自由基傷害，是大自然設計最好的運動後補給。", key: "玉米黃素 · 複合醣類 · 膳食纖維 · 維生素B群" },
        { icon: "🥔", name: "豆薯", sub: "台灣田間最清涼的地下補水站", story: "豆薯（涼薯）在台灣的田間廣泛種植，根莖在土壤深處默默儲存大量水分與菊糖，外皮粗糙，果肉卻清脆多汁、清涼甘甜。早年台灣人夏天常吃豆薯解暑，這份清涼補水的特性，正是運動後身體最渴望的——不只補充水分，天然菊糖更是腸道益菌的最佳食糧。", key: "天然菊糖 · 維生素C · 益生元 · 高水分 · 低熱量" },
        { icon: "🍌", name: "香蕉", sub: "熱帶陽光最甜的能量儲存", story: "香蕉生長在熱帶高溫高濕的環境，整串果實向上生長，彷彿把陽光能量一節一節儲存起來。它是全球運動員最普遍的天然補給食材，不需要任何加工，就能在運動後快速提供身體最需要的鉀離子與複合醣類。大地最樸實的給予，卻是運動科學最推崇的修復原料。", key: "鉀離子 · 維生素B6 · 複合醣類 · 色胺酸" },
      ],
    },
    bodyNeed: {
      intro: "桂香植萃不只是給運動員設計的，而是為所有「身體需要修復，卻沒有足夠原料」的人設計的。",
      items: [
        { icon: "🏋️", who: "重訓、健身、規律運動者", why: "薑黃素對抗訓練後發炎，複合醣類啟動蛋白質節省作用，讓每次練習的修復更完整。" },
        { icon: "🏃", who: "跑步、有氧運動愛好者", why: "鉀離子補充電解質防止抽筋，豆薯天然補水，讓長距離運動後的恢復更快。" },
        { icon: "😫", who: "肌肉痠痛、恢復緩慢", why: "延遲性痠痛的根源是肌肉發炎，薑黃素雙路徑抑制讓發炎消退更快、痠痛更短。" },
        { icon: "💪", who: "想增肌但效果有限", why: "蛋白質節省作用讓蛋白質不被當能量燃燒，真正用在肌肉合成上，效率更高。" },
        { icon: "🧑‍💼", who: "久站久坐、關節負擔重", why: "不只是運動族群，豆薯維生素 C 支援結締組織修復，薑黃素提供持續的植物抗炎支持。" },
        { icon: "⚡", who: "想在低熱量前提下補充能量", why: "每 100g 僅 68 大卡，是所有款式中熱量最低的配方，適合體態管理中的人。" },
      ],
    },
    science: {
      intro: "每一個數字背後都是真實的配方計算，不是行銷數字，是你喝下去的東西的實際成分。",
      stats: [
        { value: "68", label: "大卡 / 每 100g（五款最低）" },
        { value: "3.5g", label: "蛋白質 / 每 100g" },
        { value: "350ml", label: "標準份量（10 塊冰磚）" },
        { value: "0", label: "人工添加物種類" },
      ],
      marvinRange: "10–22",
      marvinDotLeft: "33%",
      marvinDotRight: "73%",
      marvinNote: "特別適合「肌肉與關節負擔」、「體能與疲勞累積」、「代謝與體重管理」三類得分偏高的人。身體一直在使用卻沒有足夠修復原料，是這三類族群最常見的共同問題——桂香植萃從抗炎、補醣、補水、補電解質四個方向同時切入。",
    },
  },

  purple: {
    colors: { bg: "#F2EDFC", border: "#D5C4EE", accent: "#7B52C0", deep: "#1E0A40", text: "#3A1E60", hex: "#D5C4EE", hexBorder: "#B8A0D8" },
    naturalForce: {
      intro: "護眼保健品市場很大，但大多數只補充單一成分。眼睛真正的需要是水溶性與脂溶性護眼物質同時到位——花青素保護視網膜微血管、類胡蘿蔔素濾藍光、葉黃素支撐黃斑部。紫莓植萃的四個食材，建構的是一張完整的護眼網路。",
      items: [
        { icon: "🟠", name: "木鱉果", preview: "木鱉果的微脂體化類胡蘿蔔素吸收率遠高於一般補充品，茄紅素與β-胡蘿蔔素含量極高，是護眼配方的核心脂溶性來源。", full: "木鱉果的類胡蘿蔔素含量是番茄的數十倍，但脂溶性成分需要油脂才能被吸收。透過微脂體技術，將類胡蘿蔔素包覆在脂質載體中，大幅提升生物利用率——讓眼睛真正吸收得到，而不是吃了過一圈原封不動排出去。這是木鱉果最關鍵的技術優勢。", key: "微脂體類胡蘿蔔素 · 茄紅素 · β-胡蘿蔔素 · 高吸收率" },
        { icon: "🟣", name: "紫薯", preview: "紫薯的花青素與β-胡蘿蔔素雙重護眼，水溶性花青素保護視網膜微血管，脂溶性β-胡蘿蔔素轉化為視紫質支撐夜視力。", full: "紫薯的深紫色來自豐富的花青素，能強化視網膜微血管的韌性，減少長時間用眼後的微血管損傷，讓眼睛充血與乾澀的狀況緩解。β-胡蘿蔔素轉化為視網膜所需的視紫質，直接支撐視覺感光能力，是眼睛最底層的保護原料。", key: "花青素 · β-胡蘿蔔素 · 視紫質支撐 · 視網膜微血管保護" },
        { icon: "🫐", name: "藍莓", preview: "藍莓的花青素是研究最充分的護眼植化素，幫助視紫質再生、促進眼睛在明暗之間的適應速度，減少視覺疲勞。", full: "藍莓的花青素是目前護眼研究最充分的植化素之一，能促進視網膜中視紫質的再生速度，讓眼睛在明暗環境之間的適應更快；同時減少長時間盯螢幕後的視覺疲勞與乾澀感。對於每天使用 3C 超過 8 小時的人來說，藍莓花青素是最直接的護眼支援。", key: "花青素 · 視紫質再生 · 明暗適應 · 視覺疲勞修復" },
        { icon: "🖤", name: "桑椹", preview: "桑椹的花青素與白藜蘆醇協同作用，強化藍莓的護眼效果，同時對抗藍光引起的視網膜氧化壓力。", full: "桑椹與藍莓形成花青素雙重來源，兩者的花青素結構略有不同，協同作用比單一來源更全面。桑椹特有的白藜蘆醇，能對抗藍光引起的視網膜氧化壓力——現代人每天盯螢幕，藍光持續轟炸視網膜，白藜蘆醇就是這道傷害的天然緩衝層。", key: "花青素 · 白藜蘆醇 · 藍光防護 · 視網膜抗氧化" },
      ],
    },
    earthStory: {
      items: [
        { icon: "🟠", name: "木鱉果", sub: "熱帶叢林裡最鮮豔的護眼寶石", story: "木鱉果生長在東南亞的熱帶叢林，果實成熟時外殼裂開，露出鮮紅飽滿的果肉——那一抹橙紅，是類胡蘿蔔素高度濃縮的顏色。在越南，人們長年用木鱉果入菜，補充視力；現代科學發現，它的類胡蘿蔔素含量遠超過番茄，是目前已知最豐富的天然護眼色素來源之一。", key: "微脂體類胡蘿蔔素 · 茄紅素 · β-胡蘿蔔素 · 葉黃素" },
        { icon: "🟣", name: "紫薯", sub: "土壤深處積累的雙重護眼力量", story: "紫薯在土壤深處緩慢生長，把陽光透過葉片轉化的養分一點一點儲存進根莖。那一層深紫，是花青素的顏色——植物抵抗紫外線與氧化傷害的自我保護機制。我們吃下去，就等於借用了這套防禦系統，讓眼睛也能抵抗每天來自螢幕的藍光與氧化壓力。", key: "花青素 · β-胡蘿蔔素 · 視紫質支撐 · 多酚類" },
        { icon: "🫐", name: "藍莓", sub: "北方寒地孕育的護眼小巨人", story: "藍莓生長在北方寒冷的酸性土壤，為了對抗強烈紫外線與極端氣候，在果皮裡積累了驚人濃度的花青素。那一顆顆看起來不起眼的小果實，每一顆都是護眼植化素的高度濃縮。二戰期間英國皇家空軍飛行員喝藍莓醬提升夜視力的故事，是花青素護眼研究最早的起點。", key: "花青素 · 視紫質再生 · 明暗適應 · 抗氧化" },
        { icon: "🖤", name: "桑椹", sub: "千年桑樹結出的東方護眼智慧", story: "桑樹在東方有幾千年的栽培歷史，最初是為了養蠶，但桑椹的藥用價值早被中醫典籍記載——明目、補血、滋陰。現代科學從桑椹中萃取出花青素與白藜蘆醇，發現它對視網膜的保護作用與藍莓互補，兩者花青素結構不同，放在一起形成更全面的護眼覆蓋。", key: "花青素 · 白藜蘆醇 · 藍光防護 · 視網膜抗氧化" },
      ],
    },
    bodyNeed: {
      intro: "紫莓植萃不是給「眼睛已經出問題」的人設計的，而是為那些每天都在消耗視力、卻從來沒有認真補充的人，建立一道日常防線。",
      items: [
        { icon: "📱", who: "每天使用 3C 超過 8 小時", why: "藍光持續轟炸視網膜，白藜蘆醇與花青素是每天必須補充的天然緩衝層。" },
        { icon: "😣", who: "眼睛乾澀、容易疲勞", why: "花青素促進視紫質再生，讓長時間用眼後的視覺疲勞恢復更快、乾澀感降低。" },
        { icon: "🌙", who: "夜間視力變差、怕光", why: "β-胡蘿蔔素轉化為視紫質，直接支撐感光能力，改善明暗適應速度。" },
        { icon: "💻", who: "設計師、工程師、文字工作者", why: "長時間高強度用眼的職業族群，需要比一般人更積極的日常護眼支援。" },
        { icon: "🎮", who: "電競、直播、影音創作者", why: "螢幕前一坐就是十幾小時，視網膜承受的氧化壓力遠超過一般使用者。" },
        { icon: "👴", who: "中年後視力開始退化", why: "葉黃素與類胡蘿蔔素支撐黃斑部健康，是預防老年性黃斑部病變最重要的植化素。" },
      ],
    },
    science: {
      intro: "每一個數字背後都是真實的配方計算，不是行銷數字，是你喝下去的東西的實際成分。",
      stats: [
        { value: "71.5", label: "大卡 / 每 100g" },
        { value: "3.7g", label: "蛋白質 / 每 100g" },
        { value: "350ml", label: "標準份量（10 塊冰磚）" },
        { value: "0", label: "人工添加物種類" },
      ],
      marvinRange: "8–20",
      marvinDotLeft: "27%",
      marvinDotRight: "65%",
      marvinNote: "特別適合「眼睛與視力負擔」、「3C 使用過度」、「氧化壓力累積」三類得分偏高的人。眼睛是最容易被忽略、卻每天消耗最大的器官——紫莓植萃用水脂雙溶的設計，讓護眼植化素真正被身體吸收，而不是喝了過去、原封不動帶走。",
    },
  },
};


const productCards = [
  {
    id: "white",
    name: "雪山植萃",
    english: "Pearl White",
    colorName: "珍珠白",
    theme: "慢性發炎修復 · 腸胃黏膜修護 · 溫和植物重啟",
    icon: Sparkles,
    accent: "#EDE3D0",
    deep: "#A98E61",
    formula: "山藥、蘋果、白木耳、生核桃等天然蔬果穀物組成。",
    desc: "身體一直感覺「差一點」，不是沒睡夠，是沒給夠修復的材料。讓植物做那一次最需要的溫柔重啟。",
    forWho: "久坐辦公室、腸胃敏感、熬夜族",
    tags: ["Omega-3 抗炎", "銀耳多醣體", "腸胃修護", "壓力族適用", "無人工添加"],
    aiHint: "Dr.Marvin 會在睡眠、壓力、腸胃敏感與修復需求偏高時，優先把雪山植萃列為溫和支持選項。",
    sections: [
      {
        title: "適合族群",
        text: "適合熬夜族、壓力疲勞明顯、腸胃容易敏感，或希望用低刺激植物配方照顧日常狀態的人。"
      },
      {
        title: "核心食材",
        text: "以山藥、蘋果、白木耳、生核桃等天然蔬果穀物建立溫潤基底，提供植物多醣、纖維與堅果油脂線索。"
      },
      {
        title: "機能說明",
        text: "重點放在抗發炎支持、腸胃修復與溫和滋養，讓身體在疲勞與敏感狀態下回到穩定節奏。"
      },
      {
        title: "飲用情境",
        text: "適合早晨狀態不穩、熬夜隔天、壓力後恢復，或想用一杯溫和植物飲作為日常保養時飲用。"
      },
      {
        title: "AI 推薦邏輯",
        text: "當 Dr.Marvin 健康分析偵測到睡眠、壓力、免疫或消化訊號較高時，會將此配方作為修復與穩定的推薦方向。"
      },
      {
        title: "研究資料入口",
        text: "完整營養學、植化素與相關科學邏輯，請由研究資料入口集中閱讀，不在首頁一次鋪陳。"
      }
    ]
  },
  {
    id: "green",
    name: "青檸植萃",
    english: "Emerald Green",
    colorName: "翡翠綠",
    theme: "腸道促排 · 代謝重啟 · 體內環保",
    icon: Leaf,
    accent: "#D8EDD4",
    deep: "#3B8C52",
    formula: "地瓜葉、青江菜、黑木耳、芭樂、檸檬等天然蔬果組成。",
    desc: "身體堆積的東西，需要一個出口。地瓜葉、黑木耳、檸檬、芭樂，讓腸道重新動起來，讓代謝重新跑起來。",
    forWho: "水腫、代謝慢、想排清體內廢物的人",
    tags: ["膳食纖維複合體", "天然維生素C", "腸道促排", "代謝重啟", "無人工添加"],
    aiHint: "Dr.Marvin 會在腸胃、代謝、外食頻率與身體沉重感訊號偏高時，優先考慮青檸植萃。",
    sections: [
      {
        title: "適合族群",
        text: "適合外食族、久坐上班族、排便節奏不固定、常覺得身體沉重，或想建立每日體內環保習慣的人。"
      },
      {
        title: "核心食材",
        text: "以地瓜葉、青江菜、黑木耳、芭樂、檸檬等天然蔬果組成，補上深綠植萃與膳食纖維線索。"
      },
      {
        title: "機能說明",
        text: "重點放在膳食纖維、促進腸胃蠕動與代謝排除，支持高油、高鹽與外食生活後的清爽感。"
      },
      {
        title: "飲用情境",
        text: "適合外食隔天、久坐後、身體覺得悶重，或需要讓消化節奏回到輕盈狀態時飲用。"
      },
      {
        title: "AI 推薦邏輯",
        text: "當 Dr.Marvin 健康分析偵測到消化、代謝、水腫或外食相關訊號較高時，會推薦此配方作為清理型支持。"
      },
      {
        title: "研究資料入口",
        text: "膳食纖維、植化素、SGS 模擬與更完整科學邏輯，統一收進研究資料入口。"
      }
    ]
  },
  {
    id: "rose",
    name: "玫瑰植萃",
    english: "Rose Red",
    colorName: "寶石紅",
    theme: "女性養顏保養 · 氣色紅潤 · 抗氧化",
    icon: Heart,
    accent: "#F2D8DE",
    deep: "#C4607A",
    formula: "甜菜根、紫甘藍、芭樂、百香果、玫瑰花瓣等天然蔬果組成。",
    desc: "氣色不是化妝品補出來的，是從細胞底層養出來的。Beetroot、紫甘藍、百香果、玫瑰花瓣，讓紅潤從裡面透出來。",
    forWho: "想維持好氣色、注重女性日常保養的人",
    tags: ["甜菜紅素", "花青素雙重來源", "膠原蛋白支持", "女性日常保養", "無人工添加"],
    aiHint: "Dr.Marvin 會在氣色、抗氧化、女性保養與膠原生成支持需求出現時，推薦玫瑰植萃。",
    sections: [
      {
        title: "適合族群",
        text: "適合重視氣色管理、女性保養、肌膚光澤、日常抗氧化與外在狀態的人。"
      },
      {
        title: "核心食材",
        text: "以甜菜根、紫甘藍、芭樂、百香果、玫瑰花瓣等天然蔬果組成，提供紅紫色植化素與維生素 C 線索。"
      },
      {
        title: "機能說明",
        text: "重點放在維生素 C、膠原蛋白生成支持與紅潤氣色，讓保養更接近日常飲食。"
      },
      {
        title: "飲用情境",
        text: "適合重要場合前、忙碌工作日、肌膚狀態需要維持，或想把保養變成每日儀式時飲用。"
      },
      {
        title: "AI 推薦邏輯",
        text: "當 Dr.Marvin 健康分析偵測到氣色、女性保養、抗氧化或美感機能需求時，會把此配方列為推薦。"
      },
      {
        title: "研究資料入口",
        text: "維生素 C、花青素與膠原生成相關科學資料，集中於研究資料入口閱讀。"
      }
    ]
  },
  {
    id: "gold",
    name: "桂香植萃",
    english: "Golden Yellow",
    colorName: "金鑽黃",
    theme: "運動修復 · 增肌代謝 · 抗訓練後發炎",
    icon: Dumbbell,
    accent: "#F5E8B0",
    deep: "#C49020",
    formula: "甜玉米、香蕉、紅蘿蔔、百香果、新鮮薑黃等天然蔬果組成。",
    desc: "練完之後，身體需要的不只是蛋白質，而是一套完整的修復邏輯。薑黃、玉米、豆薯、香蕉，讓肌肉真正恢復，讓下一次更有力量。",
    forWho: "有健身習慣、重視體態管理、想維持活力的人",
    tags: ["薑黃素雙路徑抗炎", "蛋白質節省作用", "電解質補充", "延遲性痠痛修復", "無人工添加"],
    aiHint: "Dr.Marvin 會在肌肉、運動恢復、能量代謝與體能消耗訊號偏高時，推薦桂香植萃。",
    sections: [
      {
        title: "適合族群",
        text: "適合規律運動者、訓練後需要補給的人、體能消耗大、久站外勤，或想兼顧增肌修復與能量管理的人。"
      },
      {
        title: "核心食材",
        text: "以甜玉米、香蕉、紅蘿蔔、百香果、新鮮薑黃等天然蔬果組成，建立金色能量與抗氧化線索。"
      },
      {
        title: "機能說明",
        text: "重點放在運動修復、蛋白質利用與抗氧化支持，讓訓練後補給更乾淨、日常化。"
      },
      {
        title: "飲用情境",
        text: "適合運動後、久站外勤後、體能消耗大的一天，或需要溫和能量補給時飲用。"
      },
      {
        title: "AI 推薦邏輯",
        text: "當 Dr.Marvin 健康分析偵測到肌肉緊繃、運動恢復、體力消耗或能量代謝訊號時，會推薦此配方。"
      },
      {
        title: "研究資料入口",
        text: "薑黃、抗氧化與運動修復相關研究資料，集中於研究資料入口閱讀。"
      }
    ]
  },
  {
    id: "purple",
    name: "紫莓植萃",
    english: "Crystal Purple",
    colorName: "水晶紫",
    theme: "護眼抗氧化 · 3C族保養 · 水脂雙溶",
    icon: Eye,
    accent: "#E8DDF5",
    deep: "#7B52C0",
    formula: "木鱉果、紫薯、藍莓、桑椹、紫色高麗菜等天然蔬果組成。",
    desc: "眼睛每天都在燒，卻沒有人認真補充它需要的東西。木鱉果、紫薯、藍莓、桑椹，建構水脂雙溶的護眼網路。",
    forWho: "長時間使用螢幕、眼睛疲勞、重視抗氧化的人",
    tags: ["微脂體類胡蘿蔔素", "花青素雙重來源", "水脂雙溶護眼", "3C族保養", "無人工添加"],
    aiHint: "Dr.Marvin 會在眼睛疲勞、長時間螢幕使用與抗氧化需求偏高時，推薦紫莓植萃。",
    sections: [
      {
        title: "適合族群",
        text: "適合 3C 族群、長時間盯螢幕、夜間工作、閱讀量大、眼睛容易乾澀疲勞，或希望維持視覺節奏的人。"
      },
      {
        title: "核心食材",
        text: "以木鱉果、紫薯、藍莓、桑椹、紫色高麗菜等天然蔬果組成，結合紫色植萃與類胡蘿蔔素線索。"
      },
      {
        title: "機能說明",
        text: "重點放在花青素、類胡蘿蔔素與護眼抗氧化，支持長時間用眼後的日常保養。"
      },
      {
        title: "飲用情境",
        text: "適合長時間使用手機與電腦後、閱讀或工作量大的一天，或需要專注與視覺保養時飲用。"
      },
      {
        title: "AI 推薦邏輯",
        text: "當 Dr.Marvin 健康分析偵測到眼睛疲勞、螢幕使用、睡眠不足或抗氧化需求時，會推薦此配方。"
      },
      {
        title: "研究資料入口",
        text: "花青素、類胡蘿蔔素與視覺保養相關科學資料，集中於研究資料入口閱讀。"
      }
    ]
  }
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
    return <div className="rounded-2xl border border-brand-border-warm bg-white/75 p-7 text-center text-brand-mid">資料載入中...</div>;
  }
  if (error) {
    return <div className="rounded-2xl border border-brand-error-border bg-brand-error-bg p-7 text-center text-brand-error">{error}</div>;
  }
  if (empty) {
    return <div className="rounded-2xl border border-brand-border-warm bg-white/75 p-7 text-center text-brand-mid">{children || "目前尚無公開資料。"}</div>;
  }
  return null;
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-8 max-w-7xl">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-border-gold px-3 py-1 text-[10px] uppercase tracking-brand-widest text-brand-gold-deep">
        {eyebrow}
      </span>
      <h2 className="max-w-3xl text-[30px] font-normal leading-[1.25] text-brand-dark md:text-[42px]">
        {title}
      </h2>
      {text && <p className="mt-2.5 max-w-2xl text-[14px] leading-[1.75] text-brand-mid">{text}</p>}
    </div>
  );
}

function Pill({ children }) {
  return <span className="rounded-full border border-brand-border-gold/70 bg-white/70 px-4 py-2 text-sm text-brand-nav shadow-sm">{children}</span>;
}

function ProductMetric({ product }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 shadow-sm backdrop-blur">
      <div className="text-4xl font-semibold leading-none" style={{ color: product.deep }}>{product.plantCount}</div>
      <div className="text-xs font-semibold uppercase tracking-brand-wider text-brand-mid">
        種植物機能
        <span className="mt-1 block text-[10px] tracking-brand-wide text-brand-gold-deep">PLANT SYSTEM</span>
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
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-brand-dark">
              {section.title}
              <ChevronDown className="h-4 w-4 shrink-0 text-brand-gold-deep transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-7 text-brand-mid">{section.text}</p>
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
            <h4 className="text-base font-semibold text-brand-dark">{section.title}</h4>
          </div>
          <p className="mt-3 text-sm leading-7 text-brand-mid">{section.text}</p>
        </div>
      ))}
    </div>
  );
}

function ProductSystemCard({ product, onMore }) {
  const Icon = product.icon;
  return (
    <article className="group flex min-h-[460px] flex-col rounded-[1.5rem] border border-white/80 bg-white/72 p-6 shadow-sm shadow-brand-dark/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-dark/10 md:p-7" style={{ background: `linear-gradient(145deg, rgba(255,255,255,.86), ${product.accent}88)` }}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-brand-wider text-brand-gold-deep">{product.colorName}｜{product.english}</div>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-brand-dark">{product.name}</h3>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: product.deep }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-6 text-lg font-medium leading-8 text-brand-dark">{product.theme}</p>
      <p className="mt-3 text-sm leading-7 text-brand-mid">{product.desc}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {product.tags.map((tag) => <span key={tag} className="rounded-full border border-white/90 bg-white/75 px-3 py-1.5 text-xs font-semibold text-brand-nav shadow-sm">{tag}</span>)}
      </div>

      <div className="mt-6 rounded-2xl border border-white/80 bg-white/72 p-4">
        <div className="text-xs font-semibold uppercase tracking-brand-wider text-brand-gold-deep">核心食材</div>
        <p className="mt-2 text-sm leading-7 text-brand-mid">{product.formula}</p>
      </div>

      <button type="button" onClick={() => onMore(product)} className="mt-auto inline-flex w-full items-center justify-between rounded-full bg-brand-dark px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-dark/12 transition hover:bg-[#1E6B43]">
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
    <article className="flex min-h-[360px] flex-col rounded-[1.5rem] border border-white/80 bg-white/75 p-6 shadow-sm shadow-brand-dark/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-dark/10" style={{ background: `linear-gradient(145deg, rgba(255,255,255,.9), ${product.accent}8C)` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-brand-wider text-brand-gold-deep">{product.colorName}</p>
          <h3 className="mt-3 text-3xl font-semibold text-brand-dark">{product.name}</h3>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: product.deep }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-6 text-lg font-medium leading-8 text-brand-dark">{product.theme}</p>
      <p className="mt-3 inline-flex items-start gap-2 rounded-full bg-white/55 px-4 py-1.5 text-sm leading-6 text-brand-mid">
        <span className="shrink-0 text-brand-gold-deep">適合</span>
        <span className="text-brand-dark">{product.forWho}</span>
      </p>
      <p className="mt-4 text-sm leading-7 text-brand-mid">{product.formula}</p>
      <button type="button" onClick={() => go(`/products/${productSlugs[product.id]}`)} className="mt-auto inline-flex items-center justify-between rounded-full bg-brand-dark px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E6B43]">
        了解更多
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function useRoute() {
  const getInitialRoute = () => {
    const params = new URLSearchParams(window.location.search);
    const liffState = params.get("liff.state");
    if (!liffState) return window.location.pathname;

    try {
      const decodedPath = decodeURIComponent(liffState);
      const decodedUrl = decodedPath.startsWith("http")
        ? new URL(decodedPath)
        : null;
      const nextPath = decodedUrl ? decodedUrl.pathname : decodedPath.split("?")[0];
      const nextSearch = decodedUrl ? decodedUrl.search : decodedPath.includes("?") ? `?${decodedPath.split("?").slice(1).join("?")}` : "";

      if (nextPath === "/line" || nextPath.startsWith("/line/")) {
        window.history.replaceState({}, "", `${nextPath}${nextSearch}`);
        return nextPath;
      }
    } catch {
      return window.location.pathname;
    }

    return window.location.pathname;
  };

  const [route, setRoute] = useState(getInitialRoute);
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

function HexIcon({ fill, stroke, emoji }) {
  return (
    <div style={{ width: 50, height: 50, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ position: "absolute", top: 0, left: 0 }}>
        <polygon points="25,3 46,14 46,36 25,47 4,36 4,14" fill={fill} stroke={stroke} strokeWidth="1.5" />
      </svg>
      <span style={{ position: "relative", zIndex: 1, fontSize: 20, lineHeight: 1 }}>{emoji}</span>
    </div>
  );
}

function ExpandCard({ colors, icon, name, preview, full, keyText, isIngredient = false, sub = "" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      onClick={() => setOpen((v) => !v)}
      style={{
        background: colors.bg,
        border: `${open ? "1.5px" : "0.5px"} solid ${open ? colors.accent : colors.border}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ padding: "13px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: colors.deep }}>{name}</div>
              {sub && <div style={{ fontSize: 10, color: colors.accent, marginTop: 1 }}>{sub}</div>}
            </div>
          </div>
          <span style={{ fontSize: 11, color: colors.accent, transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
        {!isIngredient && (
          <div style={{
            fontSize: 11, color: colors.text, lineHeight: 1.7,
            display: "-webkit-box", WebkitLineClamp: open ? "unset" : 2,
            WebkitBoxOrient: "vertical", overflow: open ? "visible" : "hidden",
          }}>
            {preview}
          </div>
        )}
        {!isIngredient && (
          <div style={{ fontSize: 10, color: colors.accent, fontWeight: 500, marginTop: 8, paddingTop: 8, borderTop: `0.5px solid ${colors.border}` }}>
            {keyText}
          </div>
        )}
      </div>
      {open && (
        <div style={{ padding: "0 14px 13px", borderTop: `0.5px solid ${colors.border}` }}>
          <div style={{ paddingTop: 12, fontSize: 11, color: colors.text, lineHeight: 1.8 }}>
            {full}
            {isIngredient && (
              <div style={{ fontSize: 10, color: colors.accent, fontWeight: 500, marginTop: 8, paddingTop: 8, borderTop: `0.5px solid ${colors.border}` }}>
                {keyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailPanel({ productId, onClose }) {
  const [activeTab, setActiveTab] = React.useState("natural");
  const detail = productDetails[productId];
  if (!detail) return null;
  const { colors, naturalForce, earthStory, bodyNeed, science } = detail;

  const tabs = [
    { id: "natural", emoji: "🌱", en: "Natural Force", zh: "自然的力量" },
    { id: "earth", emoji: "🌿", en: "Earth's Story", zh: "大地的故事" },
    { id: "body", emoji: "🫀", en: "Body's Need", zh: "身體的需要" },
    { id: "science", emoji: "🔬", en: "Science Speaks", zh: "科學的驗證" },
  ];

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* 四大 icon 按鈕 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: 8, marginBottom: 14 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? colors.bg : "white",
              border: `${activeTab === tab.id ? "1.5px" : "1px"} solid ${activeTab === tab.id ? colors.accent : colors.border}`,
              borderRadius: 16,
              padding: "16px 8px 14px",
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              boxShadow: activeTab === tab.id ? `0 0 0 3px ${colors.accent}22` : "none",
              transition: "all 0.15s",
            }}
          >
            <HexIcon fill={colors.hex} stroke={colors.hexBorder} emoji={tab.emoji} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: colors.deep, lineHeight: 1.25 }}>{tab.en}</div>
              <div style={{ fontSize: 10, color: colors.accent, marginTop: 2 }}>{tab.zh}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 內容面板 */}
      <div style={{ background: colors.bg, border: `0.5px solid ${colors.border}`, borderRadius: 16, padding: 20 }}>

        {/* Natural Force */}
        {activeTab === "natural" && (
          <div>
            <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `0.5px solid ${colors.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: colors.deep }}>Natural Force</div>
              <div style={{ fontSize: 10, color: colors.accent, marginTop: 1 }}>自然的力量</div>
            </div>
            <div style={{ background: "white", borderLeft: `3px solid ${colors.accent}`, borderRadius: "0 8px 8px 0", padding: "14px 16px", marginBottom: 16, fontSize: 13, lineHeight: 1.85, color: colors.deep }}>
              {naturalForce.intro}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
              {naturalForce.items.map((item) => (
                <ExpandCard key={item.name} colors={colors} icon={item.icon} name={item.name} preview={item.preview} full={item.full} keyText={item.key} />
              ))}
            </div>
          </div>
        )}

        {/* Earth's Story */}
        {activeTab === "earth" && (
          <div>
            <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `0.5px solid ${colors.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: colors.deep }}>Earth's Story</div>
              <div style={{ fontSize: 10, color: colors.accent, marginTop: 1 }}>大地的故事</div>
            </div>
            <div style={{ background: "white", borderRadius: 8, padding: "14px 16px", marginBottom: 14, fontSize: 13, lineHeight: 1.9, color: colors.deep, border: `0.5px solid ${colors.border}` }}>
              <p style={{ marginBottom: 8 }}>在每一口食物的背後，都藏著一片土地的性格。</p>
              <p style={{ marginBottom: 8 }}>陽光、雨水、海風、土壤，以及人們長年累積的耕作智慧，慢慢養出了食材真正的味道。</p>
              <p>「大地的故事」想說的，不只是食材從哪裡來，而是它如何在這片土地上長大，如何被時間與自然慢慢孕育。</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
              {earthStory.items.map((item) => (
                <ExpandCard key={item.name} colors={colors} icon={item.icon} name={item.name} preview="" full={item.story} keyText={item.key} isIngredient sub={item.sub} />
              ))}
            </div>
          </div>
        )}

        {/* Body's Need */}
        {activeTab === "body" && (
          <div>
            <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `0.5px solid ${colors.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: colors.deep }}>Body's Need</div>
              <div style={{ fontSize: 10, color: colors.accent, marginTop: 1 }}>身體的需要</div>
            </div>
            <div style={{ background: "white", borderLeft: `3px solid ${colors.accent}`, borderRadius: "0 8px 8px 0", padding: "14px 16px", marginBottom: 16, fontSize: 13, lineHeight: 1.85, color: colors.deep }}>
              {bodyNeed.intro}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
              {bodyNeed.items.map((item) => (
                <div key={item.who} style={{ background: "white", border: `0.5px solid ${colors.border}`, borderRadius: 12, padding: "12px 13px" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: colors.deep, marginBottom: 4 }}>{item.icon} {item.who}</div>
                  <div style={{ fontSize: 11, color: colors.text, lineHeight: 1.6 }}>{item.why}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Science Speaks */}
        {activeTab === "science" && (
          <div>
            <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `0.5px solid ${colors.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: colors.deep }}>Science Speaks</div>
              <div style={{ fontSize: 10, color: colors.accent, marginTop: 1 }}>科學的驗證</div>
            </div>
            <div style={{ background: "white", borderLeft: `3px solid ${colors.accent}`, borderRadius: "0 8px 8px 0", padding: "14px 16px", marginBottom: 16, fontSize: 13, lineHeight: 1.85, color: colors.deep }}>
              {science.intro}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: 12 }}>
              {science.stats.map((s) => (
                <div key={s.label} style={{ background: "white", border: `0.5px solid ${colors.border}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 500, color: colors.deep }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: colors.accent, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "white", border: `0.5px solid ${colors.border}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.accent, fontWeight: 500, marginBottom: 6 }}>Dr. Marvin 健康評估指數對應</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: colors.deep, marginBottom: 10 }}>最適合評估分數 {science.marvinRange} 分的你</div>
              <div style={{ height: 7, borderRadius: 4, background: "linear-gradient(to right, #1D9E75 0%, #EF9F27 45%, #E24B4A 100%)", position: "relative", marginBottom: 5 }}>
                <div style={{ position: "absolute", top: -4, left: science.marvinDotLeft, width: 14, height: 14, borderRadius: "50%", background: colors.bg, border: `2px solid ${colors.accent}`, transform: "translateX(-50%)" }} />
                <div style={{ position: "absolute", top: -4, left: science.marvinDotRight, width: 14, height: 14, borderRadius: "50%", background: colors.bg, border: `2px solid ${colors.accent}`, transform: "translateX(-50%)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: colors.accent, marginBottom: 8 }}>
                <span>0 健康綠燈</span><span>11 輕度</span><span>20 中度</span><span>30 重度</span>
              </div>
              <div style={{ fontSize: 11, color: colors.text, lineHeight: 1.7 }}>{science.marvinNote}</div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{ marginTop: 16, width: "100%", background: "transparent", border: `0.5px solid ${colors.border}`, borderRadius: 999, padding: "10px 0", fontSize: 13, cursor: "pointer", color: colors.deep }}
      >
        收起說明
      </button>
    </div>
  );
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
    <header className="sticky top-0 z-50 border-b border-brand-border-gold bg-brand-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-7">
        <button type="button" onClick={() => go("/")} className="flex items-center gap-3 text-left">
          <img src={logo} alt="植本邏輯 PHYTOLOGIC Logo" className="h-9 w-9 object-contain" />
          <span>
            <span className="block text-[14px] font-medium tracking-brand-wider text-brand-dark">植本邏輯</span>
            <span className="block text-[9px] tracking-brand-widest text-brand-mid">PHYTOLOGIC</span>
          </span>
        </button>
        <nav className="hidden items-center gap-7 text-[12px] font-normal text-brand-mid xl:flex">
          {nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className={`transition hover:text-brand-gold-deep ${route === item.path ? "text-brand-gold-deep" : ""}`}>{item.label}</button>)}
        </nav>
        <button type="button" onClick={handleOpenLine} className="hidden rounded-full bg-line px-5 py-2.5 text-[11px] font-medium tracking-brand-wide text-white transition hover:bg-line-hover md:block">加入 LINE</button>
        <button type="button" className="xl:hidden" onClick={() => setMenuOpen((v) => !v)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="border-t border-brand-border-gold bg-brand-surface/98 px-5 py-5 xl:hidden"><div className="grid gap-4">{nav.map((item) => <button key={item.path} type="button" onClick={() => handleNav(item)} className="text-left text-sm text-brand-mid">{item.label}</button>)}<button type="button" onClick={handleOpenLine} className="w-fit rounded-full bg-line px-5 py-2.5 text-[11px] tracking-brand-wide text-white">加入 LINE</button></div></div>}
    </header>
  );
}

function HomePage({ go }) {
  const [activeProduct, setActiveProduct] = useState(productCards[1]);
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-dark px-5 py-14 md:px-9">
        <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-9 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="mb-5 flex items-center gap-2 text-[10px] uppercase tracking-brand-widest text-brand-gold-deep">
              <span className="inline-block h-px w-6 bg-brand-gold-deep" />
              Phytologic · 植物機能飲
            </p>
            <h1 className="text-[44px] font-normal leading-[1.18] text-white md:text-[64px]">
              每一杯，<br />都是給家人的<br /><em className="italic text-brand-gold-warm">真實答案。</em>
            </h1>
            <p className="mt-5 max-w-md text-[14px] leading-[1.85] text-white/60">
              無人工、無化學、無合成。五色植物機能系統，從土地到身體的長期陪伴。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => go("/products")} className="rounded-full bg-white px-6 py-3 text-[12px] font-medium text-brand-dark transition hover:bg-[#F5F0E8]">探索產品系列</button>
              <button type="button" onClick={() => go("/assessment")} className="rounded-full border border-brand-border-gold/50 px-6 py-3 text-[12px] text-brand-gold-warm transition hover:bg-white/10">了解 Dr.Marvin</button>
              <button type="button" onClick={handleOpenLine} className="rounded-full border border-white/20 px-6 py-3 text-[12px] text-white/70 transition hover:bg-white/10">加入 LINE</button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="flex flex-col gap-2">
            {productCards.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setActiveProduct(product)}
                className={`flex items-center gap-3 rounded-full border px-4 py-2.5 transition ${activeProduct.id === product.id ? "border-brand-border-gold/50 bg-white/[0.06]" : "border-white/10 bg-transparent"}`}
              >
                <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${product.accent}, ${product.deep})` }} />
                <div className="flex-1 text-left">
                  <div className="text-[12px] font-medium text-white">{product.name}</div>
                  <div className="text-[10px] tracking-wide text-white/40">{product.english}</div>
                </div>
                <div className="text-[10px] text-brand-gold-warm/70">{product.tags[0]}</div>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] px-5 py-14 md:px-7">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="News" title="最新消息" text="品牌公告、合作計畫與系統開發進度。" />
          <div className="overflow-hidden rounded-2xl border border-brand-border-gold divide-y divide-brand-border-gold">
            {homeNews.map((item) => (
              <button key={item.title} type="button" onClick={() => go("/news")} className="grid w-full grid-cols-[56px_1fr_16px] items-start gap-4 bg-white px-5 py-4 text-left transition hover:bg-brand-surface">
                <div>
                  <div className="text-[10px] tracking-brand-wide text-brand-gold-deep">{item.date}</div>
                  <div className="mt-0.5 text-[10px] text-brand-mid">{item.category}</div>
                </div>
                <div>
                  <div className="mb-1 text-[13px] font-medium text-brand-dark">{item.title}</div>
                  <div className="text-[12px] leading-[1.65] text-brand-mid">{item.text}</div>
                </div>
                <div className="mt-0.5 text-[18px] text-brand-gold-warm">›</div>
              </button>
            ))}
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
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-brand-border-warm bg-white/75 p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold tracking-brand-wider text-brand-gold-deep">FOUNDER STORY</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-brand-dark">從國際品牌經理人，到一位父親。</h2>
          <div className="mt-7 space-y-5 text-base leading-8 text-brand-mid">
            <p>年輕時，我們總以為人生最重要的是成功、速度與規模。直到創辦人成為父親，健康才從抽象概念變成能不能陪孩子長大、陪家人旅行、陪愛的人慢慢變老的人生問題。</p>
            <p>植本邏輯因此從六個家庭的真實願望出發，重新研究植物、營養、人體修復、東方藥食智慧與西方營養學。</p>
            <p>真正重要的問題不是能不能賣，而是如果這是每天要給家人吃的東西，它應該長成什麼樣子。</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {["重視生命", "尊重自然", "相信邏輯"].map((value) => (
              <span key={value} className="rounded-full border border-brand-border-gold px-5 py-2 text-sm text-brand-mid">{value}</span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="mb-6 text-xs uppercase tracking-brand-widest text-brand-gold-deep">Life Colors</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {colorStories.map((story, index) => (
              <div key={story.color} className="rounded-2xl p-6" style={{ background: story.card, color: story.textColor }}>
                <div className="mb-3 text-xs tracking-brand-wider opacity-40">0{index + 1}</div>
                <div className="mb-1 text-base font-semibold">{story.color}</div>
                <div className="mb-3 text-sm font-medium" style={{ color: story.number }}>{story.title}</div>
                <p className="text-sm leading-7" style={{ color: story.muted }}>{story.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductsPage({ go }) {
  const [activeProduct, setActiveProduct] = useState(productCards[1]);
  return (
    <main className="bg-brand-surface px-5 py-16 md:px-8">
      <SectionTitle eyebrow="Product System" title="全植物機能飲" text="先選擇產品，再進入完整介紹。產品總覽只保留核心定位與食材摘要。" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { num: "01", title: "不是飲料，是食物", text: "每天敢給家人吃為底線，回到植物、營養與身體真正需要的本質。" },
            { num: "02", title: "三好原則", text: "好喝、好看、好吸收。真正能持續的健康，一定要能融入生活。" },
            { num: "03", title: "三無鐵律", text: "無人工、無化學、無合成。真正重要的人，值得最乾淨的選擇。" },
          ].map((card) => (
            <div key={card.num} className="rounded-2xl border border-brand-border-warm bg-white/70 p-6">
              <div className="mb-3 text-sm text-brand-gold-deep">{card.num}</div>
              <h3 className="mb-2 font-semibold text-brand-dark">{card.title}</h3>
              <p className="text-sm leading-7 text-brand-mid">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          {productCards.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setActiveProduct(product)}
              className={`rounded-2xl border p-3 text-center transition ${activeProduct.id === product.id ? "border-brand-border-gold" : "border-transparent"}`}
              style={{ background: `${product.accent}${activeProduct.id === product.id ? "CC" : "66"}` }}
            >
              <div className="mx-auto mb-2 h-9 w-9 rounded-full" style={{ background: `linear-gradient(135deg, ${product.accent}, ${product.deep})` }} />
              <div className="text-[11px] font-medium text-brand-dark">{product.name}</div>
              <div className="mt-0.5 text-[9px] tracking-wide text-brand-mid">{product.english}</div>
            </button>
          ))}
        </div>
        <div className="rounded-[1.5rem] bg-brand-dark p-7 text-white">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[30px] font-normal">{activeProduct.name}</h3>
              <p className="mt-1 text-[12px] text-brand-gold-warm/80">{activeProduct.theme}</p>
            </div>
            <div className="h-12 w-12 rounded-full border-2 border-white/20" style={{ background: `linear-gradient(135deg, ${activeProduct.accent}, ${activeProduct.deep})` }} />
          </div>
          <p className="mb-4 text-[13px] leading-[1.8] text-white/70">{activeProduct.desc}</p>
          <p className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-[12px] leading-7 text-white/58">{activeProduct.formula}</p>
          <div className="flex flex-wrap gap-1.5">
            {activeProduct.tags.map((tag) => <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/75">{tag}</span>)}
          </div>
          <button type="button" onClick={() => go(`/products/${productSlugs[activeProduct.id]}`)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-medium text-brand-dark transition hover:bg-[#F5F0E8]">
            進入完整介紹 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
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
        <button type="button" onClick={() => go("/products")} className="rounded-full bg-brand-dark px-7 py-4 font-semibold text-white">回產品總覽</button>
      </main>
    );
  }
  const Icon = product.icon;
  return (
    <main className="px-5 py-16 md:px-8">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-sm" style={{ background: "linear-gradient(145deg, rgba(255,255,255,.9), " + product.accent + "99)" }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: product.deep }}><Icon className="h-8 w-8" /></div>
          <p className="mt-7 text-sm font-semibold tracking-brand-wider text-brand-gold-deep">{product.colorName}｜{product.english}</p>
          <h1 className="mt-3 text-5xl font-semibold text-brand-dark">{product.name}</h1>
          <p className="mt-5 text-xl leading-9 text-brand-mid">{product.theme}</p>
          <p className="mt-5 text-sm leading-7 text-brand-mid">{product.desc}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => <span key={tag} className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-nav shadow-sm">{tag}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => go("/assessment")} className="rounded-full bg-brand-dark px-7 py-4 font-semibold text-white">開始 Dr.Marvin 分析</button>
            <button type="button" onClick={handleOpenLine} className="rounded-full border border-line bg-white/75 px-7 py-4 font-semibold text-[#087E3A]">加入官方 LINE</button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["核心定位", product.desc],
            ["主要食材", product.formula],
            ["適合族群", product.sections.find((section) => section.title === "適合族群")?.text],
            ["營養邏輯", product.sections.find((section) => section.title === "機能說明")?.text],
          ].map(([title, text]) => (
            <article key={title} className="rounded-[1.5rem] border border-brand-border-warm bg-white/75 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-brand-dark">{title}</h2>
              <p className="mt-4 leading-8 text-brand-mid">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-8 max-w-7xl rounded-[2rem] border border-brand-border-warm bg-white/82 p-4 shadow-sm md:p-7">
        <ProductDetailPanel productId={product.id} onClose={() => go("/products")} />
      </section>
    </main>
  );
}
function AssessmentPage() {
  return (
    <main className="bg-[#F5F0E8] px-5 py-16 md:px-8">
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
        <div className="rounded-[2rem] bg-brand-dark p-8 text-white md:p-12">
          <h2 className="text-4xl font-semibold leading-tight">合作理念</h2>
          <p className="mt-6 text-lg leading-9 text-white/75">我們尋找的不是只想賣產品的人，而是願意一起推動植物機能、健康教育與長期會員陪伴的城市夥伴。</p>
          <div className="mt-8 flex flex-wrap gap-3"><Pill>城市合作者</Pill><Pill>門市加盟</Pill><Pill>衛星據點</Pill><Pill>企業健康方案</Pill></div>
        </div>
        <div className="rounded-[2rem] border border-brand-border-warm bg-white/75 p-8 shadow-sm">
          <h2 className="text-3xl font-semibold text-brand-dark">合作流程</h2>
          <ol className="mt-6 grid gap-4 text-brand-mid">
            {["提交合作需求", "品牌團隊初步洽談", "確認合作模式與城市條件", "導入產品、LINE 與 Dr.Marvin 服務", "展開試飲與會員經營"].map((item, index) => (
              <li key={item} className="rounded-2xl bg-brand-bg p-4"><span className="font-semibold text-brand-gold-deep">0{index + 1}</span> {item}</li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
        {["品牌與產品教育完整建置", "試飲活動與加盟展轉換流程", "LINE 會員與 Dr.Marvin 健康分析導入"].map((item) => (
          <article key={item} className="rounded-[1.5rem] border border-brand-border-warm bg-white/75 p-7 shadow-sm">
            <h3 className="text-xl font-semibold text-brand-dark">{item}</h3>
            <p className="mt-4 leading-7 text-brand-mid">總部提供可複製的營運內容與品牌支持，讓合作夥伴能更快進入市場。</p>
          </article>
        ))}
      </section>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap gap-3">
        <button type="button" onClick={() => setFormOpen((open) => !open)} className="rounded-full bg-brand-dark px-8 py-4 font-semibold text-white">{formOpen ? "收起合作表單" : "我要合作"}</button>
        <button type="button" onClick={() => go("/partners")} className="rounded-full border border-brand-gold-deep bg-white/70 px-8 py-4 font-semibold text-brand-dark">合作據點入口</button>
      </div>
      {formOpen && (
        <form onSubmit={submitContact} className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-brand-border-warm bg-white/80 p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2"><input value={contactForm.name} onChange={(e) => updateContact("name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="姓名" /><input value={contactForm.phone} onChange={(e) => updateContact("phone", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="電話" /><input value={contactForm.email} onChange={(e) => updateContact("email", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="Email" /><select value={contactForm.type} onChange={(e) => updateContact("type", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep"><option>合作類型</option><option>門市加盟</option><option>城市合作者</option><option>企業健康方案</option><option>試飲活動</option><option>媒體/其他</option></select></div>
          <textarea value={contactForm.message} onChange={(e) => updateContact("message", e.target.value)} className="mt-5 min-h-36 w-full rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="請留下您的需求與所在城市" />
          <button disabled={contactStatus === "loading"} className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-dark px-8 py-4 font-medium text-white shadow-xl shadow-brand-dark/15 transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]">{contactStatus === "loading" ? "送出中..." : formSent ? "已收到洽詢" : "送出洽詢"} <ArrowRight className="h-4 w-4" /></button>
          {contactNotice && <p className={`mt-4 rounded-2xl px-5 py-4 ${contactStatus === "error" ? "bg-brand-error-bg text-brand-error" : "bg-[#DDEEDB] text-[#1E6B43]"}`}>{contactNotice}</p>}
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
    <main className="bg-brand-bg px-5 py-16 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-brand-widest text-brand-gold-deep">Partners</p>
            <h1 className="text-4xl font-semibold tracking-tight text-brand-dark md:text-6xl">合作夥伴平台</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-mid">展示已核准合作夥伴，提供合作申請入口。</p>
          </div>
          <button type="button" onClick={() => setFormOpen((open) => !open)} className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-dark px-7 py-4 font-semibold text-white shadow-xl shadow-brand-dark/15 transition hover:bg-[#1E6B43]">
            申請成為合作夥伴 <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading && <div className="mt-10 rounded-2xl border border-brand-border-warm bg-white/75 p-7 text-center text-brand-mid">資料載入中...</div>}
        {error && <div className="mt-10 rounded-2xl border border-brand-error-border bg-brand-error-bg p-7 text-center text-brand-error">{error}</div>}
        {!loading && !error && partners.length === 0 && <div className="mt-10 rounded-2xl border border-brand-border-warm bg-white/75 p-7 text-center text-brand-mid">目前尚無已核准合作夥伴</div>}

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayPartners.map((partner) => (
            <article key={partner.id || partner.partner_name} className="rounded-2xl border border-[#E2D5B5] bg-white/85 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-dark/8">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-brand-border-gold bg-brand-surface-2 text-2xl font-semibold text-brand-gold-deep">
                  {partner.partner_name?.slice(0, 1) || "植"}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-brand-dark">{partner.partner_name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-brand-surface-2 px-3 py-1 text-[#6C5A2F]">{partner.city}</span>
                    <span className="rounded-full bg-[#DDEEDB] px-3 py-1 text-[#1E6B43]">類型：{partner.category}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-brand-border-warm pt-5">
                <div className="text-sm text-brand-gold-deep">聯絡人</div>
                <div className="mt-1 font-semibold text-brand-dark">{partner.contact_name || "合作窗口"}</div>
                <p className="mt-4 min-h-20 leading-8 text-brand-mid">{partner.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                <a className="rounded-full border border-brand-border-gold bg-white px-4 py-2 font-medium text-brand-dark transition hover:border-brand-gold-deep" href={partner.website_url || "#合作申請"}>查看據點</a>
                <a className="rounded-full bg-brand-dark px-4 py-2 font-medium text-white transition hover:bg-[#1E6B43]" href={partner.instagram_url || partner.facebook_url || "#合作申請"}>聯繫合作夥伴</a>
                {partner.isSample && <span className="rounded-full bg-brand-surface-2 px-4 py-2 text-brand-gold-deep">範例卡片</span>}
              </div>
            </article>
          ))}
        </div>

        {formOpen && (
          <form id="合作申請" onSubmit={submit} className="mx-auto mt-12 max-w-5xl rounded-2xl border border-brand-border-gold bg-white/90 p-7 shadow-xl shadow-brand-dark/8">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-brand-wider text-brand-gold-deep">Application</p>
                <h2 className="mt-2 text-3xl font-semibold text-brand-dark">合作申請表單</h2>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="w-fit rounded-full border border-brand-border-gold px-5 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-surface-2">收起表單</button>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <label className="rounded-2xl border border-dashed border-brand-border-gold bg-brand-surface p-5 md:col-span-2">
                <span className="block text-sm font-medium text-brand-gold-deep">上傳品牌 Logo 或大頭貼</span>
                <input name="partner_logo" type="file" accept="image/*" onChange={updateLogo} className="mt-3 block w-full text-sm text-brand-mid file:mr-4 file:rounded-full file:border-0 file:bg-brand-dark file:px-5 file:py-2 file:font-semibold file:text-white" />
                {logoPreview && <img src={logoPreview} alt="合作夥伴 Logo 預覽" className="mt-4 h-24 w-24 rounded-2xl border border-[#E2D5B5] object-cover" />}
              </label>
              <input value={form.partner_name} onChange={(e) => update("partner_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="合作夥伴名稱 *" />
              <input value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="城市 *" />
              <select value={form.partner_type} onChange={(e) => update("partner_type", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep">
                {["門市", "工作室", "健康顧問", "活動據點"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <input value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="聯絡人 *" />
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="電話 *" />
              <input value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep" placeholder="Email *" />
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="min-h-32 rounded-2xl border border-[#E2D5B5] bg-white px-5 py-4 outline-none focus:border-brand-gold-deep md:col-span-2" placeholder="簡短介紹" />
            </div>
            <button disabled={submitStatus === "loading"} className="mt-5 rounded-full bg-brand-dark px-8 py-4 font-medium text-white transition hover:bg-[#1E6B43] disabled:cursor-not-allowed disabled:bg-[#9FAEA5]">{submitStatus === "loading" ? "送出中..." : "送出合作申請"}</button>
            {notice && <p className={`mt-4 rounded-2xl px-5 py-4 ${submitStatus === "error" || notice.includes("失敗") || notice.includes("尚未設定") ? "bg-brand-error-bg text-brand-error" : "bg-[#DDEEDB] text-[#1E6B43]"}`}>{notice}</p>}
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
    <main className="bg-[#F5F0E8] px-5 py-16 md:px-8">
      <SectionTitle eyebrow="News" title="植本公布欄" text="品牌活動、試飲活動、加盟說明會、合作公告與健康文章。" />
      <DataState loading={loading} error={error} empty={!loading && !error && sorted.length === 0}>目前尚無已發布公告。</DataState>
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-brand-border-gold divide-y divide-brand-border-gold">
        {sorted.map((item) => (
          <article key={item.id || item.title} className="grid gap-4 bg-white px-5 py-4 transition hover:bg-brand-surface md:grid-cols-[120px_1fr]">
            <div>
              <div className="text-[10px] tracking-brand-wide text-brand-gold-deep">{item.is_pinned ? "置頂" : item.published_at}</div>
              <div className="mt-0.5 text-[10px] text-brand-mid">{item.category}</div>
            </div>
            <div>
              {item.cover_image_url && <img src={item.cover_image_url} alt="" className="mb-4 aspect-[16/7] w-full rounded-xl object-cover" />}
              <h3 className="mb-1 text-[16px] font-medium text-brand-dark">{item.title}</h3>
              <p className="text-[13px] leading-[1.75] text-brand-mid">{item.summary}</p>
              <p className="mt-3 text-[12px] leading-7 text-brand-muted">{item.content}</p>
            </div>
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
          <article key={item.id || item.title} className="break-inside-avoid overflow-hidden rounded-2xl border border-brand-border-warm bg-white/80 shadow-sm">
            {item.type === "video" ? (
              <div className="aspect-video bg-brand-dark p-6 text-white">影片：{item.media_url}</div>
            ) : (
              <img src={item.thumbnail_url || item.media_url || "/logo.png"} alt={item.title} className={`w-full object-cover ${index % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`} />
            )}
            <div className="p-6">
              <div className="text-sm text-brand-gold-deep">{item.category}</div>
              <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-7 text-brand-mid">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Footer({ go }) {
  const footerLinks = [
    ["品牌理念", "/about"],
    ["產品系列", "/products"],
    ["Dr.Marvin", "/assessment"],
    ["最新消息", "/news"],
    ["合作加盟", "/join"],
    ["合作夥伴", "/partners"],
  ];
  return (
    <footer className="bg-brand-dark px-5 py-10 text-white md:px-7">
      <div className="mx-auto max-w-7xl">
        <h3 className="mb-1 text-[20px] font-normal">植本邏輯 Phytologic</h3>
        <p className="mb-6 text-[12px] text-white/45">植物 · 邏輯 · 每日健康陪伴</p>
        <div className="mb-7 flex flex-wrap gap-4">
          {footerLinks.map(([label, path]) => (
            <button key={label} type="button" onClick={() => go(path)} className="text-[12px] text-white/55 transition hover:text-brand-gold-warm">{label}</button>
          ))}
        </div>
        <hr className="mb-5 border-white/10" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] text-white/30">© 2026 植本邏輯 Phytologic. All rights reserved.</span>
            <button type="button" onClick={() => go("/admin")} className="text-[11px] text-white/35 transition hover:text-brand-gold-warm">管理入口</button>
          </div>
          <button type="button" onClick={handleOpenLine} className="flex w-fit items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 text-[11px] text-white/70 transition hover:bg-white/12">
            <span className="h-2 w-2 rounded-full bg-line" />
            {lineId}
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function PhytologicWebsite() {
  const [route, go] = useRoute();
  const isAdminRoute = route === "/admin" || route.startsWith("/admin/");
  const isLineRoute = route === "/line" || route.startsWith("/line/");

  if (isLineRoute) {
    const linePage = route === "/line" || route === "/line/entry"
      ? <LineEntry go={go} />
      : route === "/line/member-home" || route === "/line/home"
      ? <LineMemberHomePage route={route} go={go} />
      : route === "/line/today"
      ? <LineTodayPage route={route} go={go} />
      : route === "/line/analysis"
      ? <LineAnalysisPage route={route} go={go} />
      : route === "/line/reports"
      ? <LineReportsPage route={route} go={go} />
      : route === "/line/cards"
      ? <LineCardsPage route={route} go={go} />
      : route === "/line/checkin"
      ? <LineCheckinPage route={route} go={go} />
      : route === "/line/profile"
      ? <LineProfilePage route={route} go={go} />
      : route === "/line/tasks" || route === "/line/missions"
      ? <LineTasksPage route={route} go={go} />
      : route === "/line/events"
      ? <LineEventsPage route={route} go={go} />
      : route === "/line/referral"
      ? <LineReferralPage route={route} go={go} />
      : route === "/line/shop"
      ? <LineShopPage route={route} go={go} />
      : route === "/line/encyclopedia"
      ? <EncyclopediaListPage route={route} go={go} />
      : /^\/line\/encyclopedia\/[^/]+\/wiki\/[^/]+$/.test(route)
      ? <WikiDetailPage route={route} go={go} />
      : /^\/line\/encyclopedia\/[^/]+$/.test(route)
      ? <LineEncyclopediaProductPage route={route} go={go} />
      : route === "/line/assessment"
      ? <LineAssessmentPage route={route} go={go} />
      : <LineEntry go={go} />;

    return (
      <React.Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-brand-bg text-sm text-brand-mid">
            載入中...
          </div>
        }
      >
        {linePage}
      </React.Suspense>
    );
  }

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
    <div className="min-h-screen bg-brand-bg text-brand-dark">
      {!isAdminRoute && !isLineRoute && <Header route={route} go={go} />}
      {page}
      {!isAdminRoute && !isLineRoute && <Footer go={go} />}
      {!isAdminRoute && !isLineRoute && <FloatingLineButton />}
    </div>
  );
}
