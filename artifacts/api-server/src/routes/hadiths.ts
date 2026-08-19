import { Router, type IRouter } from "express";
import {
  and,
  asc,
  count,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";
import {
  db,
  hadithBooksTable,
  hadithsTable,
  narratorsTable,
} from "@workspace/db";
import {
  GetHadithParams,
  GetHadithResponse,
  GetNarratorParams,
  GetNarratorResponse,
  ListHadithBooksResponse,
  ListHadithsQueryParams,
  ListHadithsResponse,
  ListNarratorHadithsParams,
  ListNarratorHadithsResponse,
  ListNarratorsQueryParams,
  ListNarratorsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const hadithSelection = {
  id: hadithsTable.id,
  bookId: hadithsTable.bookId,
  bookName: hadithBooksTable.title,
  chapter: hadithsTable.chapter,
  number: hadithsTable.number,
  textAr: hadithsTable.textAr,
  grade: hadithsTable.grade,
  narratorId: narratorsTable.id,
  narratorName: narratorsTable.name,
  narratorGeneration: narratorsTable.generation,
  narratorReliability: narratorsTable.reliability,
  narratorBio: narratorsTable.bio,
  narratorHadithCount: narratorsTable.hadithCount,
};

type HadithRow = {
  id: string;
  bookId: string;
  bookName: string | null;
  chapter: string;
  number: number;
  textAr: string;
  grade: string;
  narratorId: string | null;
  narratorName: string | null;
  narratorGeneration: string | null;
  narratorReliability: string | null;
  narratorBio: string | null;
  narratorHadithCount: number | null;
};

function hadithResponse(row: HadithRow) {
  return {
    id: row.id,
    bookId: row.bookId,
    bookName: row.bookName ?? "مصدر غير محدد",
    chapter: row.chapter,
    number: row.number,
    textAr: row.textAr,
    grade: row.grade,
    sourceNarrators:
      row.narratorId &&
      row.narratorName &&
      row.narratorGeneration &&
      row.narratorReliability &&
      row.narratorBio &&
      row.narratorHadithCount !== null
        ? [
            {
              id: row.narratorId,
              name: row.narratorName,
              generation: row.narratorGeneration,
              reliability: row.narratorReliability,
              bio: row.narratorBio,
              hadithCount: row.narratorHadithCount,
            },
          ]
        : [],
  };
}

function rawPathId(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function findHadiths(
  whereClause: SQL | undefined,
  page: number,
  pageSize: number,
) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(hadithsTable)
    .leftJoin(hadithBooksTable, eq(hadithsTable.bookId, hadithBooksTable.id))
    .leftJoin(narratorsTable, eq(hadithsTable.narratorId, narratorsTable.id))
    .where(whereClause);

  const rows = await db
    .select(hadithSelection)
    .from(hadithsTable)
    .leftJoin(hadithBooksTable, eq(hadithsTable.bookId, hadithBooksTable.id))
    .leftJoin(narratorsTable, eq(hadithsTable.narratorId, narratorsTable.id))
    .where(whereClause)
    .orderBy(asc(hadithBooksTable.sourceId), asc(hadithsTable.number))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const numericTotal = Number(total);
  return {
    items: rows.map(hadithResponse),
    total: numericTotal,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(numericTotal / pageSize)),
  };
}

router.get("/hadiths", async (req, res): Promise<void> => {
  const parsed = ListHadithsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid hadith search");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { query, bookId, narratorId, page, pageSize } = parsed.data;
  const conditions: SQL[] = [];

  if (query?.trim()) {
    const term = `%${query.trim()}%`;
    conditions.push(
      or(
        ilike(hadithsTable.textAr, term),
        ilike(hadithsTable.chapter, term),
        ilike(hadithBooksTable.title, term),
        ilike(narratorsTable.name, term),
      )!,
    );
  }
  if (bookId) conditions.push(eq(hadithsTable.bookId, bookId));
  if (narratorId) conditions.push(eq(hadithsTable.narratorId, narratorId));

  const data = await findHadiths(
    conditions.length ? and(...conditions) : undefined,
    page,
    pageSize,
  );
  res.json(ListHadithsResponse.parse(data));
});

router.get("/hadiths/:id", async (req, res): Promise<void> => {
  const parsed = GetHadithParams.safeParse({ id: rawPathId(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select(hadithSelection)
    .from(hadithsTable)
    .leftJoin(hadithBooksTable, eq(hadithsTable.bookId, hadithBooksTable.id))
    .leftJoin(narratorsTable, eq(hadithsTable.narratorId, narratorsTable.id))
    .where(eq(hadithsTable.id, parsed.data.id));

  if (!row) {
    res.status(404).json({ error: "Hadith not found" });
    return;
  }
  res.json(GetHadithResponse.parse(hadithResponse(row)));
});

router.get("/books", async (_req, res): Promise<void> => {
  const books = await db
    .select({
      id: hadithBooksTable.id,
      title: hadithBooksTable.title,
      author: hadithBooksTable.author,
      description: hadithBooksTable.description,
      hadithCount: hadithBooksTable.hadithCount,
    })
    .from(hadithBooksTable)
    .orderBy(asc(hadithBooksTable.sourceId));
  res.json(ListHadithBooksResponse.parse(books));
});

router.get("/narrators", async (req, res): Promise<void> => {
  const parsed = ListNarratorsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { query, page, pageSize } = parsed.data;
  const whereClause = query?.trim()
    ? ilike(narratorsTable.name, `%${query.trim()}%`)
    : undefined;
  const [{ total }] = await db
    .select({ total: count() })
    .from(narratorsTable)
    .where(whereClause);
  const narrators = await db
    .select()
    .from(narratorsTable)
    .where(whereClause)
    .orderBy(asc(narratorsTable.name))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const numericTotal = Number(total);
  res.json(
    ListNarratorsResponse.parse({
      items: narrators,
      total: numericTotal,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(numericTotal / pageSize)),
    }),
  );
});

router.get("/narrators/:id", async (req, res): Promise<void> => {
  const parsed = GetNarratorParams.safeParse({ id: rawPathId(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [narrator] = await db
    .select()
    .from(narratorsTable)
    .where(eq(narratorsTable.id, parsed.data.id));
  if (!narrator) {
    res.status(404).json({ error: "Narrator not found" });
    return;
  }
  res.json(GetNarratorResponse.parse(narrator));
});

router.get("/narrators/:id/hadiths", async (req, res): Promise<void> => {
  const parsed = ListNarratorHadithsParams.safeParse({
    id: rawPathId(req.params.id),
  });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = await findHadiths(
    eq(hadithsTable.narratorId, parsed.data.id),
    1,
    50,
  );
  res.json(ListNarratorHadithsResponse.parse(data));
});

export default router;