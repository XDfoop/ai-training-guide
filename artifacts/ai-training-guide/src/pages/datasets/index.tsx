import React, { useState } from "react";
import { useListDatasets, getListDatasetsQueryKey, useListModelTypes, getListModelTypesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, ExternalLink, Filter, FileText, HardDrive, ScrollText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Datasets() {
  const [modelTypeFilter, setModelTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = {
    ...(modelTypeFilter !== "all" ? { modelTypeId: parseInt(modelTypeFilter) } : {}),
    ...(categoryFilter !== "all" ? { category: categoryFilter } : {})
  };

  const { data: datasets, isLoading: isLoadingDatasets } = useListDatasets(
    queryParams,
    { query: { queryKey: getListDatasetsQueryKey(queryParams) } }
  );

  const { data: modelTypes } = useListModelTypes({
    query: { queryKey: getListModelTypesQueryKey() }
  });

  // Extract unique categories from datasets for the filter
  const categories = Array.from(new Set(datasets?.map(d => d.category) || []));

  // Local search filter
  const filteredDatasets = datasets?.filter(d => 
    searchQuery === "" || 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Open Datasets</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Curated datasets for training, fine-tuning, and evaluating your AI models.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0 w-full md:w-auto">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <div className="flex-1 w-full relative">
          <Input 
            placeholder="Search datasets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background"
          />
        </div>
        <Select value={modelTypeFilter} onValueChange={setModelTypeFilter}>
          <SelectTrigger className="w-full md:w-[220px] bg-background">
            <SelectValue placeholder="Architecture" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Architectures</SelectItem>
            {modelTypes?.map(mt => (
              <SelectItem key={mt.id} value={mt.id.toString()}>{mt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
            {/* Fallbacks if API data hasn't loaded */}
            {categories.length === 0 && (
              <>
                <SelectItem value="Text">Text</SelectItem>
                <SelectItem value="Images">Images</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {isLoadingDatasets ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
      ) : filteredDatasets && filteredDatasets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDatasets.map(dataset => (
            <Card key={dataset.id} className="flex flex-col h-full hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                    {dataset.category}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {dataset.modelTypeName}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 leading-tight">{dataset.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm mt-2">
                  {dataset.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pb-4 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {dataset.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] py-0">{tag}</Badge>
                  ))}
                  {dataset.tags.length > 3 && (
                    <Badge variant="outline" className="text-[10px] py-0">+{dataset.tags.length - 3}</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <HardDrive className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono truncate">{dataset.sizeGb}GB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono truncate">{dataset.format}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ScrollText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate" title={dataset.license}>{dataset.license}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Database className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono truncate" title={dataset.recordCount}>{dataset.recordCount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="default" className="w-full flex items-center gap-2">
                  <a href={dataset.sourceUrl} target="_blank" rel="noreferrer">
                    View Source <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <Database className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No datasets found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
          <Button variant="outline" className="mt-4" onClick={() => { 
            setModelTypeFilter("all"); 
            setCategoryFilter("all");
            setSearchQuery("");
          }}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
