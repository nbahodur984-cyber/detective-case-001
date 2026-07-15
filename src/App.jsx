import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import ArchiveScreen from './screens/ArchiveScreen.jsx'
import CaseScreen from './screens/CaseScreen.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Тёплый мерцающий свет лампы поверх сцены */}
        <div className="lamp" aria-hidden="true" />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/cases" element={<ArchiveScreen />} />
          <Route path="/case/:caseId" element={<CaseScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
