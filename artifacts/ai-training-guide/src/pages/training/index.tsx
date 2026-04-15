import React from "react";
import { Link } from "wouter";
import { useGetTrainingSummary, getGetTrainingSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Cpu, Database, LayoutTemplate, Layers, FlaskConical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TrainingLabHome() {
  const { data: summary, isLoading, error } = useGetTrainingSummary({
    query: {
      queryKey: getGetTrainingSummaryQueryKey()
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-5 w-[400px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Failed to load training summary.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Training Lab</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Everything you need to train AI models from scratch using your own GPU. Choose a model type, follow step-by-step paths, and access open datasets.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Button asChild size="lg">
            <Link href="/training/types">Explore Model Types</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/training/paths">View All Training Paths</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Model Types</CardTitle>
            <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalModelTypes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Training Paths</CardTitle>
            <FlaskConical className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalPaths}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Datasets</CardTitle>
            <Database className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalDatasets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Steps</CardTitle>
            <Layers className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalSteps}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Model Architectures</h2>
          <Button asChild variant="link">
            <Link href="/training/types">View all types &rarr;</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.modelTypes.map((type) => (
            <Card key={type.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor: type.color }}
                  >
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <CardDescription>
                      <span className="font-mono text-xs">{type.gpuVramMin}GB - {type.gpuVramRecommended}GB VRAM</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{type.description}</p>
                <div className="flex flex-wrap gap-2">
                  {type.useCases.slice(0, 2).map((useCase, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{useCase}</Badge>
                  ))}
                  {type.useCases.length > 2 && (
                    <Badge variant="secondary" className="text-xs">+{type.useCases.length - 2}</Badge>
                  )}
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-border/50 bg-muted/20">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><FlaskConical className="w-3.5 h-3.5" /> {type.pathCount} paths</span>
                  <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> {type.datasetCount} sets</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/training/types/${type.id}`}>View &rarr;</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
