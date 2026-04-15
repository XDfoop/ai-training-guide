import { Router } from "express";
import { db, articlesTable, topicsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { GetArticleParams, ListArticlesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/articles/summary", async (req, res) => {
  const allArticles = await db
    .select({
      id: articlesTable.id,
      topicId: articlesTable.topicId,
      title: articlesTable.title,
      slug: articlesTable.slug,
      summary: articlesTable.summary,
      content: articlesTable.content,
      difficulty: articlesTable.difficulty,
      readingTimeMinutes: articlesTable.readingTimeMinutes,
      tags: articlesTable.tags,
      createdAt: articlesTable.createdAt,
      topicName: topicsTable.name,
    })
    .from(articlesTable)
    .innerJoin(topicsTable, eq(articlesTable.topicId, topicsTable.id));

  const byDifficulty = { beginner: 0, intermediate: 0, advanced: 0 };
  for (const a of allArticles) {
    byDifficulty[a.difficulty as keyof typeof byDifficulty]++;
  }

  const topicCountMap = new Map<string, number>();
  for (const a of allArticles) {
    topicCountMap.set(a.topicName, (topicCountMap.get(a.topicName) ?? 0) + 1);
  }

  const totalTopics = await db.select({ count: count() }).from(topicsTable);

  const featured = allArticles.slice(0, 3);

  res.json({
    totalArticles: allArticles.length,
    totalTopics: Number(totalTopics[0]?.count ?? 0),
    byDifficulty,
    byTopic: Array.from(topicCountMap.entries()).map(([topicName, count]) => ({ topicName, count })),
    featuredArticles: featured.map((a) => ({
      id: a.id,
      topicId: a.topicId,
      topicName: a.topicName,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      content: a.content,
      difficulty: a.difficulty,
      readingTimeMinutes: a.readingTimeMinutes,
      tags: a.tags,
      createdAt: a.createdAt.toISOString(),
    })),
  });
});

router.get("/articles", async (req, res) => {
  const parsed = ListArticlesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }

  let query = db
    .select({
      id: articlesTable.id,
      topicId: articlesTable.topicId,
      title: articlesTable.title,
      slug: articlesTable.slug,
      summary: articlesTable.summary,
      content: articlesTable.content,
      difficulty: articlesTable.difficulty,
      readingTimeMinutes: articlesTable.readingTimeMinutes,
      tags: articlesTable.tags,
      createdAt: articlesTable.createdAt,
      topicName: topicsTable.name,
    })
    .from(articlesTable)
    .innerJoin(topicsTable, eq(articlesTable.topicId, topicsTable.id));

  const rows = await query;

  let filtered = rows;
  if (parsed.data.topicId) {
    filtered = filtered.filter((a) => a.topicId === parsed.data.topicId);
  }
  if (parsed.data.difficulty) {
    filtered = filtered.filter((a) => a.difficulty === parsed.data.difficulty);
  }

  res.json(
    filtered.map((a) => ({
      id: a.id,
      topicId: a.topicId,
      topicName: a.topicName,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      content: a.content,
      difficulty: a.difficulty,
      readingTimeMinutes: a.readingTimeMinutes,
      tags: a.tags,
      createdAt: a.createdAt.toISOString(),
    }))
  );
});

router.get("/articles/:id", async (req, res) => {
  const parsed = GetArticleParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid article id" });
    return;
  }

  const rows = await db
    .select({
      id: articlesTable.id,
      topicId: articlesTable.topicId,
      title: articlesTable.title,
      slug: articlesTable.slug,
      summary: articlesTable.summary,
      content: articlesTable.content,
      difficulty: articlesTable.difficulty,
      readingTimeMinutes: articlesTable.readingTimeMinutes,
      tags: articlesTable.tags,
      createdAt: articlesTable.createdAt,
      topicName: topicsTable.name,
    })
    .from(articlesTable)
    .innerJoin(topicsTable, eq(articlesTable.topicId, topicsTable.id))
    .where(eq(articlesTable.id, parsed.data.id));

  if (!rows[0]) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  const a = rows[0];
  res.json({
    id: a.id,
    topicId: a.topicId,
    topicName: a.topicName,
    title: a.title,
    slug: a.slug,
    summary: a.summary,
    content: a.content,
    difficulty: a.difficulty,
    readingTimeMinutes: a.readingTimeMinutes,
    tags: a.tags,
    createdAt: a.createdAt.toISOString(),
  });
});

export default router;
