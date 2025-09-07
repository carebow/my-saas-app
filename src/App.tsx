
import React, { Suspense, lazy, useMemo, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CustomTooltipProvider } from "@/components/ui/custom-tooltip-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth.tsx";
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

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <AnalyticsProvider>
                <CustomTooltipProvider>
                  <div className="min-h-screen bg-background">
                    <ScrollToTop />
                    <PerformanceMonitor />
                    <UserEngagementTracker />
                    
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={
                        <Suspense fallback={<RouteLoader />}>
                          <Services />
                        </Suspense>
                      } />
                      <Route path="/technology" element={
                        <Suspense fallback={<RouteLoader />}>
                          <Technology />
                        </Suspense>
                      } />
                      <Route path="/about" element={
                        <Suspense fallback={<RouteLoader />}>
                          <About />
                        </Suspense>
                      } />
                      <Route path="/contact" element={
                        <Suspense fallback={<RouteLoader />}>
                          <Contact />
                        </Suspense>
                      } />
                      <Route path="/careers" element={
                        <Suspense fallback={<RouteLoader />}>
                          <Careers />
                        </Suspense>
                      } />
                      <Route path="/blog" element={
                        <Suspense fallback={<RouteLoader />}>
                          <Blog />
                        </Suspense>
                      } />
                      <Route path="/blog/:slug" element={
                        <Suspense fallback={<RouteLoader />}>
                          <BlogPost />
                        </Suspense>
                      } />
                      <Route path="/diabetes-home-care" element={
                        <Suspense fallback={<RouteLoader />}>
                          <DiabetesHomeCare />
                        </Suspense>
                      } />
                      <Route path="/post-stroke-recovery" element={
                        <Suspense fallback={<RouteLoader />}>
                          <PostStrokeRecovery />
                        </Suspense>
                      } />
                      <Route path="/alzheimers-care" element={
                        <Suspense fallback={<RouteLoader />}>
                          <AlzheimersCare />
                        </Suspense>
                      } />
                      <Route path="/ask-carebow" element={
                        <Suspense fallback={<RouteLoader />}>
                          <AskCareBow />
                        </Suspense>
                      } />
                      <Route path="/ask-carebow-app" element={
                        <Suspense fallback={<RouteLoader />}>
                          <AskCareBowApp />
                        </Suspense>
                      } />
                      <Route path="/admin" element={
                        <Suspense fallback={<RouteLoader />}>
                          <AdminDashboard />
                        </Suspense>
                      } />
                      <Route path="/dashboard" element={
                        <Suspense fallback={<RouteLoader />}>
                          <Dashboard />
                        </Suspense>
                      } />
                      <Route path="/privacy-policy" element={
                        <Suspense fallback={<RouteLoader />}>
                          <PrivacyPolicy />
                        </Suspense>
                      } />
                      <Route path="/terms-of-service" element={
                        <Suspense fallback={<RouteLoader />}>
                          <TermsOfService />
                        </Suspense>
                      } />
                      <Route path="/hipaa-compliance" element={
                        <Suspense fallback={<RouteLoader />}>
                          <HipaaCompliance />
                        </Suspense>
                      } />
                      <Route path="*" element={
                        <Suspense fallback={<RouteLoader />}>
                          <NotFound />
                        </Suspense>
                      } />
                    </Routes>
                    
                    <FloatingAskCareBow />
                    <Toaster />
                  </div>
                </CustomTooltipProvider>
              </AnalyticsProvider>
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
