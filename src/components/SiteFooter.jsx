import { NAV_LINKS } from '../lib/navConfig'

export default function SiteFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-base)',
        borderTop: '1px solid var(--ink-secondary)',
        padding: '64px 40px 48px',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px 40px',
          alignItems: 'start',
        }}
        className="footer-grid"
      >
        {/* 左欄：Logo + 標語 */}
        <div>
          <p
            style={{
              fontFamily: 'Noto Serif TC, serif',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}
          >
            PHYTOLOGIC 植本邏輯
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--ink-secondary)',
              lineHeight: '1.8',
              letterSpacing: '0.06em',
            }}
          >
            重視生命。尊重自然。相信邏輯。
          </p>
        </div>

        {/* 右欄：導覽 + 聯絡 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'flex-end',
          }}
          className="footer-right"
        >
          {/* 導覽連結 */}
          <nav
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: '12px',
                  color: 'var(--ink-secondary)',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  transition: 'color 250ms ease',
                }}
                onMouseEnter={e => (e.target.style.color = 'var(--ink-primary)')}
                onMouseLeave={e => (e.target.style.color = 'var(--ink-secondary)')}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* 聯絡資訊（待補） */}
          <div
            style={{
              textAlign: 'right',
              fontSize: '12px',
              color: 'var(--ink-secondary)',
              lineHeight: '2',
              letterSpacing: '0.06em',
            }}
          >
            {/* TODO: Bryan 提供正式聯絡資訊後填入 */}
            <p>phytologic.tw</p>
          </div>
        </div>
      </div>

      {/* 版權 */}
      <div
        style={{
          maxWidth: 'var(--max-content-width)',
          margin: '48px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid var(--ink-secondary)',
          fontSize: '11px',
          color: 'var(--ink-secondary)',
          letterSpacing: '0.08em',
          opacity: 0.6,
        }}
      >
        © {new Date().getFullYear()} Phytologic. All rights reserved.
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-right {
            align-items: flex-start !important;
          }
          .footer-right nav {
            justify-content: flex-start !important;
          }
          .footer-right div {
            text-align: left !important;
          }
        }
      `}</style>
    </footer>
  )
}
