import { createHash } from "node:crypto";
import {
  db,
  hadithBooksTable,
  hadithsTable,
  narratorsTable,
  pool,
} from "@workspace/db";
import { sql } from "drizzle-orm";

const DATASET_TAG = "v1.2.0";
const DATASET_BASE_URL =
  `https://raw.githubusercontent.com/AhmedBaset/hadith-json/${DATASET_TAG}/db/by_book`;

const books = [
  ["bukhari", "the_9_books/bukhari.json"],
  ["muslim", "the_9_books/muslim.json"],
  ["abudawud", "the_9_books/abudawud.json"],
  ["tirmidhi", "the_9_books/tirmidhi.json"],
  ["nasai", "the_9_books/nasai.json"],
  ["ibnmajah", "the_9_books/ibnmajah.json"],
  ["malik", "the_9_books/malik.json"],
  ["ahmed", "the_9_books/ahmed.json"],
  ["darimi", "the_9_books/darimi.json"],
  ["riyad_assalihin", "other_books/riyad_assalihin.json"],
  ["shamail_muhammadiyah", "other_books/shamail_muhammadiyah.json"],
  ["bulugh_almaram", "other_books/bulugh_almaram.json"],
  ["aladab_almufrad", "other_books/aladab_almufrad.json"],
  ["mishkat_almasabih", "other_books/mishkat_almasabih.json"],
  ["nawawi40", "forties/nawawi40.json"],
  ["qudsi40", "forties/qudsi40.json"],
  ["shahwaliullah40", "forties/shahwaliullah40.json"],
] as const;

type SourceHadith = {
  id: number;
  idInBook?: number;
  chapterId: number;
  arabic: string;
  english?: { narrator?: string };
};

type SourceBook = {
  id: number;
  metadata: {
    length: number;
    arabic: { title: string; author: string; introduction?: string };
  };
  hadiths: SourceHadith[];
};

function narratorName(raw?: string): string | null {
  const value = raw
    ?.replace(/^Narrated\s+/i, "")
    .replace(/:$/, "")
    .replace(/\s+/g, " ")
    .trim();
  return value || null;
}

function narratorId(name: string): string {
  return `n-${createHash("sha256").update(name).digest("hex").slice(0, 24)}`;
}

function gradeForBook(bookId: string): string {
  if (bookId === "bukhari" || bookId === "muslim") return "صحيح";
  return "غير مصنف";
}

async function fetchBook(path: string): Promise<SourceBook> {
  const response = await fetch(`${DATASET_BASE_URL}/${path}`);
  if (!response.ok) {
    throw new Error(`Could not download ${path}: ${response.status}`);
  }
  return response.json() as Promise<SourceBook>;
}

async function main(): Promise<void> {
  for (const [bookId, sourcePath] of books) {
    const source = await fetchBook(sourcePath);
    const metadata = source.metadata.arabic;

    await db
      .insert(hadithBooksTable)
      .values({
        id: bookId,
        sourceId: source.id,
        title: metadata.title,
        author: metadata.author,
        description: metadata.introduction ?? "",
        hadithCount: source.hadiths.length,
      })
      .onConflictDoUpdate({
        target: hadithBooksTable.id,
        set: {
          title: metadata.title,
          author: metadata.author,
          description: metadata.introduction ?? "",
          hadithCount: source.hadiths.length,
        },
      });

    const narratorNames = new Set<string>();
    for (const item of source.hadiths) {
      const name = narratorName(item.english?.narrator);
      if (name) narratorNames.add(name);
    }

    const narratorRows = [...narratorNames].map((name) => ({
      id: narratorId(name),
      name,
    }));
    for (let index = 0; index < narratorRows.length; index += 500) {
      await db
        .insert(narratorsTable)
        .values(narratorRows.slice(index, index + 500))
        .onConflictDoNothing({ target: narratorsTable.id });
    }

    const chunkSize = 500;
    for (let index = 0; index < source.hadiths.length; index += chunkSize) {
      const batch = source.hadiths.slice(index, index + chunkSize).map((item) => {
        const name = narratorName(item.english?.narrator);
        const rawNarratorId = name ? narratorId(name) : null;
        return {
          id: `${bookId}-${item.id}`,
          sourceId: item.id,
          bookId,
          number: item.idInBook ?? item.id,
          chapter: `باب ${item.chapterId}`,
          textAr: item.arabic.trim(),
          grade: gradeForBook(bookId),
          narratorId: rawNarratorId,
          narratorsChain: name ? [name] : [],
        };
      });

      await db
        .insert(hadithsTable)
        .values(batch)
        .onConflictDoNothing({ target: hadithsTable.id });
    }

    process.stdout.write(`Imported ${metadata.title}: ${source.hadiths.length} hadiths\n`);
  }

  await db.execute(sql`update narrators set hadith_count = 0`);
  await db.execute(sql`
    update narrators as narrator
    set hadith_count = counts.total
    from (
      select narrator_id, count(*)::integer as total
      from hadiths
      where narrator_id is not null
      group by narrator_id
    ) as counts
    where narrator.id = counts.narrator_id
  `);

  await pool.end();
}

main().catch(async (error: unknown) => {
  process.stderr.write(`Hadith corpus import failed: ${String(error)}\n`);
  await pool.end();
  process.exitCode = 1;
});