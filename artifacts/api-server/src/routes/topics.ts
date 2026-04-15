import { Router } from "express";
import { db, topicsTable, articlesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { GetTopicParams } from "@workspace/api-zod";

const router = Router();

router.get("/topics", async (req, res) => {
  const topics = await db.select().from(topicsTable);
  const articleCounts = await db
    .select({ topicId: articlesTable.topicId, count: count() })
    .from(articlesTable)
    .groupBy(articlesTable.topicId);

  const countMap = new Map(articleCounts.map((r) => [r.topicId, Number(r.count)]));

  const result = topics.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    icon: t.icon,
    color: t.color,
    articleCount: countMap.get(t.id) ?? 0,
  }));

  res.json(result);
});

router.get("/topics/featured", async (req, res) => {
  const topics = await db.select().from(topicsTable).limit(4);

  const result = await Promise.all(
    topics.map(async (t) => {
      const articles = await db
        .select()
        .from(articlesTable)
        .where(eq(articlesTable.topicId, t.id))
        .limit(3);

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        icon: t.icon,
        color: t.color,
        articles: articles.map((a) => ({
          id: a.id,
          topicId: a.topicId,
          topicName: t.name,
          title: a.title,
          slug: a.slug,
          summary: a.summary,
          content: a.content,
          difficulty: a.difficulty,
          readingTimeMinutes: a.readingTimeMinutes,
          tags: a.tags,
          createdAt: a.createdAt.toISOString(),
        })),
      };
    })
  );

  res.json(result);
});

router.get("/topics/:id", async (req, res) => {
  const parsed = GetTopicParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid topic id" });
    return;
  }

  const [topic] = await db.select().from(topicsTable).where(eq(topicsTable.id, parsed.data.id));
  if (!topic) {
    res.status(404).json({ error: "Topic not found" });
    return;
  }

  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.topicId, topic.id));

  res.json({
    id: topic.id,
    name: topic.name,
    slug: topic.slug,
    description: topic.description,
    icon: topic.icon,
    color: topic.color,
    articles: articles.map((a) => ({
      id: a.id,
      topicId: a.topicId,
      topicName: topic.name,
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

export default router;
