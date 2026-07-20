import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { LangProvider } from '@/lib/lang-context';
import { Shell } from '@/components/layout/Shell';
import { Home } from '@/pages/home';
import { Products } from '@/pages/products';
import { Contact } from '@/pages/contact';
import { Assessment } from '@/pages/assessment';
import { Results } from '@/pages/results';
import { AdminLogin } from '@/pages/admin-login';
import { AdminDashboard } from '@/pages/admin-dashboard';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Shell>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/products" component={Products} />
                <Route path="/contact" component={Contact} />
                <Route path="/assessment" component={Assessment} />
                <Route path="/results/:id" component={Results} />
                <Route path="/admin/login" component={AdminLogin} />
                <Route path="/admin" component={AdminDashboard} />
                <Route component={NotFound} />
              </Switch>
            </Shell>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}

export default App;