import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import IdeologyPage from './pages/IdeologyPage'
import ContactPage from './pages/ContactPage'
import JournalPage from './pages/JournalPage'
import SnowMountainPage from './pages/series/SnowMountainPage'
import LimeGreenPage from './pages/series/LimeGreenPage'
import RosePage from './pages/series/RosePage'
import CinnamonPage from './pages/series/CinnamonPage'
import PurpleBerryPage from './pages/series/PurpleBerryPage'
import PlatinumPage from './pages/series/PlatinumPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ideology" element={<IdeologyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/journal" element={<JournalPage />} />
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
