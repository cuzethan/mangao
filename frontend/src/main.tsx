import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import './index.css'
import App from './pages/App.tsx'
import Home from './pages/Home.tsx'

const router = createBrowserRouter([
  { index: true, Component: Home },
  {
    Component: App,
    path: "/app",
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)
