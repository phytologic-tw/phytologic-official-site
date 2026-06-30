/**
 * 桂香植萃頁面 — 複製自 SnowMountainPage.jsx
 *
 * 複製時只需修改以下區塊：
 *   1. SERIES_DATA 物件（系列名稱、色票、文案）
 *   2. 背景佔位色（seriesColor 的淺色版本）
 *   3. 圖片路徑（TODO 區段）
 *
 * 結構與動畫邏輯不需要修改。
 */

import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import { FadeUp } from '../../components/FadeUp'

/* ─── 系列內容（複製時替換此物件）─── */
const SERIES_DATA = {
  soulColor: 'var(--soul-yellow)',     /* 傲嬌黃 #D9A02E */
  soulColorHex: '#D9A02E',
  seriesName: '桂香植萃',
  soulColorName: '傲嬌黃',
  meaningLabel: '保暖的黃',
  tagline: '力量是為了守護家人',
  familyVoice: `我希望未來陪老婆出門時，
還能穿著吊嘎，
用二頭肌幫她扛大包小包。`,
  ingredients: ['甜玉米', '紅蘿蔔', '黃甜椒', '百香果', '豆薯', '香蕉', '薑黃', '桂花精釀液', '南杏片'],
  servingSize: '每份 285g',
  howToDrink: '建議早晨或運動前後飲用，常溫最能釋放桂花香氣，溫熱飲用暖意更顯。',
  tastingNote: '入口甜潤，帶有玉米的自然甜感與桂花的淡雅花香，薑黃的溫暖在喉嚨落下，尾韻綿長。',
  terroir: `桂花香氣細緻而深遠，是整個系列最先被聞見、也最後留在記憶裡的那一層。
薑黃的金黃色澤讓這杯飲品從顏色開始就有了主張，甜玉米的飽滿甜潤在其中托底——三者的氣味與色溫疊在一起，像台灣秋收時節的田野，暖而有份量。`,
  tripleGoodNote: '好喝，是因為想繼續有力氣，陪在重要的人身邊。',
  prevSeries: { label: '玫瑰植萃', href: '/series/rose' },
  nextSeries: { label: '紫莓植萃', href: '/series/purple-berry' },
}
/* ─── END 系列內容 ─── */


export default function CinnamonPage() {
  const {
    soulColor,
    soulColorHex,
    seriesName,
    meaningLabel,
    tagline,
    familyVoice,
    ingredients,
    servingSize,
    howToDrink,
    tastingNote,
    terroir,
    tripleGoodNote,
    nextSeries,
    prevSeries,
  } = SERIES_DATA

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ── 滿版主畫面 ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '64px', /* Header 高度 */
        }}
      >
        {/*
          TODO: 圖片替換區
          規格：AI 生成（Adobe Firefly）
          題材：金黃稻田或玉米田，正午到黃昏的飽滿陽光，大地豐收感
          人物：僅限夫妻同行於田埂的逆光剪影或局部肢體互動畫面，禁止完整人臉
          比例：16:9 或更高，桌面至少 1440×900，mobile 建議 portrait crop
          路徑：替換時修改下方 backgroundImage
        */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            /* 暫用漸層佔位，替換成圖片時改為：
               backgroundImage: 'url(/images/cinnamon-hero.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            */
            background: `
              linear-gradient(
                160deg,
                ${soulColorHex}cc 0%,
                #c4882a 40%,
                #8a5c10 100%
              )
            `,
          }}
        />

        {/* 深色疊層，確保文字對比 */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.52) 100%)',
          }}
        />

        {/* 文字內容層 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '680px',
            width: '100%',
            padding: '0 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {/* Block 1：系列名稱 + 核心句 */}
          <FadeUp delay={0}>
            <div
              style={{
                display: 'inline-block',
                borderLeft: `3px solid ${soulColorHex}`,
                paddingLeft: '16px',
                marginBottom: '40px',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: soulColorHex,
                  letterSpacing: '0.2em',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}
              >
                {meaningLabel}
              </p>
              <h1
                style={{
                  fontFamily: 'Noto Serif TC, serif',
                  fontSize: 'clamp(28px, 5vw, 44px)',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.3,
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}
              >
                {seriesName}
              </h1>
              <p
                style={{
                  fontFamily: 'Noto Serif TC, serif',
                  fontSize: 'clamp(14px, 2vw, 17px)',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.14em',
                }}
              >
                {tagline}
              </p>
            </div>
          </FadeUp>

          {/* Block 2：家庭心聲 */}
          <FadeUp delay={200} style={{ marginBottom: '48px' }}>
            <blockquote
              style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 'clamp(15px, 2.2vw, 18px)',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '2',
                letterSpacing: '0.06em',
                borderLeft: 'none',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {familyVoice}
            </blockquote>
          </FadeUp>

          {/* Block 3：產品資訊區 */}
          <FadeUp delay={400} style={{ marginBottom: '48px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(8px)',
                borderRadius: '2px',
                padding: '28px 32px',
                border: `1px solid rgba(255,255,255,0.2)`,
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: soulColorHex,
                  letterSpacing: '0.22em',
                  marginBottom: '20px',
                  fontWeight: 500,
                }}
              >
                PRODUCT INFO
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <InfoRow label="食材" value={ingredients.join('、')} />
                <InfoRow label="份量" value={servingSize} />
                <InfoRow label="怎麼喝" value={howToDrink} />
                <InfoRow label="口感" value={tastingNote} />
              </div>

              {/*
                SGS 八大營養標示區塊：
                待 Bryan 上傳實際 SGS 檢驗文件後，以 Spec Patch 方式加入。
                在取得真實數據前，此欄位完全不呈現（含標題與版面結構）。
              */}
            </div>
          </FadeUp>

          {/* Block 4：風土語言 */}
          <FadeUp delay={600} style={{ marginBottom: '40px' }}>
            <p
              style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: '2.2',
                letterSpacing: '0.08em',
                whiteSpace: 'pre-line',
              }}
            >
              {terroir}
            </p>
          </FadeUp>

          {/* Block 5：三好三無呼應 */}
          <FadeUp delay={800}>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.12em',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '20px',
              }}
            >
              {tripleGoodNote}
            </p>
          </FadeUp>
        </div>

        {/* 向下滾動提示 */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.5,
            animation: 'bob 2s ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <span style={{ fontSize: '11px', color: '#fff', letterSpacing: '0.15em' }}>
            SCROLL
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0v20M1 13l7 7 7-7" stroke="#fff" strokeWidth="1.2" />
          </svg>
        </div>
      </section>

      {/* ── 系列切換頁尾導引 ── */}
      <nav
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          padding: '80px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {prevSeries ? (
          <a href={prevSeries.href} style={seriesNavStyle}>
            ← {prevSeries.label}
          </a>
        ) : (
          <a href="/series" style={seriesNavStyle}>
            ← 回到植萃系列
          </a>
        )}

        {nextSeries && (
          <a href={nextSeries.href} style={seriesNavStyle}>
            {nextSeries.label} →
          </a>
        )}
      </nav>

      <SiteFooter />

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        @media (max-width: 768px) {
          section > div[style] {
            padding: 0 20px !important;
          }
        }
      `}</style>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: '12px' }}>
      <span
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.12em',
          paddingTop: '2px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.88)',
          lineHeight: '1.7',
          letterSpacing: '0.06em',
        }}
      >
        {value}
      </span>
    </div>
  )
}

const seriesNavStyle = {
  fontSize: '13px',
  color: 'var(--ink-secondary)',
  letterSpacing: '0.1em',
  textDecoration: 'none',
  transition: 'color 250ms ease',
}
