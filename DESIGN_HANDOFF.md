# 植本邏輯 V3 網站——結構內容完整移交文件

> 給 Claude Design 的工程結構說明。視覺設計完成後，Claude Code 將依據 HTML 原稿套入各頁 JSX，**不修改文字內容與 Section 結構**。

---

## 一、檔案架構

```
src/
├── App.jsx                          路由入口
├── style.css                        全站 CSS 變數 + 動畫基底
├── components/
│   ├── SiteHeader.jsx               固定頂部導覽列
│   ├── SiteFooter.jsx               頁尾
│   └── FadeUp.jsx                   捲動進場元件（IntersectionObserver）
└── pages/
    ├── HomePage.jsx                 /（首頁）
    ├── IdeologyPage.jsx             /ideology（理念頁）
    ├── ContactPage.jsx              /contact（合作頁）
    ├── JournalPage.jsx              /journal（植本誌，假資料，待 Sanity 串接）
    └── series/
        ├── SnowMountainPage.jsx     /series/snow-mountain
        ├── LimeGreenPage.jsx        /series/lime-green
        ├── RosePage.jsx             /series/rose-red
        ├── CinnamonPage.jsx         /series/cinnamon-gold
        ├── PurpleBerryPage.jsx      /series/berry-purple
        └── PlatinumPage.jsx         /series/platinum
```

---

## 二、全站 CSS 變數（style.css）

```css
:root {
  /* Surfaces */
  --bg-base:        #F7F5F0;   /* 燕麥白，全站底色 */
  --ink-primary:    #2A2826;   /* 主文字，近黑非純黑 */
  --ink-secondary:  #6B6660;   /* 次要文字、標籤 */

  /* Soul Colors — 六色植萃各自的主色 */
  --soul-white:     #E9ECEB;   /* 雪山・無界白 */
  --soul-green:     #4F7A5C;   /* 青檸・山林綠 */
  --soul-red:       #C2272D;   /* 玫瑰・烈血紅 */
  --soul-yellow:    #D9A02E;   /* 桂香・傲嬌黃 */
  --soul-amethyst:  #9B6FC4;   /* 紫莓・水晶紫 */
  --soul-beige:     #E0D5BD;   /* 鉑金・米白 */

  /* Layout */
  --max-content-width: 1200px;
  --space-section-desktop: 140px;
  --space-section-mobile: 64px;

  /* Motion */
  --motion-duration: 700ms;
  --motion-easing: cubic-bezier(0.25, 0, 0.1, 1);
}

/* FadeUp 動畫基底 — 只改 CSS，不改 JS */
.fade-up {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity var(--motion-duration) var(--motion-easing),
    transform var(--motion-duration) var(--motion-easing);
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**字型**
- `body` → `Noto Sans TC`（sans-serif，body text）
- 標題 / blockquote / 風土段落 → `Noto Serif TC`（serif）

---

## 三、SiteHeader

固定於頂部，高度 64px，z-index 100。

```
[ PHYTOLOGIC 植本邏輯 ]    [ 理念 ]  [ 植萃系列 ]  [ 聯繫我們 ]  [ 加入 LINE 官方帳號 ▶ ]
```

- Logo → 連結到 `/`
- 導覽列連結 → 來自 navConfig.js
- LINE CTA → `https://line.me/R/ti/p/@248xuoic`，target blank，Pill 型深色按鈕
- 手機版 → `≡` 漢堡按鈕，展開後全幅 overlay

**navConfig.js 當前三個項目：**

| label | href |
|---|---|
| 理念 | `/ideology` |
| 植萃系列 | `/series/snow-mountain` |
| 聯繫我們 | `/contact` |

---

## 四、SiteFooter

兩欄 grid，底色 `--bg-base`，頂部 1px border。

```
左欄                              右欄
PHYTOLOGIC 植本邏輯                理念  植萃系列  聯繫我們
重視生命。尊重自然。相信邏輯。       lyra@phytologic.tw
                                  phytologic.tw

──────────────────────────────────────────────────
© 2026 Phytologic. All rights reserved.
```

Mobile → 單欄，右欄內容靠左對齊。

---

## 五、FadeUp 元件

IntersectionObserver，進入 viewport 時加 `.visible` class，觸發 CSS transition。

```jsx
<FadeUp delay={0}>        // 立即觸發
<FadeUp delay={200}>      // 200ms stagger
<FadeUp delay={400} style={{ marginBottom: '48px' }}>
```

- `delay` → transitionDelay（ms）
- `style` → 額外 inline style 傳入外層 div
- 動畫參數全由 style.css 控制，不在 JS 裡

