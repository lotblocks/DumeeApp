import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthContextProvider } from '~/hooks/AuthContext';
import RouteErrorBoundary from './RouteErrorBoundary';

// Lazy load components for better performance
const Login = lazy(() => import('~/components/Auth').then(module => ({ default: module.Login })));
const VerifyEmail = lazy(() => import('~/components/Auth').then(module => ({ default: module.VerifyEmail })));
const Registration = lazy(() => import('~/components/Auth').then(module => ({ default: module.Registration })));
const ResetPassword = lazy(() => import('~/components/Auth').then(module => ({ default: module.ResetPassword })));
const ApiErrorWatcher = lazy(() => import('~/components/Auth').then(module => ({ default: module.ApiErrorWatcher })));
const TwoFactorScreen = lazy(() => import('~/components/Auth').then(module => ({ default: module.TwoFactorScreen })));
const RequestPasswordReset = lazy(() => import('~/components/Auth').then(module => ({ default: module.RequestPasswordReset })));

const OAuthSuccess = lazy(() => import('~/components/OAuth').then(module => ({ default: module.OAuthSuccess })));
const OAuthError = lazy(() => import('~/components/OAuth').then(module => ({ default: module.OAuthError })));

const StartupLayout = lazy(() => import('./Layouts/Startup'));
const LoginLayout = lazy(() => import('./Layouts/Login'));
const ShareRoute = lazy(() => import('./ShareRoute'));
const ChatRoute = lazy(() => import('./ChatRoute'));
const Search = lazy(() => import('./Search'));
const Root = lazy(() => import('./Root'));

// Import dashboard routes normally (not a component)
import dashboardRoutes from './Dashboard';

// Loading component for suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

// Wrapper component for lazy loaded routes
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const AuthLayout = () => (
  <AuthContextProvider>
    <Outlet />
    <LazyWrapper>
      <ApiErrorWatcher />
    </LazyWrapper>
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: 'share/:shareId',
    element: <LazyWrapper><ShareRoute /></LazyWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: 'oauth',
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'success',
        element: <LazyWrapper><OAuthSuccess /></LazyWrapper>,
      },
      {
        path: 'error',
        element: <LazyWrapper><OAuthError /></LazyWrapper>,
      },
    ],
  },
  {
    path: '/',
    element: <LazyWrapper><StartupLayout /></LazyWrapper>,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'register',
        element: <LazyWrapper><Registration /></LazyWrapper>,
      },
      {
        path: 'forgot-password',
        element: <LazyWrapper><RequestPasswordReset /></LazyWrapper>,
      },
      {
        path: 'reset-password',
        element: <LazyWrapper><ResetPassword /></LazyWrapper>,
      },
    ],
  },
  {
    path: 'verify',
    element: <LazyWrapper><VerifyEmail /></LazyWrapper>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: <LazyWrapper><LoginLayout /></LazyWrapper>,
        children: [
          {
            path: 'login',
            element: <LazyWrapper><Login /></LazyWrapper>,
          },
          {
            path: 'login/2fa',
            element: <LazyWrapper><TwoFactorScreen /></LazyWrapper>,
          },
        ],
      },
      dashboardRoutes,
      {
        path: '/',
        element: <LazyWrapper><Root /></LazyWrapper>,
        children: [
          {
            index: true,
            element: <Navigate to="/c/new" replace={true} />,
          },
          {
            path: 'c/:conversationId?',
            element: <LazyWrapper><ChatRoute /></LazyWrapper>,
          },
          {
            path: 'search',
            element: <LazyWrapper><Search /></LazyWrapper>,
          },
        ],
      },
    ],
  },
]);

