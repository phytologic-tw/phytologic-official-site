import React from "react";
import LineMemberLayout from "./LineMemberLayout";

const WIKI_DATA = {
  matcha: {
    emoji: "🍵",
    name: "抹茶",
    latin: "Camellia sinensis · Tencha",
    origin: "日本宇治・中國浙江",
    family: "茶科",
    era: "千年歷史",
    history: "抹茶起源於中國唐代，當時以「末茶」形式記載於文獻。南宋時期，禪宗僧侶將點茶文化帶入日本，逐漸形成茶道美學，也讓抹茶成為兼具儀式感與日常營養的植物素材。",
    historyQuote: "「茶者，南方之嘉木也。」— 陸羽《茶經》。人類與綠茶的緣分超過千年，是藥食同源文化中最具代表性的植物之一。",
    growing: "優質抹茶在採收前會遮光栽培，促使茶葉累積葉綠素與 L-茶氨酸，造就深邃翠綠色與鮮甜甘味。宇治火山土壤礦物質豐富，是培育高等級抹茶的重要產區。",
    eating: [
      { icon: "🥛", title: "抹茶拿鐵", desc: "與植物奶混合，溫飲柔順，冷飲清爽" },
      { icon: "🧊", title: "植本冰塊", desc: "以冷凍方式保留風味與植化素多樣性" },
      { icon: "🍮", title: "食品烹調", desc: "加入燕麥、優格或點心，提升風味層次" },
      { icon: "⚗️", title: "機能萃取", desc: "作為 EGCG 與茶氨酸的植物來源" },
    ],
    nutrition: "抹茶富含 EGCG、L-茶氨酸、葉綠素與多酚，常被用於專注、抗氧化與日常代謝支持相關研究。作為全葉研磨粉末，抹茶提供比一般浸泡茶湯更多完整植物成分。",
    nutritionNote: "植本邏輯以抹茶作為綠拿鐵風味與植化素骨架之一，搭配葉菜、藻類與莓果植萃形成多來源營養設計。",
    pills: ["EGCG 兒茶素", "L-茶氨酸", "葉綠素", "維生素 C", "鋅", "硒"],
  },
  spirulina: {
    emoji: "🌿",
    name: "螺旋藻",
    latin: "Arthrospira platensis",
    origin: "中美洲・非洲查德湖",
    family: "藍藻門",
    era: "35 億年歷史",
    history: "螺旋藻是地球上極古老的光合生物之一。阿茲特克人曾從湖中採收食用，20 世紀後也因高蛋白密度與穩定培育效率，成為太空食物與植物性營養研究中的代表素材。",
    historyQuote: "螺旋藻蛋白質含量高，並含有藻藍素、類胡蘿蔔素與礦物質。每一口螺旋藻，都承載著長時間演化出的光合作用智慧。",
    growing: "螺旋藻在鹼性、溫暖的淡水環境中生長旺盛。現代多以封閉式光生物反應器培育，便於控制水質、光照與純度。",
    eating: [
      { icon: "🥤", title: "加入飲品", desc: "少量加入果昔或綠拿鐵，補充植物蛋白" },
      { icon: "🧊", title: "植本冰塊", desc: "以其他植萃平衡藻類風味" },
      { icon: "🍱", title: "食物調味", desc: "少量加入沙拉醬或湯品，增加草本層次" },
      { icon: "💊", title: "膠囊補充", desc: "適合不習慣藻味的人以補充品形式攝取" },
    ],
    nutrition: "螺旋藻含完整胺基酸、β-胡蘿蔔素、葉黃素、玉米黃質與藻藍素，是植物性蛋白與抗氧化植化素的常見來源。",
    nutritionNote: "植本邏輯將螺旋藻放入綠拿鐵中，作為植物蛋白、藻藍素與微量營養的支撐素材。",
    pills: ["藻藍素", "β-胡蘿蔔素", "植物 B12", "鐵", "葉黃素", "完整胺基酸"],
  },
  barleygrass: {
    emoji: "🌾",
    name: "大麥草",
    latin: "Hordeum vulgare",
    origin: "中東新月沃土・現代全球培育",
    family: "禾本科",
    era: "一萬年農耕史",
    history: "大麥是人類最早馴化的糧食作物之一，大麥草則是種子成熟前的幼嫩葉片。現代機能食品重新關注其葉綠素、酵素與礦物質組成，使它成為綠色營養素材代表。",
    historyQuote: "大麥草的價值不在單一成分，而在幼嫩葉片中多種植化素、礦物質與綠色營養的共存。",
    growing: "大麥草通常在幼苗期收割，此時葉綠素與植化素濃度較高。低溫加工可降低熱破壞，保留清新的青草風味。",
    eating: [
      { icon: "🥛", title: "大麥草拿鐵", desc: "草本香氣與植物奶融合，口感清新" },
      { icon: "🧊", title: "植本冰塊", desc: "作為葉綠素骨架，搭配其他植萃形成完整配方" },
      { icon: "🥗", title: "沙拉調味", desc: "少量加入醬料，增添礦物感" },
      { icon: "🍵", title: "純粹沖泡", desc: "以低溫水沖泡，保留清爽草本風味" },
    ],
    nutrition: "大麥草含葉綠素、維生素 K、葉酸、礦物質與 GABA 等成分，是日常綠色蔬食補充的常見素材。",
    nutritionNote: "植本邏輯以大麥草作為綠拿鐵的葉綠素來源之一，協助建立清爽、穩定的植物基底。",
    pills: ["SOD 酵素", "葉綠素", "GABA", "維生素 K", "葉酸", "有機鉻"],
  },
  lutein: {
    emoji: "🌼",
    name: "葉黃素",
    latin: "Lutein · C40H56O2",
    origin: "金盞花・菠菜・羽衣甘藍",
    family: "類胡蘿蔔素",
    era: "1945 年首次分離",
    history: "葉黃素屬於類胡蘿蔔素家族，常見於金盞花與深綠色葉菜。現代營養研究中特別關注它在黃斑色素與日常護眼營養中的角色。",
    historyQuote: "葉黃素和玉米黃質是視網膜黃斑區重要的類胡蘿蔔素來源，因此成為眼部營養研究的核心素材之一。",
    growing: "金盞花是葉黃素的重要商業來源。花瓣盛開時採收，經萃取後可取得高濃度葉黃素酯或游離葉黃素。",
    eating: [
      { icon: "🥬", title: "深色葉菜", desc: "菠菜、羽衣甘藍與青花菜是天然來源" },
      { icon: "🥚", title: "蛋黃", desc: "油脂基質有助脂溶性植化素攝取" },
      { icon: "🌼", title: "金盞花萃取", desc: "常見於標準化護眼營養補充" },
      { icon: "🫐", title: "搭配花青素", desc: "以不同植化素組合支援日常眼部保養" },
    ],
    nutrition: "葉黃素是脂溶性類胡蘿蔔素，常被用於藍光暴露、黃斑色素密度與抗氧化相關營養研究。",
    nutritionNote: "植本邏輯以葉黃素搭配花青素與綠色植萃，建立更完整的護眼營養支援邏輯。",
    pills: ["游離葉黃素", "玉米黃質", "類胡蘿蔔素", "抗藍光因子", "抗氧化活性", "視網膜營養"],
  },
  anthocyanin: {
    emoji: "🫐",
    name: "花青素",
    latin: "Anthocyanin · Polyphenol",
    origin: "藍莓・紫莓・紫高麗菜",
    family: "類黃酮多酚",
    era: "1835 年命名",
    history: "花青素名稱來自希臘文的花與藍色，是植物世界中廣泛分布的水溶性色素。從莓果到紫色蔬菜，深紅、紫藍與墨藍色澤都來自不同花青素組合。",
    historyQuote: "花青素不只是顏色，也是植物面對日照、低溫與環境壓力時形成的防護系統。",
    growing: "莓果在冷涼、酸性土壤中常能累積較高花青素。成熟採收時色澤越深，通常代表多酚組成越豐富。",
    eating: [
      { icon: "🫐", title: "直接食用", desc: "新鮮藍莓、桑葚與覆盆子保留完整風味" },
      { icon: "🧊", title: "植本冰塊", desc: "以冷凍保留莓果香氣與深色多酚" },
      { icon: "🥤", title: "冷壓果汁", desc: "低溫處理能降低高溫加工影響" },
      { icon: "🍇", title: "多色搭配", desc: "與綠色、黃色蔬果搭配形成彩虹飲食" },
    ],
    nutrition: "花青素是水溶性多酚，常被研究於抗氧化、循環支持、眼部營養與認知保養等日常健康方向。",
    nutritionNote: "植本邏輯以莓果植萃搭配綠拿鐵基底，補足水溶性多酚與深色植物營養。",
    pills: ["花青素", "原花青素 OPC", "類黃酮多酚", "抗氧化活性", "循環支持", "深色植化素"],
  },
  egcg: {
    emoji: "🍵",
    name: "EGCG 兒茶素",
    latin: "Epigallocatechin Gallate · C22H18O11",
    origin: "綠茶葉・抹茶",
    family: "黃酮醇類植化素",
    era: "1989 年結構確認",
    history: "EGCG 是綠茶中的代表性兒茶素，也是茶多酚研究中最常被討論的活性成分之一。抹茶因全葉研磨，能提供比一般茶湯更完整的茶葉組成。",
    historyQuote: "EGCG 的研究橫跨抗氧化、代謝支持與細胞保護等營養科學方向，是茶類植化素的核心代表。",
    growing: "蒸青、遮光與低溫保存都會影響茶葉多酚風味與保留度。高品質抹茶會重視採收、蒸青、乾燥與研磨的完整流程。",
    eating: [
      { icon: "🍵", title: "抹茶沖泡", desc: "以溫水沖泡，避免高溫帶出苦澀" },
      { icon: "🧊", title: "植本冰塊", desc: "低溫封存茶香與植化素組合" },
      { icon: "🥛", title: "搭配植物奶", desc: "形成穩定、柔順的綠拿鐵口感" },
      { icon: "💊", title: "綠茶萃取", desc: "常見於標準化多酚補充品" },
    ],
    nutrition: "EGCG 具多酚結構，是抗氧化與代謝支持研究中的重要素材。與 L-茶氨酸共同存在時，也形成茶類獨特的清醒感與平衡風味。",
    nutritionNote: "植本邏輯把 EGCG 視為綠拿鐵的茶多酚核心，搭配葉綠素與莓果多酚形成多層次植化素網絡。",
    pills: ["EGCG 多酚", "L-茶氨酸", "兒茶素 ECG", "抗氧化多酚", "代謝支持", "微量咖啡因"],
  },
  curcumin: {
    emoji: "🌱",
    name: "薑黃素",
    latin: "Curcumin · C21H20O6",
    origin: "印度・東南亞・中國南部",
    family: "二酮類多酚",
    era: "1815 年首次分離",
    history: "薑黃在印度阿育吠陀與亞洲飲食文化中使用悠久。薑黃素作為其代表性多酚，19 世紀被分離後成為現代植物營養研究的熱門素材。",
    historyQuote: "薑黃素是研究量相當高的天然多酚之一，其價值在於植物防禦系統與日常飲食文化的交會。",
    growing: "薑黃偏好熱帶、亞熱帶且排水良好的土壤。根莖成熟後乾燥研磨，會形成鮮明的金黃色澤與辛香氣息。",
    eating: [
      { icon: "🍲", title: "烹調加熱", desc: "與油脂、黑胡椒搭配，提升風味與攝取效率" },
      { icon: "🥛", title: "薑黃拿鐵", desc: "植物奶、薑黃、黑胡椒與薑形成經典黃金飲" },
      { icon: "🧊", title: "植本冰塊", desc: "以配方平衡辛香與吸收設計" },
      { icon: "💊", title: "複合補充", desc: "常見於植物多酚或日常保養補充品" },
    ],
    nutrition: "薑黃素是二酮類多酚，常被研究於抗氧化、發炎反應調節與消化道日常支持。植本邏輯僅作營養教育，不作療效承諾。",
    nutritionNote: "植本邏輯以薑黃素補足金黃色多酚軸線，與綠色、紫色植化素共同建立多色植物營養邏輯。",
    pills: ["薑黃素", "去甲氧基薑黃素", "雙去甲氧基薑黃素", "胡椒素增效", "抗氧化多酚", "消化支持"],
  },
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getRouteParams(route = "") {
  const match = route.match(/^\/line\/encyclopedia\/([^/]+)\/wiki\/([^/]+)/);
  return {
    productId: match?.[1] || "green-latte",
    ingredientId: match?.[2] || "matcha",
  };
}

export default function WikiDetailPage({ route, go }) {
  const { productId, ingredientId } = getRouteParams(route);
  const wiki = WIKI_DATA[ingredientId] || WIKI_DATA.matcha;
  const member = readStoredMember();

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div style={{ background: "#F9F5EA", minHeight: "100dvh" }}>
        <button type="button" onClick={() => go(`/line/encyclopedia/${productId}`)} style={backButtonStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A30" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span style={{ fontSize: 14, color: "#3D5A30", fontWeight: 600 }}>產品詳情</span>
        </button>

        <div style={{ background: "linear-gradient(160deg, #2D5016 0%, #3a6820 100%)", padding: "24px 20px 28px" }}>
          <div style={{ fontSize: 52, float: "right", marginTop: -10 }}>{wiki.emoji}</div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "#C9A96E", marginBottom: 8, textTransform: "uppercase" }}>
            植本百科 · 原料志
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>{wiki.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4, fontStyle: "italic" }}>{wiki.latin}</div>
          <div style={{ clear: "both" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {[`📍 ${wiki.origin}`, `🌿 ${wiki.family}`, `⏱ ${wiki.era}`].map((chip) => (
              <span key={chip} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "4px 12px", fontSize: 10, color: "rgba(255,255,255,0.8)" }}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <WikiSection title="歷史淵源">
          <p style={textStyle}>{wiki.history}</p>
          <div style={highlightStyle}>{wiki.historyQuote}</div>
        </WikiSection>

        <WikiSection title="生長背景">
          <p style={textStyle}>{wiki.growing}</p>
        </WikiSection>

        <WikiSection title="食用方式">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
            {wiki.eating.map((item) => (
              <div key={item.title} style={{ background: "white", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1A2F15" }}>{item.title}</div>
                <div style={{ fontSize: 10, color: "#8A9A6A", marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </WikiSection>

        <WikiSection title="營養與植化素價值">
          <p style={textStyle}>{wiki.nutrition}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {wiki.pills.map((pill) => (
              <span key={pill} style={{ background: "#2D5016", color: "white", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
                {pill}
              </span>
            ))}
          </div>
          <div style={{ ...highlightStyle, marginTop: 12 }}>{wiki.nutritionNote}</div>
        </WikiSection>

        <div style={{ height: "calc(16px + env(safe-area-inset-bottom))" }} />
      </div>
    </LineMemberLayout>
  );
}

function WikiSection({ title, children }) {
  return (
    <div style={{ padding: "16px 20px 0" }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#3D5A30",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        {title}
        <div style={{ flex: 1, height: 1, background: "#E8F0E0" }} />
      </div>
      {children}
    </div>
  );
}

const backButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "16px 20px 12px",
  border: 0,
  background: "transparent",
  cursor: "pointer",
  fontFamily: "'Noto Serif TC', Georgia, serif",
};

const textStyle = {
  fontSize: 13,
  color: "#1A2F15",
  lineHeight: 1.8,
  margin: 0,
};

const highlightStyle = {
  background: "#E8F0E0",
  borderLeft: "3px solid #3D5A30",
  borderRadius: "0 8px 8px 0",
  padding: "10px 14px",
  margin: "12px 0",
  fontSize: 12,
  color: "#2D5016",
  lineHeight: 1.7,
};