---

## 六、IdeologyPage（/ideology）

5 個 Section，依序：

### S1 — Hero（全幅深色）

- `minHeight: 80vh`
- 背景：漸層佔位 `linear-gradient(160deg, #d8d5cc → #a8a49a → #6e6a60)`
- 深色疊層：`linear-gradient(to top, rgba(0,0,0,0.55) → rgba(0,0,0,0.1))`
- 文字靠左下，overline + H1

```
PHILOSOPHY

重視生命。
尊重自然。
相信邏輯。
```

H1：Noto Serif TC，clamp(28px, 5vw, 52px)，white，letterSpacing 0.08em

### S2 — 三好（淺色底）

- padding 120px 40px，max-width 1200px
- overline `THREE GOODS` + H2 `三好`（Noto Serif TC）
- 三欄 grid（auto-fit, minmax 240px），FadeUp stagger 0 / 150 / 300ms

| 標題 | 內文 |
|---|---|
| 好喝 | 每天願意喝，才算數。我們的起點不是「有效」，而是「你會想喝完它」——口感設計先於任何功能宣稱。 |
| 好看 | 六色植萃的顏色不是後製染出來的，是食材本身的顏色。視覺上讓人放心，因為它本來就應該長這樣。 |
| 好吸收 | 身體熟悉的語言，才能真正吸收。台灣在地食材，不是異國奇珍，是你的細胞本來就認識的東西。 |

### S3 — 三無（深色底 `--ink-primary` #2A2826）

- 同結構，文字白色系
- overline `THREE NONES` + H2 `三無`

| 標題 | 內文 |
|---|---|
| 無人工 | 不使用人工色素、人工香料、人工甜味劑。顏色和氣味來自食材，不來自實驗室。 |
| 無化學 | 配方不依賴化學添加物來延長保存或強化口感。成分表上的每個字，你應該都能理解它是什麼。 |
| 無合成 | 不添加合成維生素或濃縮萃取物取代真實食材。你喝到的，是食物本身，不是食物的替身。 |

### S4 — 永續飲食（窄欄 720px）

overline `SUSTAINABLE EATING` + H2 `為什麼堅持台灣在地食材`

**段落 1：**
聯合國糧農組織與世界衛生組織在2019年共同提出「永續健康飲食」的框架，其中有幾個核心原則反覆出現：低環境衝擊、保護生物多樣性、在地與季節性食材優先、文化適切性。

**段落 2：**
植本邏輯的選材邏輯，從一開始就沿著這個方向走：地瓜葉、青江菜、老薑、薑黃、桂花——這些是台灣田間本來就有的食材，不是因為異國稀有才選它們，而是因為它們本來就在這裡，不需要長途運輸，也不需要反季節栽培。

**段落 3：**
我們走進台灣的鄉間田林，尋找真正有價值的植物來源。這不是行銷語言——這是研發起點的真實限制，也是我們認為最誠實的一個選擇。

### S5 — 導引按鈕

- `探索植萃系列` → `/series/snow-mountain`，Pill 深色實心
- `回到首頁` → `/`，Pill 透明框線

---

## 七、ContactPage（/contact）

單欄，max-width 680px，置中，padding-top: header(64px) + 80px。

```
COLLABORATION

與對的人，
做對的事

我們相信，真正有意義的合作建立在共同的價值觀上。植本邏輯的每一個決策，
從食材來源到品牌呈現，都遵循「好吸收、好喝、好看」的原則——
這不只是產品標準，也是我們選擇合作夥伴的標準。

無論是通路合作、異業結合、內容共創，或是對品牌理念有共鳴的媒體與創作者，
都歡迎寫信給我們。

[ 了解合作方式與詳情 ]    ← mailto:lyra@phytologic.tw
lyra@phytologic.tw
```

- H1：Noto Serif TC，clamp(24px, 4vw, 36px)，--ink-primary
- Body：15px，--ink-secondary，lineHeight 2.2
- 按鈕：Pill，深色實心，`mailto:lyra@phytologic.tw`

---

## 八、六色系列頁面（共用結構範本）

> 2026-07-02 改版：套入 Claude Design 視覺稿（`~/Desktop/PHYTOLOGIC Website Design System-2/_export/pages/series-*.html`），版面由「滿版深色疊圖」改為「左右分割」。舊版（單欄滿版+深色疊層）已淘汰，以下為現行版面。

所有六色頁面 **Section 結構完全相同**，只有 `SERIES_DATA` 物件的內容不同（`soulColorHex`／`panelBg`／`heroImage`／文案）。

### 頁面結構

