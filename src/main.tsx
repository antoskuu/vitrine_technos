import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RootLayout from './layouts/RootLayout'
import Three from './pages/Three'
import WebSocket from './pages/WebSocket'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<WebSocket />} />
          <Route path="porsche" element={<Three />} />
          {/* Ajoutez d'autres routes selon vos besoins */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)