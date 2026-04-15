import React from "react";
import { Link } from "wouter";
import { useListModelTypes, getListModelTypesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, FlaskConical, Database, ArrowRight } from "lucide-react";

export default function ModelTypes() {
  const { data: modelTypes, isLoading, error } = useListModelTypes({
    query: {
      queryKey: getListModelTypesQueryKey()
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-5 w-[500px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !modelTypes) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Failed to load model types.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Model Architectures</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Explore different types of AI models you can train. Each architecture has specific hardware requirements and training methodologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modelTypes.map((type) => (
          <Card key={type.id} className="flex flex-col h-full overflow-hidden border-border/50">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: type.color }}
                  >
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{type.name}</CardTitle>
                    <CardDescription className="font-mono mt-1 flex gap-3 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400">Min: {type.gpuVramMin}GB</span>
                      <span className="text-blue-600 dark:text-blue-400">Rec: {type.gpuVramRecommended}GB</span>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 flex-1">
              <p className="text-foreground/80 leading-relaxed">{type.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground/90 uppercase tracking-wider">Examples</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((ex, idx) => (
                      <Badge key={idx} variant="outline" className="bg-background">{ex}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground/90 uppercase tracking-wider">Use Cases</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.useCases.map((uc, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">{uc}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/50 flex items-center justify-between py-4">
              <div className="flex gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FlaskConical className="w-4 h-4" /> 
                  <span>{type.pathCount} Paths</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Database className="w-4 h-4" /> 
                  <span>{type.datasetCount} Datasets</span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/training/types/${type.id}`} className="flex items-center gap-2">
                  View Resources <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
