import { useState } from "react";
import { useListArticles, useListTopics, getListArticlesQueryKey, getListTopicsQueryKey, ListArticlesDifficulty } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock } from "lucide-react";

export default function Articles() {
  const [search, setSearch] = useState("");
  const [topicId, setTopicId] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");

  const { data: topics } = useListTopics({
    query: { queryKey: getListTopicsQueryKey() }
  });

  const queryParams = {
    ...(topicId !== "all" ? { topicId: Number(topicId) } : {}),
    ...(difficulty !== "all" ? { difficulty: difficulty as ListArticlesDifficulty } : {})
  };

  const { data: articles, isLoading } = useListArticles(queryParams, {
    query: { queryKey: getListArticlesQueryKey(queryParams) }
  });

  const filteredArticles = articles?.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.summary.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Library Index</h1>
        <p className="text-muted-foreground">Search and filter across all training protocols.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-muted/30 p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles, tags..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select value={topicId} onValueChange={setTopicId}>
            <SelectTrigger className="w-full md:w-[180px] bg-background">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {topics?.map(t => (
                <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-[180px] bg-background">
              <SelectValue placeholder="Any Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Difficulty</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : filteredArticles?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No articles match your criteria.</div>
        ) : (
          filteredArticles?.map(article => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <Card className="hover:border-primary/50 hover:bg-muted/20 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">{article.topicName}</Badge>
                        <Badge className="text-xs capitalize bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">{article.difficulty}</Badge>
                      </div>
                      <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{article.summary}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-mono">
                        <Clock className="w-4 h-4" /> {article.readingTimeMinutes}m
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                        {article.tags.map(tag => (
                          <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
