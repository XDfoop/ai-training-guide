import { useGetArticle, getGetArticleQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CalendarDays, Share2, Bookmark } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomization } from "@/lib/customization-context";
import { format } from "date-fns";

export default function ArticleReader() {
  const params = useParams();
  const id = Number(params.id);
  const { readingMode, setReadingMode } = useCustomization();

  const { data: article, isLoading } = useGetArticle(id, {
    query: { enabled: !!id, queryKey: getGetArticleQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        <Skeleton className="w-24 h-8 mb-8" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-3/4 h-8 mb-12" />
        {Array(10).fill(0).map((_, i) => (
          <Skeleton key={i} className="w-full h-4" />
        ))}
      </div>
    );
  }

  if (!article) return <div className="p-12 text-center text-muted-foreground">Article not found</div>;

  return (
    <div className={`animate-in fade-in duration-500 max-w-3xl mx-auto px-6 ${readingMode ? 'py-4' : 'py-12'}`}>
      
      {!readingMode && (
        <div className="mb-8 flex items-center justify-between">
          <Link href="/articles">
            <Button variant="ghost" className="-ml-4 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Library
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setReadingMode(true)}>Focus Mode</Button>
          </div>
        </div>
      )}

      <article>
        <header className="mb-12 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link href={`/topics/${article.topicId}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">{article.topicName}</Badge>
            </Link>
            <Badge variant="outline" className="capitalize bg-background text-primary border-primary/30">
              {article.difficulty}
            </Badge>
            <span className="text-muted-foreground text-sm font-mono flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" /> {article.readingTimeMinutes} min read
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {format(new Date(article.createdAt), "MMMM d, yyyy")}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Bookmark className="w-4 h-4" /></Button>
            </div>
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:leading-loose prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-a:text-primary">
          {/* We simulate markdown rendering. In a real app we'd use react-markdown */}
          {article.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i}>{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('```')) {
              const code = paragraph.replace(/```[a-z]*\n/, '').replace(/```$/, '');
              return <pre key={i}><code>{code}</code></pre>;
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs text-muted-foreground bg-muted">#{tag}</Badge>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
