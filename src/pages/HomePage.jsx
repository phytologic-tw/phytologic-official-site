/**
 * 首頁 — V2 §4 首頁結構規範
 * Section 1 Hero / Section 2 六大植萃系列入口 / Section 3 三好三無 / Section 4 信念主張 / Section 5 導流CTA
 */

import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { FadeUp } from '../components/FadeUp'

const LINE_OA_URL = 'https://line.me/R/ti/p/@248xuoic'

/* Hero 輪播圖＋逐張標語 — 2026-07-03 Bryan 確認採用（品牌規範「禁輪播」之例外，見 PROJECT_STATUS.md） */
const HERO_SLIDES = [
  { src: '/images/home-hero-mountain.png', text: '從植物裡萃取自然的邏輯，從邏輯中找到幸福的規律。' },
  { src: '/images/home-hero-greenhouse.png', text: '從第一株幼苗開始，每一份植本都有它的來源。' },
  { src: '/images/home-hero-forest.png', text: '讓植物的光合作用，成為你身體每一天的日常。' },
  { src: '/images/home-hero-field.png', text: '晨光裡的每一片田野，就是植本的邏輯配方。' },
]
const HERO_INTERVAL_MS = 6000

/* ─── 六色系列入口資料（核心句取自各系列故事頁）─── */
const SERIES_ENTRIES = [
  { soulColorHex: '#E9ECEB', isLight: true, meaningLabel: '智慧的雪白', seriesName: '雪山植萃', tagline: '傳承的責任', href: '/series/snow-mountain' },
  { soulColorHex: '#4F7A5C', isLight: false, meaningLabel: '清爽的沁綠', seriesName: '青檸植萃', tagline: '能吃就是福，吃的下才可以活得好', href: '/series/lime-green' },
  { soulColorHex: '#C2272D', isLight: false, meaningLabel: '鮮豔的紅', seriesName: '玫瑰植萃', tagline: '愛美不只是想抓住年輕的尾巴', href: '/series/rose-red' },
  { soulColorHex: '#D9A02E', isLight: false, meaningLabel: '保暖的黃', seriesName: '桂香植萃', tagline: '力量是為了守護家人', href: '/series/cinnamon-gold' },
  { soulColorHex: '#9B6FC4', isLight: false, meaningLabel: '明亮的透', seriesName: '紫莓植萃', tagline: '看見最平凡的美麗，家人的笑容', href: '/series/berry-purple' },
  { soulColorHex: '#E0D5BD', isLight: true, meaningLabel: '平衡的米白', seriesName: '鉑金植萃', tagline: '有底氣才有精氣，有精氣才能神氣', href: '/series/platinum' },
]