```
SiteHeader（固定頂部，64px）

Section：左右分割主畫面（grid-template-columns: 1fr 1fr, paddingTop 64px）
├── 左：文字面板（minHeight: calc(100vh - 64px)，background: panelBg 淺色調）
│    ├── Block 1  左側邊線(3px solid soulColorHex)
│    │            overline: meaningLabel（11px，soulColorHex，tracking 0.2em）
│    │            H1: seriesName（Noto Serif TC，clamp 28–48px，ink-primary）
│    │            tagline（Noto Serif TC，clamp 13–16px，ink-secondary）
│    │
│    ├── Block 2  blockquote: familyVoice
│    │            Noto Serif TC，clamp 14–17px，ink-primary，lineHeight 2.1，pre-line
│    │
│    ├── Block 3  PRODUCT INFO 卡片
│    │            bg: hexToRgba(soulColorHex, 0.08)
│    │            border: 1px solid hexToRgba(soulColorHex, 0.18)
│    │            overline: "PRODUCT INFO"（10px，soulColorHex，tracking 0.22em）
│    │            InfoRow × 4（grid: 72px + 1fr，label: ink-secondary／value: ink-primary）：
│    │              食材 → ingredients.join('、')
│    │              份量 → servingSize
│    │              怎麼喝 → howToDrink
│    │              口感 → tastingNote
│    │            [SGS 營養標示：comment 佔位，資料到位前不出現任何版面結構]
│    │
│    ├── Block 4  terroir
│    │            Noto Serif TC，clamp 13–15px，ink-secondary，lineHeight 2.1，pre-line
│    │
│    └── Block 5  tripleGoodNote
│                 12px，ink-secondary，borderTop 1px solid hexToRgba(soulColorHex, 0.2)
│
└── 右：圖片面板（minHeight: calc(100vh - 64px)，backgroundImage: heroImage，backgroundSize: cover）
     真實產品圖，存於 public/images/series/*.png

Series Nav（max-width 1200px，padding 80px 40px）
  ← prevSeries.label（null 時顯示「← 回到植萃系列」）
                                     nextSeries.label →

SiteFooter

Mobile（<768px）：grid-template-columns 改單欄，圖片面板 order:-1（圖在上）、minHeight 50vh；文字面板 minHeight auto
```

### FadeUp Stagger

| Block | delay |
|---|---|
| Block 1（標題區） | 0ms |
| Block 2（blockquote） | 200ms |
| Block 3（PRODUCT INFO） | 400ms |
| Block 4（terroir） | 600ms |
| Block 5（三好短句） | 800ms |

---

## 九、六色 SERIES_DATA 完整內容

### 1. 雪山植萃（/series/snow-mountain）

```
soulColorHex: #E9ECEB（無界白）
meaningLabel: 智慧的雪白
seriesName:   雪山植萃
tagline:      傳承的責任

familyVoice:
  希望有一天能把自己這一輩子學到的東西，
  完整的分享給我的孩子……
  如果腦袋不行了，很多愛就成為負擔了。

ingredients:  山藥、老薑、豆薯、紅棗、生核桃、蘋果
servingSize:  每份 285g
howToDrink:   建議清晨空腹或餐前 30 分鐘，溫熱飲用，不加糖風味最純淨。
tastingNote:  口感絲滑，帶有銀耳的天然膠質感，薑香若有似無，尾韻溫暖而不辛辣。

terroir:
  山藥在台灣高山冷涼的砂質土壤裡需要整整一年才能長成，老薑曬乾後香氣更集中——
  兩者放在一起，是這個系列「慢慢來才有的溫潤」的最直接說明。
  生核桃的油脂豐潤在尾韻緩緩展開，讓整杯喝來有溫度，也有份量。

tripleGoodNote: 好吸收，是因為原料本身就是身體熟悉的語言。

prevSeries: null（顯示「← 回到植萃系列」）
nextSeries: 青檸植萃 → /series/lime-green
```

### 2. 青檸植萃（/series/lime-green）

