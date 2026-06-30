/**
 * 紫莓植萃頁面 — 複製自 SnowMountainPage.jsx
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
  soulColor: 'var(--soul-amethyst)',   /* 水晶紫 #9B6FC4 */
  soulColorHex: '#9B6FC4',
  seriesName: '紫莓植萃',
  soulColorName: '水晶紫',
  meaningLabel: '明亮的透',
  tagline: '看見最平凡的美麗，家人的笑容',
  familyVoice: `想看見，想一直看見家人，
因為那是最美好的每一刻。`,
  ingredients: ['木鱉果外種皮', '紫薯', '紅蘿蔔', '桑椹', '藍莓', '紫色高麗菜', '芭樂', '檸檬', '海鹽'],
  servingSize: '每份 285g',
  howToDrink: '建議早晨或傍晚飲用，冰涼或常溫皆宜，色澤在自然光下尤其美麗。',
  tastingNote: '入口有藍莓與桑椹的濃郁果感，酸甜層次清晰，尾段帶有芭樂的清甜，海鹽輕輕提味，整體圓潤而不膩。',
  terroir: `藍莓與桑椹是這個系列最直接的語言——深紫的色澤、濃縮的果香，兩者疊在一起，是入口前就先被看見的那種美麗。
木鱉果的橙紅在其中托出另一層溫度，讓整杯飲品的色彩不只停在紫，而是有了深度——像黃昏時天色從藍轉橙的那個過渡，短暫而難以複製。`,
  tripleGoodNote: '好看，是因為值得被珍惜的事物本來就應該被看見。',
  prevSeries: { label: '桂香植萃', href: '/series/cinnamon' },
  nextSeries: { label: '鉑金植萃', href: '/series/platinum' },
}
/* ─── END 系列內容 ─── */


export default function PurpleBerryPage() {
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
          題材：果園或山林間的清澄天光，淡紫光暈穿透雲層或樹梢，明亮而透徹
          人物：僅限家庭一起欣賞風景的背影畫面，禁止完整人臉，避免擺拍感
          比例：16:9 或更高，桌面至少 1440×900，mobile 建議 portrait crop
          路徑：替換時修改下方 backgroundImage
        */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            /* 暫用漸層佔位，替換成圖片時改為：
               backgroundImage: 'url(/images/purple-berry-hero.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            */
            background: `
              linear-gradient(
                160deg,
                ${soulColorHex}cc 0%,
                #7a4fa8 40%,
                #4a2070 100%
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
