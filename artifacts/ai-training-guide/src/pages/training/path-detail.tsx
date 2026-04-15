import React from "react";
import { Link, useParams } from "wouter";
import { useGetTrainingPath, getGetTrainingPathQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Cpu, FlaskConical, Layers, ArrowLeft, Link as LinkIcon, Lightbulb, TerminalSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PathDetail() {
  const { id } = useParams();
  const pathId = id ? parseInt(id, 10) : undefined;

  const { data: path, isLoading, error } = useGetTrainingPath(
    pathId as number,
    { query: { enabled: !!pathId, queryKey: getGetTrainingPathQueryKey(pathId as number) } }
  );

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Training path not found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/training/paths">Back to Training Paths</Link>
        </Button>
      </div>
    );
  }

  const vramColor = 
    path.gpuVramRequired <= 8 ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900" :
    path.gpuVramRequired <= 16 ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900" : 
    "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900";

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-32">
      <Button asChild variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
        <Link href="/training/paths" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Paths
        </Link>
      </Button>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-background">
              <Link href={`/training/types/${path.modelTypeId}`} className="hover:text-primary transition-colors">
                {path.modelTypeName}
              </Link>
            </Badge>
            <Badge variant={
              path.difficulty === 'beginner' ? 'default' : 
              path.difficulty === 'intermediate' ? 'secondary' : 'destructive'
            } className={
              path.difficulty === 'beginner' ? 'bg-emerald-500' :
              path.difficulty === 'intermediate' ? 'bg-amber-500 text-amber-950' : ''
            }>
              {path.difficulty}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{path.name}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {path.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {path.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {path.canStack && (
          <Alert className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
            <Layers className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
            <AlertTitle className="font-semibold text-amber-800 dark:text-amber-300">Stackable Architecture</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400 mt-1">
              {path.stackNote}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps</span>
            <div className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-muted-foreground" /> {path.totalSteps}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Time</span>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" /> {path.estimatedHours}h
            </div>
          </div>
          <div className="space-y-1 col-span-2 md:col-span-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hardware Req.</span>
            <div className={`text-xl font-mono font-bold flex items-center gap-2 px-3 py-1.5 rounded-md border w-fit ${vramColor}`}>
              <Cpu className="w-5 h-5" /> {path.gpuVramRequired}GB VRAM
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-4">Training Steps</h2>
        
        <Accordion type="single" collapsible defaultValue="step-1" className="w-full space-y-4">
          {path.steps.sort((a, b) => a.stepOrder - b.stepOrder).map((step) => (
            <AccordionItem key={step.id} value={`step-${step.stepOrder}`} className="border rounded-xl bg-card overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/50 data-[state=open]:border-b">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {step.stepOrder}
                  </div>
                  <div className="text-lg font-semibold">{step.title}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 space-y-8 bg-card">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-base text-foreground/90 leading-relaxed">{step.description}</p>
                </div>

                {step.codeSnippet && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <TerminalSquare className="w-4 h-4" /> Code Example
                    </div>
                    <div className="rounded-lg overflow-hidden border border-border">
                      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-[#0d1117] text-[#c9d1d9] m-0">
                        <code>{step.codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {(step.tips || (step.resources && step.resources.length > 0)) && (
                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                    {step.tips && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                          <Lightbulb className="w-4 h-4" /> Pro Tip
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-lg text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
                          {step.tips}
                        </div>
                      </div>
                    )}
                    
                    {step.resources && step.resources.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                          <LinkIcon className="w-4 h-4" /> Resources
                        </div>
                        <ul className="space-y-2">
                          {step.resources.map((res, idx) => (
                            <li key={idx}>
                              <a href={res} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-start gap-2 group">
                                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary shrink-0 transition-colors" />
                                <span className="underline decoration-border group-hover:decoration-primary/50 underline-offset-4 break-all">{res}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
