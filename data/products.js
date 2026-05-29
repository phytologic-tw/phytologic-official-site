export const PRODUCTS = [
  {
    id: "snow",
    slug: "snow",
    sort_order: 10,
    name: "雪山植萃",
    short_name: "雪山",
    color_name: "珍珠白",
    theme: "抗發炎修復・溫和滋補",
    description: "珍珠白｜睡眠、壓力疲勞、腸胃敏感與免疫平衡支持。",
    focus: "sleep / stress / immune",
    tags: ["細胞修復", "腸胃支持", "抗氧化"],
    audience: "高壓、熬夜、腸胃敏感族群",
    ingredients: ["核桃", "銀耳", "蘋果", "植物基底"],
    best_for: ["疲勞", "腦霧", "睡眠品質差", "腸胃敏感"],
    system_keys: ["sleep", "stress", "immune"],
    line_summary: "適合疲勞、腦霧、睡眠品質差與腸胃敏感時，作為溫和修復的日常起點。",
    bg_color: "#F5EFE4",
    text_color: "#A98E61",
    status: "active",
  },
  {
    id: "lime",
    slug: "lime",
    sort_order: 20,
    name: "青檸植萃",
    short_name: "青檸",
    color_name: "翡翠綠",
    theme: "代謝促排・體內環保",
    description: "翡翠綠｜代謝循環、腸道順暢與體內環保支持。",
    focus: "digestion / metabolism",
    tags: ["腸道促排", "代謝支持", "高纖維"],
    audience: "代謝緩慢、消化不佳、減重族群",
    ingredients: ["深綠蔬菜", "芭樂", "檸檬", "黑木耳"],
    best_for: ["排便問題", "腹脹", "水腫", "甜食渴望"],
    system_keys: ["digestion", "metabolism"],
    line_summary: "適合腸胃卡住、外食較多、水腫與代謝沉重時，幫日常節奏重新跑起來。",
    bg_color: "#DDEEDB",
    text_color: "#1E6B43",
    status: "active",
  },
  {
    id: "rose",
    slug: "rose",
    sort_order: 30,
    name: "玫瑰植萃",
    short_name: "玫瑰",
    color_name: "寶石紅",
    theme: "女性保養・氣色・抗氧化",
    description: "寶石紅｜女性保養、氣色循環、保水滋潤與抗氧化支持。",
    focus: "female / beauty / circulation",
    tags: ["膠原支持", "紅潤氣色", "保水滋潤"],
    audience: "重視保養、氣色、女性日常",
    ingredients: ["甜菜根", "百香果", "銀耳", "植物基底"],
    best_for: ["荷爾蒙", "肌膚", "免疫", "氣色", "抗老"],
    system_keys: ["circulation", "female", "beauty"],
    line_summary: "適合氣色、保水、女性日常保養與抗氧化需求出現時，補足身體由內而外的原料。",
    bg_color: "#F5DDE2",
    text_color: "#AA3F57",
    status: "active",
  },
  {
    id: "cinna",
    slug: "cinna",
    sort_order: 40,
    name: "桂香植萃",
    short_name: "桂香",
    color_name: "金鑽黃",
    theme: "運動修復・增肌・代謝引擎",
    description: "金鑽黃｜運動恢復、能量代謝、電解質與體態管理支持。",
    focus: "muscle / exercise / energy",
    tags: ["運動修復", "電解質", "體態管理"],
    audience: "健身族、運動愛好者、恢復不足族群",
    ingredients: ["薑黃", "香蕉", "桂香調性", "植物基底"],
    best_for: ["肌肉關節痠痛", "體能下降", "運動恢復", "代謝支援"],
    system_keys: ["musculoskeletal", "energy", "metabolism"],
    line_summary: "適合運動恢復、體能消耗、肌肉關節負擔與需要補充代謝原料時。",
    bg_color: "#F8E6AD",
    text_color: "#B8871B",
    status: "active",
  },
  {
    id: "berry",
    slug: "berry",
    sort_order: 50,
    name: "紫莓植萃",
    short_name: "紫莓",
    color_name: "碧璽紫",
    theme: "護眼・抗氧化・3C族保養",
    description: "碧璽紫｜護眼抗氧化、3C 使用、長時間用眼與神經壓力支持。",
    focus: "eye / screen / antioxidant",
    tags: ["3C護眼", "花青素", "高吸收"],
    audience: "長時間使用 3C、護眼與抗氧化需求族群",
    ingredients: ["莓果", "花青素來源", "木鱉果", "植物基底"],
    best_for: ["眼睛乾澀", "3C疲勞", "神經壓力", "抗氧化"],
    system_keys: ["eye", "screen", "antioxidant", "energy"],
    line_summary: "適合長時間用眼、螢幕疲勞、抗氧化與視覺保養需求偏高時。",
    bg_color: "#E7DDF6",
    text_color: "#65439A",
    status: "active",
  },
];

export function activeProducts(products = PRODUCTS) {
  return products
    .filter((product) => product.status === "active")
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
}

export function findProductById(id, products = PRODUCTS) {
  return products.find((product) => product.id === id || product.slug === id || product.name === id) || null;
}

export function productOptions(products = PRODUCTS) {
  return activeProducts(products).map((product) => product.name);
}

export function productPromptList(products = PRODUCTS) {
  return activeProducts(products)
    .map((product) => `${product.id}｜${product.name}｜${product.theme}｜適合：${product.best_for.join("、")}`)
    .join("\n");
}
