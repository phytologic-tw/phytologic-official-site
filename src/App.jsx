import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import IdeologyPage from './pages/IdeologyPage'
import ContactPage from './pages/ContactPage'
import SnowMountainPage from './pages/series/SnowMountainPage'
import LimeGreenPage from './pages/series/LimeGreenPage'
import RosePage from './pages/series/RosePage'
import CinnamonPage from './pages/series/CinnamonPage'
import PurpleBerryPage from './pages/series/PurpleBerryPage'
import PlatinumPage from './pages/series/PlatinumPage'

function HomePage() {
  return (
    <div style={{ padding: '120px 40px 80px', fontFamily: 'Manrope, sans-serif', color: 'var(--ink)' }}>
      <p style={{ marginBottom: '24px', fontSize: '14px', letterSpacing: '0.1em', color: 'var(--ink-3)' }}>
        PHYTOLOGIC 植本邏輯
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: '理念', to: '/ideology' },
          { label: '聯繫我們', to: '/contact' },
          { label: '雪山系列', to: '/series/snow-mountain' },
          { label: '萊姆系列', to: '/series/lime-green' },
          { label: '玫瑰系列', to: '/series/rose-red' },
          { label: '肉桂系列', to: '/series/cinnamon-gold' },
          { label: '漿果系列', to: '/series/berry-purple' },
          { label: '白金系列', to: '/series/platinum' },
        ].map(({ label, to }) => (
          <Link key={to} to={to} style={{ color: 'var(--forest)', textDecoration: 'none', fontSize: '15px' }}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ideology" element={<IdeologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/series/snow-mountain" element={<SnowMountainPage />} />
        <Route path="/series/lime-green" element={<LimeGreenPage />} />
        <Route path="/series/rose-red" element={<RosePage />} />
        <Route path="/series/cinnamon-gold" element={<CinnamonPage />} />
        <Route path="/series/berry-purple" element={<PurpleBerryPage />} />
        <Route path="/series/platinum" element={<PlatinumPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
