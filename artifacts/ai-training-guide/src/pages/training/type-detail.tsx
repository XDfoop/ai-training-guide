import React from "react";
import { Link, useParams } from "wouter";
import { useListTrainingPaths, getListTrainingPathsQueryKey, useListDatasets, getListDatasetsQueryKey, useListModelTypes, getListModelTypesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Cpu, FlaskConical, Database, ExternalLink, ArrowLeft, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TypeDetail() {
  const { id } = useParams();
  const typeId = id ? parseInt(id, 10) : undefined;

  const { data: modelTypes, isLoading: isLoadingTypes } = useListModelTypes({
    query: {
      queryKey: getListModelTypesQueryKey()
    }
  });

  const { data: paths, isLoading: isLoadingPaths } = useListTrainingPaths(
    { modelTypeId: typeId },
    { query: { enabled: !!typeId, queryKey: getListTrainingPathsQueryKey({ modelTypeId: typeId }) } }
  );

  const { data: datasets, isLoading: isLoadingDatasets } = useListDatasets(
    { modelTypeId: typeId },
    { query: { enabled: !!typeId, queryKey: getListDatasetsQueryKey({ modelTypeId: typeId }) } }
  );

  const modelType = modelTypes?.find(t => t.id === typeId);

  if (isLoadingTypes || isLoadingPaths || isLoadingDatasets) {
    return (
      <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-[150px]" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-[400px]" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!modelType) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Model type not found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/training/types">Back to Model Types</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="space-y-6">
        <Button asChild variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
          <Link href="/training/types" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Architectures
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: modelType.color }}
              >
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{modelType.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                  <Badge variant="outline" className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                    Min VRAM: {modelType.gpuVramMin}GB
                  </Badge>
                  <Badge variant="outline" className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    Rec VRAM: {modelType.gpuVramRecommended}GB
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {modelType.description}
            </p>
          </div>
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 md:w-64">
            <div className="w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Popular Models</span>
              <div className="flex flex-wrap gap-1.5">
                {modelType.examples.map(ex => (
                  <Badge key={ex} variant="secondary" className="bg-secondary/50 hover:bg-secondary">{ex}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="paths" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
          <TabsTrigger value="paths" className="py-2 px-6 flex items-center gap-2">
            <FlaskConical className="w-4 h-4" /> Training Paths ({paths?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="datasets" className="py-2 px-6 flex items-center gap-2">
            <Database className="w-4 h-4" /> Datasets ({datasets?.length || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="paths" className="mt-6 focus-visible:outline-none">
          {paths && paths.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paths.map(path => (
                <Card key={path.id} className="flex flex-col hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 pr-4">
                        <CardTitle className="line-clamp-1">{path.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                      </div>
                      <Badge variant={
                        path.difficulty === 'beginner' ? 'default' : 
                        path.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                      } className={
                        path.difficulty === 'beginner' ? 'bg-emerald-500 hover:bg-emerald-600' :
                        path.difficulty === 'intermediate' ? 'bg-amber-500 hover:bg-amber-600 text-amber-950' : ''
                      }>
                        {path.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {path.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    {path.canStack && (
                      <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md border border-amber-200 dark:border-amber-800">
                        <Layers className="w-3.5 h-3.5" /> Stackable Path
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/20 border-t flex justify-between items-center py-3">
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {path.estimatedHours}h</span>
                      <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> {path.gpuVramRequired}GB</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/training/paths/${path.id}`}>Start Path</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
              <FlaskConical className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No paths available</h3>
              <p className="text-muted-foreground mt-1">Training paths for this architecture are coming soon.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="datasets" className="mt-6 focus-visible:outline-none">
          {datasets && datasets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {datasets.map(dataset => (
                <Card key={dataset.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-base line-clamp-1">{dataset.name}</CardTitle>
                      <Badge variant="outline" className="shrink-0">{dataset.category}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2 text-xs">
                      {dataset.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-muted/30 p-2 rounded">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Size</span>
                        {dataset.sizeGb}GB
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Format</span>
                        {dataset.format}
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">License</span>
                        {dataset.license}
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Records</span>
                        {dataset.recordCount}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild variant="outline" className="w-full flex items-center gap-2">
                      <a href={dataset.sourceUrl} target="_blank" rel="noreferrer">
                        View Source <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
              <Database className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No datasets found</h3>
              <p className="text-muted-foreground mt-1">There are no specific datasets curated for this architecture yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
