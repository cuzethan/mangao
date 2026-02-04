import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import './index.css'
import App from './pages/App.tsx'
import Home from './pages/Home.tsx'
import Signup from './pages/Signup.tsx'
import Login from './pages/Login.tsx'

const router = createBrowserRouter([
  { index: true, Component: Home },
  {
    Component: App,
    path: "/app",
  },
  {
    Component: Signup,
    path: "/signup"
  },
  {
    Component: Login,
    path: "/login"
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
)
