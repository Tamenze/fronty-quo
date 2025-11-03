import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import QueryProvider from './providers/QueryProvider.tsx'


import RootLayout from './RootLayout.tsx'
import UserSignUpForm from './features/users/components/UserSignUpForm.tsx'
import RandomQuotePage from './features/quotes/pages/RandomQuotePage.tsx'
import QuotesIndexPage from './features/quotes/pages/QuotesIndexPage.tsx'
import QuoteShowPage from './features/quotes/pages/QuoteShowPage.tsx'
import TagShowPage from './features/tags/pages/TagShowPage.tsx'
import QuoteCreateForm from './features/quotes/components/QuoteCreateForm.tsx'
import QuoteUpdateForm from './features/quotes/components/QuoteUpdateForm.tsx'
import UserProfilePage from './features/users/pages/UserProfilePage.tsx'
import UserLoginForm from './features/users/components/UserLoginForm.tsx'
import UserEditForm from './features/users/components/UserEditForm.tsx'
import TagCreateForm from './features/tags/components/TagCreateForm.tsx'

import RequireAuth from "./features/auth/RequireAuth.tsx";

const router = createBrowserRouter([
  { path: "/", 
    element: <RootLayout />,
    children: [ //everything nested under the "/" path goes here, so all pages 
      // routes requiring auth
      { path: 'quotes', element: <RequireAuth><QuotesIndexPage /></RequireAuth>},
      { path: "quotes/:id", element: <RequireAuth><QuoteShowPage /></RequireAuth>},
      { path: "tags/:id", element: <RequireAuth><TagShowPage /></RequireAuth>},
      { path: "tags/new", element: <RequireAuth><TagCreateForm /></RequireAuth>},
      { path: "quotes/new", element: <RequireAuth><QuoteCreateForm /></RequireAuth>},
      { path: "quotes/:id/edit", element: <RequireAuth><QuoteUpdateForm /></RequireAuth>},
      { path: "users/:id", element: <RequireAuth><UserProfilePage /></RequireAuth>},
      { path: 'users/:id/edit', element: <RequireAuth><UserEditForm /></RequireAuth>},

      // routes open to public (non-authed users)
      { index: true, element: <RandomQuotePage /> },
      { path: "signup", element: <UserSignUpForm /> },
      { path: "login", element: <UserLoginForm />},


    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router}/>
    </QueryProvider>
  </StrictMode>,
)
