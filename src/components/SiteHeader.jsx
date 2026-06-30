import { useState } from 'react'
import { NAV_LINKS } from '../lib/navConfig'

const LINE_OA_URL = 'https://line.me/R/ti/p/@248xuoic'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        height: '64px',
        backgroundColor: 'var(--bg-base)',
        borderBottom: '1px solid var(--ink-secondary)',
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          fontFamily: 'Noto Serif TC, serif',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--ink-primary)',
          letterSpacing: '0.08em',
          textDecoration: 'none',
        }}
      >
        PHYTOLOGIC 植本邏輯
      </a>

      {/* 桌面導覽 */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
        }}
        className="desktop-nav"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'var(--ink-secondary)',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              transition: 'color 250ms ease',
            }}
            onMouseEnter={e => (e.target.style.color = 'var(--ink-primary)')}
            onMouseLeave={e => (e.target.style.color = 'var(--ink-secondary)')}
          >
            {label}
          </a>
        ))}

        {/* 固定 CTA */}
        <a
          href={LINE_OA_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--bg-base)',
            backgroundColor: 'var(--ink-primary)',
            padding: '8px 20px',
            borderRadius: '999px',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            transition: 'opacity 250ms ease',
          }}
          onMouseEnter={e => (e.target.style.opacity = '0.8')}
          onMouseLeave={e => (e.target.style.opacity = '1')}
        >
          加入 LINE 官方帳號
        </a>
      </nav>

      {/* 手機漢堡選單按鈕 */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        aria-label="開啟選單"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          color: 'var(--ink-primary)',
        }}
        className="mobile-menu-btn"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* 手機展開選單 */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-base)',
            borderBottom: '1px solid var(--ink-secondary)',
            padding: '24px 40px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '15px',
                color: 'var(--ink-primary)',
                textDecoration: 'none',
                letterSpacing: '0.08em',
              }}
            >
              {label}
            </a>
          ))}
          <a
            href={LINE_OA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--bg-base)',
              backgroundColor: 'var(--ink-primary)',
              padding: '12px 24px',
              borderRadius: '999px',
              textDecoration: 'none',
              textAlign: 'center',
              letterSpacing: '0.1em',
              marginTop: '8px',
            }}
          >
            加入 LINE 官方帳號
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}
