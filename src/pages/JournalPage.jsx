/**
 * 植本誌 — V3.1 §5 內容模型規格
 *
 * 內容從 Sanity CMS（phytologic-journal 專案）讀取，欄位對應：
 * title / category / publishedDate / featured / posterImage / body / requiresReview / reviewStatus。
 *
 * 依 V3 §0 動態呈現規則，植本誌屬列表型/持續更新內容，不強制進場動畫（不使用 FadeUp）。
 * 「輪播區塊」以手動水平捲動呈現，不自動輪播、無彈跳，符合全站禁止跑馬燈/彈出式輪播的動效規範。
 */

import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { fetchJournalEntries } from '../lib/sanityClient'

const CATEGORY_LABEL = {
  video: '影片',
  article: '文章',
  event: '活動花絮',
}

function getFeaturedEntries(entries, minCount = 3) {
  const published = entries.filter(e => e.reviewStatus === 'published')
  const featured = published.filter(e => e.featured)
  if (featured.length >= minCount) return featured
  const rest = published
    .filter(e => !e.featured)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
  return [...featured, ...rest].slice(0, minCount)
}

function getSortedList(entries) {
  return entries
    .filter(e => e.reviewStatus === 'published')
    .slice()
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
}

export default function JournalPage() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    fetchJournalEntries()
      .then(setEntries)
      .catch(err => console.error('植本誌內容讀取失敗', err))
  }, [])

  const featuredEntries = getFeaturedEntries(entries)
  const listEntries = getSortedList(entries)

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <SiteHeader />

      <div style={{ paddingTop: '64px' }}>
        {/* ── 標題 ── */}
        <section style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto', padding: '80px 40px 0' }}>
          <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', letterSpacing: '0.22em', marginBottom: '16px', fontWeight: 500 }}>
            JOURNAL
          </p>
          <h1 style={{ fontFamily: 'Noto Serif TC, serif', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.06em' }}>
            植本誌
          </h1>
        </section>

        {/* ── 輪播區塊（手動水平捲動，不自動播放）── */}
        <section style={{ padding: '48px 0 100px' }}>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              padding: '0 40px',
              scrollSnapType: 'x mandatory',
            }}
            className="journal-carousel"
          >
            {featuredEntries.map(entry => (
              <a
                key={entry.slug}
                href={`/journal/${entry.slug}`}
                style={{
                  position: 'relative',
                  flex: '0 0 clamp(260px, 32vw, 380px)',
                  aspectRatio: '4 / 5',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  scrollSnapAlign: 'start',
                }}
              >
                <div
                  aria-hidden="true"
                  style={
                    entry.posterImageUrl
                      ? {
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${entry.posterImageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(160deg, #8fa0a8cc 0%, #8a8a8a55 100%)',
                        }
                  }
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 55%)',
                  }}
                />
                <div style={{ position: 'absolute', left: '20px', right: '20px', bottom: '20px' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.18em', marginBottom: '10px' }}>
                    {CATEGORY_LABEL[entry.category]}
                  </p>
                  <p style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '16px', color: '#fff', lineHeight: 1.6, letterSpacing: '0.04em' }}>
                    {entry.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 內容列表（純依發布日期新到舊）── */}
        <section style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto', padding: '0 40px 140px' }}>
          <div style={{ borderTop: '1px solid var(--ink-secondary)' }}>
            {listEntries.map(entry => (
              <div
                key={entry.slug}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 110px 120px',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '24px 0',
                  borderBottom: '1px solid var(--ink-secondary)',
                }}
                className="journal-row"
              >
                <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', letterSpacing: '0.1em' }}>
                  {CATEGORY_LABEL[entry.category]}
                </span>
                <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '15px', color: 'var(--ink-primary)', letterSpacing: '0.04em' }}>
                  {entry.title}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--ink-secondary)', letterSpacing: '0.06em' }}>
                  {entry.publishedDate}
                </span>
                <a
                  href={`/journal/${entry.slug}`}
                  style={{ fontSize: '12px', color: 'var(--ink-primary)', letterSpacing: '0.08em', textDecoration: 'none', borderBottom: '1px solid var(--ink-primary)', justifySelf: 'start', paddingBottom: '1px' }}
                >
                  前往觀看
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />

      <style>{`
        .journal-carousel::-webkit-scrollbar { height: 6px; }
        .journal-carousel::-webkit-scrollbar-thumb { background: var(--ink-secondary); border-radius: 3px; }

        @media (max-width: 640px) {
          .journal-row {
            grid-template-columns: 1fr !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  )
}