```
soulColorHex: #4F7A5C（山林綠）
meaningLabel: 清爽的沁綠
seriesName:   青檸植萃
tagline:      能吃就是福，吃的下才可以活得好

familyVoice:
  人如果吃不了、吸收不了，
  後面很多事情都不用談了。

ingredients:  地瓜葉、青江菜、櫛瓜、節瓜、黑木耳、芭樂、檸檬
servingSize:  每份 285g
howToDrink:   建議早晨或午餐前飲用，冰涼或常溫皆宜，清爽風味在夏日尤其自然。
tastingNote:  口感滑順帶有黑木耳天然的膠質感，前段有檸檬的輕盈酸香，尾韻清甜乾淨，不留膩感。

terroir:
  地瓜葉、青江菜、櫛瓜——三種台灣田間最日常的蔬菜，清晨現採，本味清甜，
  帶著剛離土才有的那種草木氣息。
  芭樂與檸檬是這個系列風味的核心，一個清甜圓潤，一個明亮酸香，兩者相遇像是
  台灣夏日早晨的氣味，熟悉而讓人精神一振——黑木耳帶來的那一點膠質滑潤，
  讓這份清爽多了些份量，喝完不覺空。

tripleGoodNote: 好喝，是因為日常的食材本來就不需要理由。

prevSeries: 雪山植萃 ← /series/snow-mountain
nextSeries: 玫瑰植萃 → /series/rose-red
```

### 3. 玫瑰植萃（/series/rose-red）

```
soulColorHex: #C2272D（烈血紅）
meaningLabel: 鮮豔的紅
seriesName:   玫瑰植萃
tagline:      愛美不只是想抓住年輕的尾巴

familyVoice:
  年輕的時候愛美是為了幸福，
  當了媽媽以後的愛美是想讓家庭幸福，
  去班親會時讓兒子帥一把。

ingredients:  甜菜根、紫甘藍、銀耳、紅棗、芭樂、百香果、檸檬、玫瑰花瓣
servingSize:  每份 285g
howToDrink:   建議早晨或下午飲用，常溫或微涼皆宜，花香在室溫下更為舒展。
tastingNote:  入口有玫瑰花瓣的淡雅香氣，甜菜根帶來自然的甜潤，百香果的酸香在尾段收尾，層次清晰不複雜。

terroir:
  玫瑰花瓣在清晨採摘時香氣最完整，那份若有若無的花香是這個系列最難忘的第一印象。
  甜菜根的飽滿色澤與百香果的熱帶酸香在其後展開，一個沉穩，一個明亮——
  玫瑰的香氣在尾韻中再度浮現，縈繞而不膩。

tripleGoodNote: 好看，從裡到外都算數。

prevSeries: 青檸植萃 ← /series/lime-green
nextSeries: 桂香植萃 → /series/cinnamon-gold
```

### 4. 桂香植萃（/series/cinnamon-gold）

```
soulColorHex: #D9A02E（傲嬌黃）
meaningLabel: 保暖的黃
seriesName:   桂香植萃
tagline:      力量是為了守護家人

familyVoice:
  我希望未來陪老婆出門時，
  還能穿著吊嘎，
  用二頭肌幫她扛大包小包。

ingredients:  甜玉米、紅蘿蔔、黃甜椒、百香果、豆薯、香蕉、薑黃、桂花精釀液、南杏片
servingSize:  每份 285g
howToDrink:   建議早晨或運動前後飲用，常溫最能釋放桂花香氣，溫熱飲用暖意更顯。
tastingNote:  入口甜潤，帶有玉米的自然甜感與桂花的淡雅花香，薑黃的溫暖在喉嚨落下，尾韻綿長。

terroir:
  桂花香氣細緻而深遠，是整個系列最先被聞見、也最後留在記憶裡的那一層。
  薑黃的金黃色澤讓這杯飲品從顏色開始就有了主張，甜玉米的飽滿甜潤在其中托底——
  三者的氣味與色溫疊在一起，像台灣秋收時節的田野，暖而有份量。

tripleGoodNote: 好喝，是因為想繼續有力氣，陪在重要的人身邊。

prevSeries: 玫瑰植萃 ← /series/rose-red
nextSeries: 紫莓植萃 → /series/berry-purple
```

### 5. 紫莓植萃（/series/berry-purple）

```
soulColorHex: #9B6FC4（水晶紫）
meaningLabel: 明亮的透
seriesName:   紫莓植萃
tagline:      看見最平凡的美麗，家人的笑容

familyVoice:
  想看見，想一直看見家人，
  因為那是最美好的每一刻。

ingredients:  木鱉果外種皮、紫薯、紅蘿蔔、桑椹、藍莓、紫色高麗菜、芭樂、檸檬、海鹽
servingSize:  每份 285g
howToDrink:   建議早晨或傍晚飲用，冰涼或常溫皆宜，色澤在自然光下尤其美麗。
tastingNote:  入口有藍莓與桑椹的濃郁果感，酸甜層次清晰，尾段帶有芭樂的清甜，海鹽輕輕提味，整體圓潤而不膩。

terroir:
  藍莓與桑椹是這個系列最直接的語言——深紫的色澤、濃縮的果香，
  兩者疊在一起，是入口前就先被看見的那種美麗。
  木鱉果的橙紅在其中托出另一層溫度，讓整杯飲品的色彩不只停在紫，而是有了深度——
  像黃昏時天色從藍轉橙的那個過渡，短暫而難以複製。

tripleGoodNote: 好看，是因為值得被珍惜的事物本來就應該被看見。

prevSeries: 桂香植萃 ← /series/cinnamon-gold
nextSeries: 鉑金植萃 → /series/platinum
```

