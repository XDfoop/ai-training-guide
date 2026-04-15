import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomizationProvider } from "@/lib/customization-context";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import Topics from "@/pages/topics";
import TopicDetail from "@/pages/topic-detail";
import Articles from "@/pages/articles";
import ArticleReader from "@/pages/article-reader";
import Settings from "@/pages/settings";
import TrainingLabHome from "@/pages/training/index";
import ModelTypes from "@/pages/training/types";
import TypeDetail from "@/pages/training/type-detail";
import TrainingPaths from "@/pages/training/paths";
import PathDetail from "@/pages/training/path-detail";
import Datasets from "@/pages/datasets/index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/topics" component={Topics} />
        <Route path="/topics/:id" component={TopicDetail} />
        <Route path="/articles" component={Articles} />
        <Route path="/articles/:id" component={ArticleReader} />
        <Route path="/training" component={TrainingLabHome} />
        <Route path="/training/types" component={ModelTypes} />
        <Route path="/training/types/:id" component={TypeDetail} />
        <Route path="/training/paths" component={TrainingPaths} />
        <Route path="/training/paths/:id" component={PathDetail} />
        <Route path="/datasets" component={Datasets} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomizationProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CustomizationProvider>
    </QueryClientProvider>
  );
}

export default App;
