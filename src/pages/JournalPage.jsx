/**
 * 植本誌 — V3.1 §5 內容模型規格
 *
 * 目前無 Sanity 專案，以符合 CMS 欄位定義的假資料呈現前台結構
 * （title / category / publishedDate / featured / posterImage / body / requiresReview / reviewStatus）。
 * 待 Sanity 專案建立後，替換下方 JOURNAL_ENTRIES 為 Sanity client 查詢即可，版面結構不需更動。
 *
 * 依 V3 §0 動態呈現規則，植本誌屬列表型/持續更新內容，不強制進場動畫（不使用 FadeUp）。
 * 「輪播區塊」以手動水平捲動呈現，不自動輪播、無彈跳，符合全站禁止跑馬燈/彈出式輪播的動效規範。
 */

import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const CATEGORY_LABEL = {
  video: '影片',
  article: '文章',
  event: '活動花絮',
}

/* ─── 假資料（待 Sanity 串接後移除）─── */
const JOURNAL_ENTRIES = [
  {
    title: '晨光中的山藥田——雪山植萃的產地紀行',
    category: 'event',
    publishedDate: '2026-06-20',
    featured: true,
    posterColor: '#8fa0a8',
    href: '#',
    requiresReview: false,
    reviewStatus: 'published',
  },
  {
    title: '為什麼我們選擇台灣在地食材，而不是進口超級食物',
    category: 'article',
    publishedDate: '2026-06-12',
    featured: true,
    posterColor: '#4F7A5C',
    href: '#',
    requiresReview: true,
    reviewStatus: 'published',
  },
  {
    title: '一杯植萃的誕生：從清洗到裝瓶',
    category: 'video',
    publishedDate: '2026-05-30',
    featured: true,
    posterColor: '#D9A02E',
    href: '#',
    requiresReview: false,
    reviewStatus: 'published',
  },
  {
    title: '植本邏輯走進在地小農市集',
    category: 'event',
    publishedDate: '2026-05-18',
    featured: false,
    posterColor: '#9B6FC4',
    href: '#',
    requiresReview: false,
    reviewStatus: 'published',
  },
  {
    title: '膳食纖維與腸道健康：三好三無如何實踐',
    category: 'article',
    publishedDate: '2026-05-02',
    featured: false,
    posterColor: '#C2272D',
    href: '#',
    requiresReview: true,
    reviewStatus: 'published',
  },
  {
    title: '鉑金植萃的日常：一位長輩的一年',
    category: 'video',
    publishedDate: '2026-04-15',
    featured: false,
    posterColor: '#E0D5BD',
    href: '#',
    requiresReview: false,
    reviewStatus: 'published',
  },
]
/* ─── END 假資料 ─── */

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
  const featuredEntries = getFeaturedEntries(JOURNAL_ENTRIES)
  const listEntries = getSortedList(JOURNAL_ENTRIES)

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
                key={entry.title}
                href={entry.href}
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
                {/* TODO: posterImage 替換區 — Sanity 串接後改為真實海報圖 */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(160deg, ${entry.posterColor}cc 0%, #8a8a8a55 100%)`,
                  }}
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
                key={entry.title}
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
                  href={entry.href}
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
