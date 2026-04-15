import { useGetArticlesSummary, useGetFeaturedTopics, getGetArticlesSummaryQueryKey, getGetFeaturedTopicsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, BrainCircuit, Library, Layers, Network, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: summary, isLoading: loadingSummary } = useGetArticlesSummary({
    query: { queryKey: getGetArticlesSummaryQueryKey() }
  });
  
  const { data: topics, isLoading: loadingTopics } = useGetFeaturedTopics({
    query: { queryKey: getGetFeaturedTopicsQueryKey() }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border bg-muted/30">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <Badge variant="outline" className="mb-6 font-mono bg-background">v2.4.0 — Latest Training Protocols</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-3xl leading-tight">
            Master Advanced <span className="text-primary">AI Training</span> Architecture.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            The definitive engineering notebook for practitioners. Explore deep dives into NLP, Computer Vision, and Reinforcement Learning methodologies.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/topics">
              <Button size="lg" className="h-12 px-8 font-medium">
                Explore Topics
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="lg" variant="outline" className="h-12 px-8 font-medium">
                Browse Library
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-card shadow-sm border-muted">
            <CardContent className="p-6">
              <BookOpen className="w-5 h-5 text-primary mb-4" />
              {loadingSummary ? <Skeleton className="h-8 w-16 mb-2" /> : <div className="text-3xl font-bold">{summary?.totalArticles}</div>}
              <div className="text-sm text-muted-foreground font-medium">Deep Dive Articles</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm border-muted">
            <CardContent className="p-6">
              <Library className="w-5 h-5 text-primary mb-4" />
              {loadingSummary ? <Skeleton className="h-8 w-16 mb-2" /> : <div className="text-3xl font-bold">{summary?.totalTopics}</div>}
              <div className="text-sm text-muted-foreground font-medium">Knowledge Domains</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm border-muted">
            <CardContent className="p-6">
              <Zap className="w-5 h-5 text-primary mb-4" />
              {loadingSummary ? <Skeleton className="h-8 w-16 mb-2" /> : <div className="text-3xl font-bold">{summary?.byDifficulty.advanced}</div>}
              <div className="text-sm text-muted-foreground font-medium">Advanced Protocols</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-sm border-muted">
            <CardContent className="p-6">
              <Network className="w-5 h-5 text-primary mb-4" />
              {loadingSummary ? <Skeleton className="h-8 w-16 mb-2" /> : <div className="text-3xl font-bold">100%</div>}
              <div className="text-sm text-muted-foreground font-medium">Open Source</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Featured Topics */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            Core Disciplines
          </h2>
          <Link href="/topics" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingTopics ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
          ) : topics?.map(topic => (
            <Link key={topic.id} href={`/topics/${topic.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group hover-elevate">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    {/* Using generic icon, but could match based on topic.icon string */}
                    <Layers className="w-5 h-5" />
                  </div>
                  <CardTitle>{topic.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="font-mono text-xs">{topic.articles.length} articles</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Architecture</h2>
          <Link href="/articles" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Browse catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          {loadingSummary ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          ) : summary?.featuredArticles.map(article => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono capitalize">{article.topicName}</Badge>
                      <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20 font-medium capitalize" variant="secondary">{article.difficulty}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{article.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">{article.summary}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0 font-mono">
                    <span>{article.readingTimeMinutes}m read</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
