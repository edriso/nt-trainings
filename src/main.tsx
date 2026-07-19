import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        {
          path: '/topics/:slug',
          // Loaded on demand so the home page ships less JavaScript.
          lazy: async () => ({
            Component: (await import('./pages/TopicPage')).TopicPage,
          }),
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  // BASE_URL comes from `base` in vite.config.ts, so links work on GitHub Pages.
  { basename: import.meta.env.BASE_URL },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
