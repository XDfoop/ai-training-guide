import { Router } from "express";
import { db, datasetsTable, modelTypesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListDatasetsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/datasets", async (req, res) => {
  const parsed = ListDatasetsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }

  const rows = await db
    .select({
      id: datasetsTable.id,
      modelTypeId: datasetsTable.modelTypeId,
      name: datasetsTable.name,
      description: datasetsTable.description,
      url: datasetsTable.url,
      sourceUrl: datasetsTable.sourceUrl,
      sizeGb: datasetsTable.sizeGb,
      format: datasetsTable.format,
      license: datasetsTable.license,
      category: datasetsTable.category,
      tags: datasetsTable.tags,
      recordCount: datasetsTable.recordCount,
      modelTypeName: modelTypesTable.name,
    })
    .from(datasetsTable)
    .innerJoin(modelTypesTable, eq(datasetsTable.modelTypeId, modelTypesTable.id));

  let filtered = rows;
  if (parsed.data.modelTypeId) {
    filtered = filtered.filter((r) => r.modelTypeId === parsed.data.modelTypeId);
  }
  if (parsed.data.category) {
    filtered = filtered.filter((r) => r.category === parsed.data.category);
  }

  res.json(
    filtered.map((r) => ({
      id: r.id,
      modelTypeId: r.modelTypeId,
      modelTypeName: r.modelTypeName,
      name: r.name,
      description: r.description,
      url: r.url,
      sourceUrl: r.sourceUrl,
      sizeGb: r.sizeGb,
      format: r.format,
      license: r.license,
      category: r.category,
      tags: r.tags,
      recordCount: r.recordCount,
    }))
  );
});

export default router;
