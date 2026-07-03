/**
 * 青檸植萃頁面 — 複製自 SnowMountainPage.jsx
 *
 * 複製時只需修改以下區塊：
 *   1. SERIES_DATA 物件（系列名稱、色票、文案、圖片路徑）
 *
 * 結構與動畫邏輯不需要修改。
 */

import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import { FadeUp } from '../../components/FadeUp'

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const SERIES_DATA = {
  soulColorHex: '#4F7A5C',
  panelBg: '#EDF4F0',
  heroImage: '/images/series/lime-green.png',
  seriesName: '青檸植萃',
  meaningLabel: '清爽的沁綠',
  tagline: '外食族的日常平衡，清爽的體內環保。',
  familyVoice: `忙碌的日子裡，身體最先失去的，往往是蔬果的份量。
青檸植萃以深綠色蔬菜、芭樂與香水檸檬為核心，前味清新明亮，中段自然果香，尾韻柔順輕盈。
不是在補救，而是每天給自己一杯植物的清醒。`,
  ingredients: ['地瓜葉', '青江菜', '櫛瓜', '節瓜', '黑木耳', '芭樂', '檸檬'],
  servingSize: '每份 285g',
  howToDrink: '建議早晨或午餐前飲用，冰涼或常溫皆宜，清爽風味在夏日尤其自然。',
  tastingNote: '口感滑順帶有黑木耳天然的膠質感，前段有檸檬的輕盈酸香，尾韻清甜乾淨，不留膩感。',
  terroir: `地瓜葉、青江菜、櫛瓜——三種台灣田間最日常的蔬菜，清晨現採，本味清甜，帶著剛離土才有的那種草木氣息。
芭樂與檸檬是這個系列風味的核心，一個清甜圓潤，一個明亮酸香，兩者相遇像是台灣夏日早晨的氣味，熟悉而讓人精神一振——黑木耳帶來的那一點膠質滑潤，讓這份清爽多了些份量，喝完不覺空。`,
  tripleGoodNote: '好喝，是因為日常的食材本來就不需要理由。',
  prevSeries: { label: '雪山植萃', href: '/series/snow-mountain' },
  nextSeries: { label: '玫瑰植萃', href: '/series/rose-red' },
}


export default function LimeGreenPage() {
  const {
    soulColorHex,
    panelBg,
    heroImage,
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

  const tintBg = hexToRgba(soulColorHex, 0.08)
  const tintBorder = hexToRgba(soulColorHex, 0.18)
  const tintBorderSubtle = hexToRgba(soulColorHex, 0.2)

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ── 左右分割主畫面 ── */}
      <section
        className="series-split"
        style={{
          paddingTop: '64px', /* Header 高度 */
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* 左：文字面板 */}
        <div
          className="series-text-panel"
          style={{
            background: panelBg,
            minHeight: 'calc(100vh - 64px)',
            padding: 'clamp(48px, 8vw, 96px) clamp(32px, 5vw, 72px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Block 1：系列名稱 + 核心句 */}
          <FadeUp delay={0} style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-block',
                borderLeft: `3px solid ${soulColorHex}`,
                paddingLeft: '16px',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: soulColorHex,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}
              >
                {meaningLabel}
              </p>
              <h1
                style={{
                  fontFamily: 'Noto Serif TC, serif',
                  fontSize: 'clamp(28px, 3.5vw, 48px)',
                  fontWeight: 600,
                  color: 'var(--ink-primary)',
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
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  color: 'var(--ink-secondary)',
                  letterSpacing: '0.1em',
                }}
              >
                {tagline}
              </p>
            </div>
          </FadeUp>

          {/* Block 2：家庭心聲 */}
          <FadeUp delay={200} style={{ marginBottom: '32px' }}>
            <blockquote
              style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 'clamp(14px, 1.4vw, 17px)',
                color: 'var(--ink-primary)',
                lineHeight: '2.1',
                letterSpacing: '0.06em',
                whiteSpace: 'pre-line',
                margin: 0,
                padding: 0,
                border: 'none',
              }}
            >
              {familyVoice}
            </blockquote>
          </FadeUp>

          {/* Block 3：產品資訊區 */}
          <FadeUp delay={400} style={{ marginBottom: '32px' }}>
            <div
              style={{
                backgroundColor: tintBg,
                borderRadius: '2px',
                padding: '28px',
                border: `1px solid ${tintBorder}`,
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: soulColorHex,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
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
          <FadeUp delay={600} style={{ marginBottom: '32px' }}>
            <p
              style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: 'clamp(13px, 1.4vw, 15px)',
                color: 'var(--ink-secondary)',
                lineHeight: '2.1',
                letterSpacing: '0.06em',
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
                color: 'var(--ink-secondary)',
                letterSpacing: '0.12em',
                borderTop: `1px solid ${tintBorderSubtle}`,
                paddingTop: '20px',
              }}
            >
              {tripleGoodNote}
            </p>
          </FadeUp>
        </div>

        {/* 右：圖片面板 */}
        <div
          className="series-image-panel"
          aria-hidden="true"
          style={{
            minHeight: 'calc(100vh - 64px)',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
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
        @media (max-width: 768px) {
          .series-split { grid-template-columns: 1fr !important; }
          .series-image-panel { min-height: 50vh !important; order: -1; }
          .series-text-panel { min-height: auto !important; padding: 48px 24px !important; }
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
          color: 'var(--ink-secondary)',
          letterSpacing: '0.12em',
          paddingTop: '2px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--ink-primary)',
          lineHeight: '1.7',
          letterSpacing: '0.04em',
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
