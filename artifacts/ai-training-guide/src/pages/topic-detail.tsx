import { useGetTopic, getGetTopicQueryKey } from "@workspace/api-client-react";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowLeft, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function TopicDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: topic, isLoading } = useGetTopic(id, {
    query: { enabled: !!id, queryKey: getGetTopicQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Skeleton className="w-24 h-8 mb-8" />
        <Skeleton className="w-3/4 h-12 mb-4" />
        <Skeleton className="w-full h-24 mb-12" />
        <div className="space-y-4">
          <Skeleton className="w-full h-32" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return <div className="p-12 text-center text-muted-foreground">Topic not found</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto px-6 py-12">
      <Link href="/topics">
        <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Domains
        </Button>
      </Link>

      <div className="mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{topic.name}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {topic.description}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-2xl font-bold">Articles ({topic.articles.length})</h2>
        </div>

        {topic.articles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
            No articles published yet.
          </div>
        ) : (
          <div className="space-y-4">
            {topic.articles.map(article => (
              <Link key={article.id} href={`/articles/${article.id}`}>
                <div className="group block border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{article.title}</h3>
                    <Badge variant={article.difficulty === 'advanced' ? 'default' : 'secondary'} className="capitalize shrink-0">
                      {article.difficulty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {article.readingTimeMinutes} min
                    </div>
                    <div className="flex gap-2">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
