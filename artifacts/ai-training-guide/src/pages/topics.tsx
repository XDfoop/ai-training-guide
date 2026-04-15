import { useListTopics, getListTopicsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Topics() {
  const { data: topics, isLoading } = useListTopics({
    query: { queryKey: getListTopicsQueryKey() }
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Knowledge Domains</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Browse our highly curated index of AI training methodologies and concepts. Select a domain to dive deep into its specific architecture.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
        ) : topics?.map(topic => (
          <Link key={topic.id} href={`/topics/${topic.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="font-mono">{topic.articleCount} articles</Badge>
                </div>
                <CardTitle className="text-xl">{topic.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-base">{topic.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