/* 瓶身線稿圖示 — 取自 Claude Design 視覺稿（_export/pages/index.html ColorCard 元件） */
function BottleIcon({ stroke }) {
  return (
    <svg viewBox="0 0 100 210" width="46%" height="72%" fill="none" style={{ color: stroke }} className="series-entry-icon">
      <rect x="37" y="2" width="26" height="5" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="33" y="7" width="34" height="17" rx="3" stroke="currentColor" strokeWidth="1.2" />
      <line x1="33" y1="19" x2="67" y2="19" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" />
      <rect x="40" y="24" width="20" height="13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M40 37 C38 40 24 44 22 52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M60 37 C62 40 76 44 78 52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="22" y="52" width="56" height="148" rx="4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="28" y="78" width="44" height="90" rx="2" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="50" cy="96" r="7" stroke="currentColor" strokeWidth="0.9" />
      <line x1="34" y1="110" x2="66" y2="110" stroke="currentColor" strokeWidth="0.7" />
      <line x1="36" y1="148" x2="64" y2="148" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" />
      <line x1="26" y1="196" x2="74" y2="196" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  )
}

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_SLIDES.length)
    }, HERO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ── Section 1：Hero ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          paddingTop: '64px',
        }}
      >
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === heroIndex ? 1 : 0,
              transition: 'opacity 1800ms ease',
              animation: i === heroIndex ? 'kenburns 24s ease-in-out infinite alternate' : 'none',
            }}
          />
        ))}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.08) 55%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '820px',
            width: '100%',
            padding: '0 32px',
            textAlign: 'center',
          }}
        >
          <p
            key={heroIndex}
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(22px, 4vw, 38px)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.6,
              letterSpacing: '0.08em',
              animation: 'heroTextFade 1800ms ease',
            }}
          >
            {HERO_SLIDES[heroIndex].text}
          </p>
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
          <span style={{ fontSize: '11px', color: '#fff', letterSpacing: '0.15em' }}>SCROLL</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0v20M1 13l7 7 7-7" stroke="#fff" strokeWidth="1.2" />
          </svg>
        </div>
      </section>

      {/* ── Section 2：六大植萃系列入口 ── */}
      <section
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          padding: '120px 40px',
        }}
      >
        <FadeUp delay={0} style={{ marginBottom: '56px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--ink-secondary)',
              letterSpacing: '0.22em',
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            SIX SOUL COLORS
          </p>
          <h2
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              letterSpacing: '0.06em',
            }}
          >
            六色植萃
          </h2>
        </FadeUp>

        <div
          className="series-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
          }}
        >
          {SERIES_ENTRIES.map((entry, i) => (
            <FadeUp key={entry.href} delay={i * 100}>
              <a
                href={entry.href}
                style={{
                  position: 'relative',
                  display: 'block',
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                  textDecoration: 'none',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: entry.soulColorHex,
                    transition: 'transform 600ms ease',
                  }}
                  className="series-entry-bg"
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BottleIcon stroke={entry.isLight ? 'rgba(42,40,38,0.3)' : 'rgba(247,245,240,0.6)'} />
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '20px',
                    right: '20px',
                    bottom: '20px',
                    borderLeft: `2px solid ${entry.soulColorHex}`,
                    paddingLeft: '12px',
                  }}
                >
                  <p style={{ fontSize: '10px', color: entry.soulColorHex, letterSpacing: '0.18em', marginBottom: '6px', fontWeight: 500 }}>
                    {entry.meaningLabel}
                  </p>
                  <p style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '18px', color: '#fff', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    {entry.seriesName}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', letterSpacing: '0.04em' }}>
                    {entry.tagline}
                  </p>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Section 3：三好三無 ── */}
      <section
        style={{
          backgroundColor: 'var(--ink-primary)',
          padding: '120px 40px',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--max-content-width)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '64px',
          }}
        >
          <FadeUp delay={0}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.22em', marginBottom: '24px', fontWeight: 500 }}>
              THREE GOODS
            </p>
            <h3 style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '0.08em', marginBottom: '20px' }}>
              三好
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['好喝', '好看', '好吸收'].map(label => (
                <p key={label} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
                  {label}
                </p>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={200}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.22em', marginBottom: '24px', fontWeight: 500 }}>
              THREE NONES
            </p>
            <h3 style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '0.08em', marginBottom: '20px' }}>
              三無
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['無人工', '無化學', '無合成'].map(label => (
                <p key={label} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px' }}>
                  {label}
                </p>
              ))}
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={300} style={{ maxWidth: 'var(--max-content-width)', margin: '48px auto 0', textAlign: 'center' }}>
          <a
            href="/ideology"
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '2px' }}
          >
            深入了解理念 →
          </a>
        </FadeUp>
      </section>

      {/* ── Section 4：信念主張 ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '80px 40px',
        }}
      >
        {/*
          TODO: 圖片替換區
          規格：極簡自然光景中牽手背影剪影，避免清晰人臉與擺拍感
          路徑：替換時修改下方 backgroundImage
        */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(200deg, #eae6dd 0%, #cfcabd 100%)',
          }}
        />
        <FadeUp delay={0} style={{ position: 'relative', zIndex: 1, maxWidth: '760px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(20px, 3.4vw, 32px)',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              lineHeight: 1.8,
              letterSpacing: '0.06em',
            }}
          >
            當你愛的人還在時，你也能好好地在、能陪伴、能擁抱……
          </p>
        </FadeUp>
      </section>

      {/* ── Section 5：導流 CTA ── */}
      <section
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          padding: '80px 40px 140px',
          textAlign: 'center',
        }}
      >
        <FadeUp delay={0}>
          <p
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(16px, 2.4vw, 20px)',
              color: 'var(--ink-primary)',
              letterSpacing: '0.06em',
              marginBottom: '32px',
            }}
          >
            想更了解植本邏輯，從這裡開始
          </p>
          <a
            href={LINE_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={ctaStyle}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            加入 LINE 官方帳號
          </a>
        </FadeUp>
      </section>

      <SiteFooter />

      <style>{`
        @media (max-width: 768px) {
          .series-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        @keyframes heroTextFade {
          0% { opacity: 0; }
          25% { opacity: 1; }
          100% { opacity: 1; }
        }
        a:hover .series-entry-bg {
          transform: scale(1.04);
        }
        .series-entry-icon {
          transition: opacity 300ms ease;
        }
        a:hover .series-entry-icon {
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}

const ctaStyle = {
  display: 'inline-block',
  backgroundColor: 'var(--ink-primary)',
  color: '#ffffff',
  fontSize: '13px',
  letterSpacing: '0.14em',
  fontWeight: 500,
  padding: '14px 32px',
  borderRadius: '999px',
  textDecoration: 'none',
  minHeight: '48px',
  lineHeight: '20px',
  transition: 'transform 250ms ease',
}
