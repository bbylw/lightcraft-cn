import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Panels } from './pages/Panels'
import { Develop } from './pages/Develop'
import { EnginePage } from './pages/EnginePage'
import { StatusPage } from './pages/StatusPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/panels" element={<Panels />} />
          <Route path="/develop" element={<Develop />} />
          <Route path="/engine" element={<EnginePage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="*" element={<Landing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
