import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import QueryProvider from './providers/QueryProvider.tsx'
import { AppWithBoundaries, AppRouteFallback } from './features/AppWithBoundaries.tsx'

import RootLayout from './RootLayout.tsx'
import UserSignUpForm from './features/users/components/UserSignUpForm.tsx'
import RandomQuotePage from './features/quotes/pages/RandomQuotePage.tsx'
import UserLoginForm from './features/users/components/UserLoginForm.tsx'
import QuotesIndexPage, { QuotesIndexPageSkeleton } from './features/quotes/pages/QuotesIndexPage.tsx'
import QuoteShowPage, { QuoteShowPageSkeleton } from './features/quotes/pages/QuoteShowPage.tsx'
import TagShowPage, { TagShowPageSkeleton } from './features/tags/pages/TagShowPage.tsx'
import QuoteCreateForm, { QuoteCreateFormSkeleton } from './features/quotes/components/QuoteCreateForm.tsx'
import QuoteUpdateForm, { QuoteUpdateFormSkeleton } from './features/quotes/components/QuoteUpdateForm.tsx'
import UserProfilePage, { UserProfilePageSkeleton } from './features/users/pages/UserProfilePage.tsx'
import UserUpdateForm, { UserUpdateFormSkeleton } from './features/users/components/UserUpdateForm.tsx'
import TagCreateForm, { TagCreateFormSkeleton } from './features/tags/components/TagCreateForm.tsx'

import RequireAuth from "./features/auth/RequireAuth.tsx";

const router = createBrowserRouter([
  { path: "/", 
    element: <AppWithBoundaries><RootLayout /></AppWithBoundaries>,
    errorElement: <AppRouteFallback />, 
    children: [ //everything nested under the "/" path goes here, so all pages 

      // routes requiring auth
      { path: 'quotes', 
        element: <RequireAuth fallback={<QuotesIndexPageSkeleton/>}><QuotesIndexPage/></RequireAuth>
      },
      { path: "quotes/:id", 
        element: <RequireAuth fallback={<QuoteShowPageSkeleton/>}><QuoteShowPage/></RequireAuth>
      },
      { path: "tags/:id", 
        element: <RequireAuth fallback={<TagShowPageSkeleton/>}><TagShowPage/></RequireAuth>
      },
      { path: "tags/new", 
        element: <RequireAuth fallback={<TagCreateFormSkeleton/>}><TagCreateForm/></RequireAuth>
      },
      { path: "quotes/new", 
        element: <RequireAuth fallback={<QuoteCreateFormSkeleton/>}><QuoteCreateForm/></RequireAuth>
      },
      { path: "quotes/:id/edit", 
        element: <RequireAuth fallback={<QuoteUpdateFormSkeleton/>}><QuoteUpdateForm /></RequireAuth>
      },
      { path: "users/:id", 
        element: <RequireAuth fallback={<UserProfilePageSkeleton/>}><UserProfilePage /></RequireAuth>
      },
      { path: 'users/:id/edit', 
        element: <RequireAuth fallback={<UserUpdateFormSkeleton/>}><UserUpdateForm/></RequireAuth>
      },

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
