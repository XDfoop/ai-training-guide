import React, { useState } from "react";
import { Link } from "wouter";
import { useListTrainingPaths, getListTrainingPathsQueryKey, useListModelTypes, getListModelTypesQueryKey, ListTrainingPathsDifficulty } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Cpu, FlaskConical, Layers, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TrainingPaths() {
  const [modelTypeFilter, setModelTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const queryParams = {
    ...(modelTypeFilter !== "all" ? { modelTypeId: parseInt(modelTypeFilter) } : {}),
    ...(difficultyFilter !== "all" ? { difficulty: difficultyFilter as ListTrainingPathsDifficulty } : {})
  };

  const { data: paths, isLoading: isLoadingPaths } = useListTrainingPaths(
    queryParams,
    { query: { queryKey: getListTrainingPathsQueryKey(queryParams) } }
  );

  const { data: modelTypes } = useListModelTypes({
    query: { queryKey: getListModelTypesQueryKey() }
  });

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Training Paths</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Step-by-step guides to train models from scratch or fine-tune existing ones.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <Select value={modelTypeFilter} onValueChange={setModelTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="Architecture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Architectures</SelectItem>
            {modelTypes?.map(mt => (
              <SelectItem key={mt.id} value={mt.id.toString()}>{mt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingPaths ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : paths && paths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map(path => (
            <Card key={path.id} className="flex flex-col h-full hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {path.modelTypeName}
                    </div>
                    <CardTitle className="line-clamp-2 text-xl">{path.name}</CardTitle>
                  </div>
                  <Badge variant={
                    path.difficulty === 'beginner' ? 'default' : 
                    path.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                  } className={`shrink-0 ${
                    path.difficulty === 'beginner' ? 'bg-emerald-500 hover:bg-emerald-600' :
                    path.difficulty === 'intermediate' ? 'bg-amber-500 hover:bg-amber-600 text-amber-950' : ''
                  }`}>
                    {path.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <CardDescription className="line-clamp-3 text-base">
                  {path.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {path.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs bg-background/50">{tag}</Badge>
                  ))}
                  {path.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-background/50">+{path.tags.length - 3}</Badge>
                  )}
                </div>
                
                {path.canStack && (
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md border border-amber-200 dark:border-amber-800">
                    <Layers className="w-3.5 h-3.5" /> Stackable Path
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/10 border-t flex justify-between items-center py-4">
                <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {path.estimatedHours}h est.</span>
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> 
                    <span className={
                      path.gpuVramRequired <= 8 ? "text-emerald-600 dark:text-emerald-400" :
                      path.gpuVramRequired <= 16 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                    }>{path.gpuVramRequired}GB VRAM</span>
                  </span>
                </div>
                <Button asChild>
                  <Link href={`/training/paths/${path.id}`}>Start Path</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No paths found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setModelTypeFilter("all"); setDifficultyFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
