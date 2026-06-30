import { useEffect, useRef } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const CONTACT_EMAIL = 'lyra@phytologic.tw'

function useFadeUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function FadeUp({ delay = 0, children, style = {} }) {
  const ref = useFadeUp()
  return (
    <div
      ref={ref}
      className="fade-up"
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />

      <main
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: 'calc(64px + 80px) 40px 120px',
        }}
      >
        {/* 段落一：合作精神說明 */}
        <FadeUp delay={0} style={{ marginBottom: '64px' }}>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--ink-secondary)',
              letterSpacing: '0.22em',
              marginBottom: '32px',
              fontWeight: 500,
            }}
          >
            COLLABORATION
          </p>
          <h1
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              lineHeight: 1.4,
              letterSpacing: '0.06em',
              marginBottom: '32px',
            }}
          >
            與對的人，<br />做對的事
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: '2.2',
              letterSpacing: '0.06em',
            }}
          >
            我們相信，真正有意義的合作建立在共同的價值觀上。
            植本邏輯的每一個決策，從食材來源到品牌呈現，
            都遵循「好吸收、好喝、好看」的原則——
            這不只是產品標準，也是我們選擇合作夥伴的標準。
          </p>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-secondary)',
              lineHeight: '2.2',
              letterSpacing: '0.06em',
              marginTop: '20px',
            }}
          >
            無論是通路合作、異業結合、內容共創，
            或是對品牌理念有共鳴的媒體與創作者，
            都歡迎寫信給我們。
          </p>
        </FadeUp>

        {/* 段落二：CTA 按鈕 */}
        <FadeUp delay={200}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--forest, #243A33)',
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
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            了解合作方式與詳情
          </a>
          <p
            style={{
              marginTop: '16px',
              fontSize: '12px',
              color: 'var(--ink-secondary)',
              letterSpacing: '0.08em',
              opacity: 0.7,
            }}
          >
            {CONTACT_EMAIL}
          </p>
        </FadeUp>
      </main>

      <SiteFooter />
    </div>
  )
}
