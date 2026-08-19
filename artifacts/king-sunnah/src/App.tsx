import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Shell } from '@/components/layout/shell';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Search from '@/pages/search';
import HadithDetail from '@/pages/hadith-detail';
import Books from '@/pages/books';
import Narrators from '@/pages/narrators';
import NarratorProfile from '@/pages/narrator-profile';
import Research from '@/pages/research';
import Saved from '@/pages/saved';
import Stats from '@/pages/stats';
import { StoreProvider } from '@/lib/store';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  // The home route renders its own full-width layout; all others use Shell
  if (location === '/') {
    return (
      <RoutedErrorBoundary>
        <Home />
      </RoutedErrorBoundary>
    );
  }

  return (
    <Shell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/hadith/:id" component={HadithDetail} />
          <Route path="/books" component={Books} />
          <Route path="/narrators" component={Narrators} />
          <Route path="/narrator/:id" component={NarratorProfile} />
          <Route path="/research" component={Research} />
          <Route path="/saved" component={Saved} />
          <Route path="/stats" component={Stats} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Shell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