### 6. 鉑金植萃（/series/platinum）

```
soulColorHex: #E0D5BD（米白）
meaningLabel: 平衡的米白
seriesName:   鉑金植萃
tagline:      有底氣才有精氣，有精氣才能神氣

familyVoice:
  多年商場的座右銘，
  要先立於不敗之地，
  而不敗之地就是健康，
  只有健康了，才能向上前進。

ingredients:  大黃豆、大薏仁、南杏片
servingSize:  每份 285g
howToDrink:   每天早晨飲用，一年四季皆宜，溫熱飲用最能呈現豆香與杏仁的溫潤底韻。
tastingNote:  口感綿密滑順，豆香自然醇厚，南杏帶來輕盈的堅果香氣，尾韻溫和不搶戲，適合每天喝、不膩。

terroir:
  大黃豆、大薏仁、南杏片，三種台灣餐桌上熟悉的食材，不需要解釋，也不需要說服——
  它們本來就在那裡，慢慢泡、慢慢蒸，時間做的事，多說反而多餘。

tripleGoodNote: 好喝，是因為每天都願意喝，才算數。

prevSeries: 紫莓植萃 ← /series/berry-purple
nextSeries: null（不顯示下一系列）
```

---

## 十、動畫規格

### SCROLL 指示器 bob

```css
@keyframes bob {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(6px); }
}
/* animation: bob 2s ease-in-out infinite */
```

### 按鈕 hover

```css
transition: transform 250ms ease;
:hover { transform: translateY(-1px); }
/* 僅上移，不彈跳、不放大、不變色 */
```

### Pill 按鈕規格

```css
border-radius: 999px;
padding: 14px 32px;
min-height: 48px;
font-size: 13px;
font-weight: 500;
letter-spacing: 0.14em;
```

---

## 十一、圖片佔位說明

六色系列頁已於 2026-07-02 套入真實產品圖（見下表），來源為 Claude Design 視覺稿匯出。首頁與理念頁 hero 背景仍為 CSS 漸層佔位，待 Bryan 使用 Adobe Firefly 生成後替換 backgroundImage。

| 頁面 | 圖片路徑 | 狀態 |
|---|---|---|
| IdeologyPage | `/images/ideology-hero.jpg` | ⏳ 待生成（仍為漸層佔位） |
| HomePage（Hero/六色入口/信念主張） | 無固定路徑，見 HomePage.jsx 內 TODO 註解 | ⏳ 待生成（仍為漸層佔位） |
| SnowMountainPage | `/images/series/snow-mountain.png` | ✅ 已套入真實產品圖 |
| LimeGreenPage | `/images/series/lime-green.png` | ✅ 已套入真實產品圖 |
| RosePage | `/images/series/rose-red.png` | ✅ 已套入真實產品圖 |
| CinnamonPage | `/images/series/cinnamon-gold.png` | ✅ 已套入真實產品圖 |
| PurpleBerryPage | `/images/series/berry-purple.png` | ⚠️ 已套入，但瓶身英文標示錯誤（誤植「OSMANTHUS BOTANICAL ESSENCE」，應為桂香植萃專用），需重新生成 |
| PlatinumPage | `/images/series/platinum.png` | ✅ 已套入真實產品圖 |

**人物限制（全站）：** 僅允許遠景渺小身影或手部局部，禁止完整人臉。

---

## 十二、給 Claude Design 的設計產出規格

設計稿以 HTML 靜態頁面輸出，路徑放入：

```
ui_kits/website/
├── series-snow.html      雪山植萃（範本，其他五色從此延伸）
├── series-lime.html
├── series-rose.html
├── series-cinnamon.html
├── series-berry.html
├── series-platinum.html
├── ideology.html
└── contact.html
```

Claude Code 收到後：
1. 以 `series-snow.html` 為基準，套入 `SnowMountainPage.jsx`
2. 確認視覺後，批次套用其他五色
3. 套入 `IdeologyPage.jsx` 與 `ContactPage.jsx`
4. build 通過 + 截圖確認後 commit

**不修改任何文字內容與 Section 結構，只套視覺。**
