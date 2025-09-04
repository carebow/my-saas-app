
import React, { Suspense, lazy, useMemo, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CustomTooltipProvider } from "@/components/ui/custom-tooltip-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingAskCareBow from "./components/FloatingAskCareBow";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { UserEngagementTracker } from "./components/UserEngagementTracker";

// Lazy load route components for better performance
const Services = lazy(() => import("./pages/Services"));
const Technology = lazy(() => import("./pages/Technology"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const DiabetesHomeCare = lazy(() => import("./pages/DiabetesHomeCare"));
const PostStrokeRecovery = lazy(() => import("./pages/PostStrokeRecovery"));
const AlzheimersCare = lazy(() => import("./pages/AlzheimersCare"));
const AskCareBow = lazy(() => import("./pages/AskCareBow"));
const AskCareBowApp = lazy(() => import("./pages/AskCareBowApp"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const HipaaCompliance = lazy(() => import("./pages/HipaaCompliance"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized loading component
const RouteLoader = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading page...</p>
    </div>
  </div>
));

RouteLoader.displayName = 'RouteLoader';

// Create QueryClient instance (moved outside component)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && 'status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const App = () => {
  // Optimized error handling
  const handleUnhandledRejection = useCallback((event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  }, []);

  const handleError = useCallback((event: ErrorEvent) => {
    console.error('Global error:', event.error);
  }, []);

  // Set up global error handlers
  React.useEffect(() => {
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [handleUnhandledRejection, handleError]);

  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => [
    { path: "/", element: <Index /> },
    { path: "/services", element: <Services /> },
    { path: "/technology", element: <Technology /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "/careers", element: <Careers /> },
    { path: "/blog", element: <Blog /> },
    { path: "/blog/:slug", element: <BlogPost /> },
    { path: "/diabetes-home-care", element: <DiabetesHomeCare /> },
    { path: "/post-stroke-recovery", element: <PostStrokeRecovery /> },
    { path: "/alzheimers-care", element: <AlzheimersCare /> },
    { path: "/ask-carebow", element: <AskCareBow /> },
    { path: "/ask-carebow/app", element: <AskCareBowApp /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> },
    { path: "/terms-of-service", element: <TermsOfService /> },
    { path: "/hipaa-compliance", element: <HipaaCompliance /> },
    { path: "*", element: <NotFound /> },
  ], []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AnalyticsProvider>
              <BrowserRouter>
                <CustomTooltipProvider>
                  <Toaster />
                  <ScrollToTop />
                  <FloatingAskCareBow />
                  <PerformanceMonitor />
                  <UserEngagementTracker />
                  <Suspense fallback={<RouteLoader />}>
                    <Routes>
                      {routes.map(({ path, element }) => (
                        <Route
                          key={path}
                          path={path}
                          element={element}
                        />
                      ))}
                    </Routes>
                  </Suspense>
                </CustomTooltipProvider>
              </BrowserRouter>
            </AnalyticsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
