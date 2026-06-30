/**
 * 玫瑰植萃頁面 — 複製自 SnowMountainPage.jsx
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
  soulColor: 'var(--soul-red)',        /* 烈血紅 #C2272D */
  soulColorHex: '#C2272D',
  seriesName: '玫瑰植萃',
  soulColorName: '烈血紅',
  meaningLabel: '鮮豔的紅',
  tagline: '愛美不只是想抓住年輕的尾巴',
  familyVoice: `年輕的時候愛美是為了幸福，
當了媽媽以後的愛美是想讓家庭幸福，
去班親會時讓兒子帥一把。`,
  ingredients: ['甜菜根', '紫甘藍', '銀耳', '紅棗', '芭樂', '百香果', '檸檬', '玫瑰花瓣'],
  servingSize: '每份 285g',
  howToDrink: '建議早晨或下午飲用，常溫或微涼皆宜，花香在室溫下更為舒展。',
  tastingNote: '入口有玫瑰花瓣的淡雅香氣，甜菜根帶來自然的甜潤，百香果的酸香在尾段收尾，層次清晰不複雜。',
  terroir: `玫瑰花瓣在清晨採摘時香氣最完整，那份若有若無的花香是這個系列最難忘的第一印象。
甜菜根的飽滿色澤與百香果的熱帶酸香在其後展開，一個沉穩，一個明亮——玫瑰的香氣在尾韻中再度浮現，縈繞而不膩。`,
  tripleGoodNote: '好看，從裡到外都算數。',
  prevSeries: { label: '青檸植萃', href: '/series/green' },
  nextSeries: { label: '桂香植萃', href: '/series/cinnamon' },
}
/* ─── END 系列內容 ─── */


export default function RosePage() {
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
          題材：花田或果園的黃昏暖光，暖色調的柔和夕陽光影
          人物：僅限母親與孩子在戶外活動的逆光剪影或背影，禁止完整人臉
          比例：16:9 或更高，桌面至少 1440×900，mobile 建議 portrait crop
          路徑：替換時修改下方 backgroundImage
        */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            /* 暫用漸層佔位，替換成圖片時改為：
               backgroundImage: 'url(/images/rose-hero.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            */
            background: `
              linear-gradient(
                160deg,
                ${soulColorHex}99 0%,
                #a85a5a 40%,
                #6b2020 100%
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
