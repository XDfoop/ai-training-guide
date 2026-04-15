import { Router } from "express";
import { db, modelTypesTable, trainingPathsTable, trainingStepsTable, datasetsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { GetTrainingPathParams, ListTrainingPathsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/training/model-types", async (req, res) => {
  const types = await db.select().from(modelTypesTable);

  const pathCounts = await db
    .select({ modelTypeId: trainingPathsTable.modelTypeId, count: count() })
    .from(trainingPathsTable)
    .groupBy(trainingPathsTable.modelTypeId);

  const datasetCounts = await db
    .select({ modelTypeId: datasetsTable.modelTypeId, count: count() })
    .from(datasetsTable)
    .groupBy(datasetsTable.modelTypeId);

  const pathMap = new Map(pathCounts.map((r) => [r.modelTypeId, Number(r.count)]));
  const datasetMap = new Map(datasetCounts.map((r) => [r.modelTypeId, Number(r.count)]));

  res.json(
    types.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      icon: t.icon,
      color: t.color,
      gpuVramMin: t.gpuVramMin,
      gpuVramRecommended: t.gpuVramRecommended,
      examples: t.examples,
      useCases: t.useCases,
      pathCount: pathMap.get(t.id) ?? 0,
      datasetCount: datasetMap.get(t.id) ?? 0,
    }))
  );
});

router.get("/training/summary", async (req, res) => {
  const types = await db.select().from(modelTypesTable);
  const [pathsCount] = await db.select({ count: count() }).from(trainingPathsTable);
  const [datasetsCount] = await db.select({ count: count() }).from(datasetsTable);
  const [stepsCount] = await db.select({ count: count() }).from(trainingStepsTable);

  const pathCounts = await db
    .select({ modelTypeId: trainingPathsTable.modelTypeId, count: count() })
    .from(trainingPathsTable)
    .groupBy(trainingPathsTable.modelTypeId);
  const datasetCounts = await db
    .select({ modelTypeId: datasetsTable.modelTypeId, count: count() })
    .from(datasetsTable)
    .groupBy(datasetsTable.modelTypeId);

  const pathMap = new Map(pathCounts.map((r) => [r.modelTypeId, Number(r.count)]));
  const datasetMap = new Map(datasetCounts.map((r) => [r.modelTypeId, Number(r.count)]));

  res.json({
    totalModelTypes: types.length,
    totalPaths: Number(pathsCount?.count ?? 0),
    totalDatasets: Number(datasetsCount?.count ?? 0),
    totalSteps: Number(stepsCount?.count ?? 0),
    modelTypes: types.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      icon: t.icon,
      color: t.color,
      gpuVramMin: t.gpuVramMin,
      gpuVramRecommended: t.gpuVramRecommended,
      examples: t.examples,
      useCases: t.useCases,
      pathCount: pathMap.get(t.id) ?? 0,
      datasetCount: datasetMap.get(t.id) ?? 0,
    })),
  });
});

router.get("/training/paths", async (req, res) => {
  const parsed = ListTrainingPathsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }

  const rows = await db
    .select({
      id: trainingPathsTable.id,
      modelTypeId: trainingPathsTable.modelTypeId,
      name: trainingPathsTable.name,
      slug: trainingPathsTable.slug,
      description: trainingPathsTable.description,
      difficulty: trainingPathsTable.difficulty,
      estimatedHours: trainingPathsTable.estimatedHours,
      gpuVramRequired: trainingPathsTable.gpuVramRequired,
      canStack: trainingPathsTable.canStack,
      stackNote: trainingPathsTable.stackNote,
      tags: trainingPathsTable.tags,
      modelTypeName: modelTypesTable.name,
    })
    .from(trainingPathsTable)
    .innerJoin(modelTypesTable, eq(trainingPathsTable.modelTypeId, modelTypesTable.id));

  const stepCounts = await db
    .select({ pathId: trainingStepsTable.pathId, count: count() })
    .from(trainingStepsTable)
    .groupBy(trainingStepsTable.pathId);
  const stepMap = new Map(stepCounts.map((s) => [s.pathId, Number(s.count)]));

  let filtered = rows;
  if (parsed.data.modelTypeId) {
    filtered = filtered.filter((r) => r.modelTypeId === parsed.data.modelTypeId);
  }
  if (parsed.data.difficulty) {
    filtered = filtered.filter((r) => r.difficulty === parsed.data.difficulty);
  }

  res.json(
    filtered.map((r) => ({
      id: r.id,
      modelTypeId: r.modelTypeId,
      modelTypeName: r.modelTypeName,
      name: r.name,
      slug: r.slug,
      description: r.description,
      difficulty: r.difficulty,
      totalSteps: stepMap.get(r.id) ?? 0,
      estimatedHours: r.estimatedHours,
      gpuVramRequired: r.gpuVramRequired,
      canStack: r.canStack,
      stackNote: r.stackNote,
      tags: r.tags,
    }))
  );
});

router.get("/training/paths/:id", async (req, res) => {
  const parsed = GetTrainingPathParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const rows = await db
    .select({
      id: trainingPathsTable.id,
      modelTypeId: trainingPathsTable.modelTypeId,
      name: trainingPathsTable.name,
      slug: trainingPathsTable.slug,
      description: trainingPathsTable.description,
      difficulty: trainingPathsTable.difficulty,
      estimatedHours: trainingPathsTable.estimatedHours,
      gpuVramRequired: trainingPathsTable.gpuVramRequired,
      canStack: trainingPathsTable.canStack,
      stackNote: trainingPathsTable.stackNote,
      tags: trainingPathsTable.tags,
      modelTypeName: modelTypesTable.name,
    })
    .from(trainingPathsTable)
    .innerJoin(modelTypesTable, eq(trainingPathsTable.modelTypeId, modelTypesTable.id))
    .where(eq(trainingPathsTable.id, parsed.data.id));

  if (!rows[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const steps = await db
    .select()
    .from(trainingStepsTable)
    .where(eq(trainingStepsTable.pathId, parsed.data.id))
    .orderBy(trainingStepsTable.stepOrder);

  const r = rows[0];
  res.json({
    id: r.id,
    modelTypeId: r.modelTypeId,
    modelTypeName: r.modelTypeName,
    name: r.name,
    slug: r.slug,
    description: r.description,
    difficulty: r.difficulty,
    totalSteps: steps.length,
    estimatedHours: r.estimatedHours,
    gpuVramRequired: r.gpuVramRequired,
    canStack: r.canStack,
    stackNote: r.stackNote,
    tags: r.tags,
    steps: steps.map((s) => ({
      id: s.id,
      pathId: s.pathId,
      stepOrder: s.stepOrder,
      title: s.title,
      description: s.description,
      codeSnippet: s.codeSnippet,
      resources: s.resources,
      tips: s.tips,
    })),
  });
});

export default router;
