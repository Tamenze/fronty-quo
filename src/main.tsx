import "../instrument.js"
import * as Sentry from '@sentry/react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import QueryProvider from './providers/QueryProvider.tsx'
import { AppWithBoundaries, AppRouteFallback } from './features/AppWithBoundaries.tsx'

//imports in the main bundle, eagerly loaded to show layout + homepage immediately.
import RootLayout from './RootLayout.tsx';
import RandomQuotePage from './features/quotes/pages/RandomQuotePage.tsx';
import RequireAuth from "./features/auth/RequireAuth.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

//route-level code-splitting: "heavy" pages are lazy-loaded per route
const router = createBrowserRouter([
  { path: "/", 
    element: <AppWithBoundaries><RootLayout /></AppWithBoundaries>,
    errorElement: <AppRouteFallback />, 
    children: [ //everything nested under the "/" path goes here, so all pages 

      // Protected routes requiring auth: skeleton shown while auth + page module load in parallel.
      { path: 'quotes', 
        lazy: async() => {
          const mod = await import('./features/quotes/pages/QuotesIndexPage.tsx');
          const QuotesIndexPage = mod.default;
          const QuotesIndexPageSkeleton = mod.QuotesIndexPageSkeleton;

          return {
            element: <RequireAuth fallback={<QuotesIndexPageSkeleton />}><QuotesIndexPage /></RequireAuth>
          };
        }
      },
      { path: "quotes/:id", 
        lazy: async() => {
          const mod = await import('./features/quotes/pages/QuoteShowPage.tsx');
          const QuoteShowPage = mod.default;
          const QuoteShowPageSkeleton = mod.QuoteShowPageSkeleton;

          return {
            element: <RequireAuth fallback={<QuoteShowPageSkeleton/>}><QuoteShowPage/></RequireAuth>
          }
        }
      },
      {
        path: "tags/:id",
        lazy: async () => {
          const mod = await import("./features/tags/pages/TagShowPage.tsx");
          const TagShowPage = mod.default;
          const TagShowPageSkeleton = mod.TagShowPageSkeleton;

          return {
            element: <RequireAuth fallback={<TagShowPageSkeleton />}><TagShowPage /></RequireAuth>,
          };
        },
      },
      {
        path: "tags/new",
        lazy: async () => {
          const mod = await import("./features/tags/components/TagCreateForm.tsx");
          const TagCreateForm = mod.default;
          const TagCreateFormSkeleton = mod.TagCreateFormSkeleton;

          return {
            element: <RequireAuth fallback={<TagCreateFormSkeleton />}><TagCreateForm /></RequireAuth>,
          };
        },
      },
      {
        path: "quotes/new",
        lazy: async () => {
          const mod = await import("./features/quotes/components/QuoteCreateForm.tsx");
          const QuoteCreateForm = mod.default;
          const QuoteCreateFormSkeleton = mod.QuoteCreateFormSkeleton;

          return {
            element: <RequireAuth fallback={<QuoteCreateFormSkeleton />}><QuoteCreateForm /></RequireAuth>,
          };
        },
      },
      {
        path: "quotes/:id/edit",
        lazy: async () => {
          const mod = await import("./features/quotes/components/QuoteUpdateForm.tsx");
          const QuoteUpdateForm = mod.default;
          const QuoteUpdateFormSkeleton = mod.QuoteUpdateFormSkeleton;

          return {
            element: <RequireAuth fallback={<QuoteUpdateFormSkeleton />}><QuoteUpdateForm /></RequireAuth>,
          };
        },
      },
      {
        path: "users/:id",
        lazy: async () => {
          const mod = await import("./features/users/pages/UserProfilePage.tsx");
          const UserProfilePage = mod.default;
          const UserProfilePageSkeleton = mod.UserProfilePageSkeleton;

          return {
            element: <RequireAuth fallback={<UserProfilePageSkeleton />}><UserProfilePage /></RequireAuth>,
          };
        },
      },
      {
        path: "users/:id/edit",
        lazy: async () => {
          const mod = await import("./features/users/components/UserUpdateForm.tsx");
          const UserUpdateForm = mod.default;
          const UserUpdateFormSkeleton = mod.UserUpdateFormSkeleton;

          return {
            element: <RequireAuth fallback={<UserUpdateFormSkeleton />}><UserUpdateForm /></RequireAuth>,
          };
        },
      },

      // routes open to public (non-authed users)
      { index: true, element: <RandomQuotePage /> },
      { path: "signup",
        lazy: async() => {
          const mod = await import("./features/users/components/UserSignUpForm.tsx");
          const UserSignUpForm = mod.default;

          return {
            element: <UserSignUpForm />
          }
        } 
      },
      { path: "login",
        lazy: async() => {
          const mod = await import("./features/users/components/UserLoginForm.tsx");
          const UserLoginForm = mod.default;

          return {
            element: <UserLoginForm />
          }
        }
      } 
    ]
  }
])

createRoot(document.getElementById('root')!, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider router={router}/>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
)
