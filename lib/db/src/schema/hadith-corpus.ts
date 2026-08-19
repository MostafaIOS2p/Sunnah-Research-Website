import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hadithBooksTable = pgTable("hadith_books", {
  id: varchar("id", { length: 80 }).primaryKey(),
  sourceId: integer("source_id").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull().default(""),
  hadithCount: integer("hadith_count").notNull().default(0),
});

export const narratorsTable = pgTable("narrators", {
  id: varchar("id", { length: 96 }).primaryKey(),
  name: text("name").notNull(),
  generation: text("generation").notNull().default("غير محدد"),
  reliability: text("reliability").notNull().default("لم يُدرج حكمه في المصدر"),
  bio: text("bio").notNull().default("راوٍ كما ورد اسمه في مصدر الحديث."),
  hadithCount: integer("hadith_count").notNull().default(0),
});

export const hadithsTable = pgTable("hadiths", {
  id: varchar("id", { length: 120 }).primaryKey(),
  sourceId: integer("source_id").notNull(),
  bookId: varchar("book_id", { length: 80 })
    .notNull()
    .references(() => hadithBooksTable.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  chapter: text("chapter").notNull(),
  textAr: text("text_ar").notNull(),
  grade: text("grade").notNull().default("غير مصنف"),
  narratorId: varchar("narrator_id", { length: 96 }).references(
    () => narratorsTable.id,
    { onDelete: "set null" },
  ),
  narratorsChain: text("narrators_chain").array().notNull().default([]),
});

export const hadithBooksRelations = relations(hadithBooksTable, ({ many }) => ({
  hadiths: many(hadithsTable),
}));

export const narratorsRelations = relations(narratorsTable, ({ many }) => ({
  hadiths: many(hadithsTable),
}));

export const hadithsRelations = relations(hadithsTable, ({ one }) => ({
  book: one(hadithBooksTable, {
    fields: [hadithsTable.bookId],
    references: [hadithBooksTable.id],
  }),
  narrator: one(narratorsTable, {
    fields: [hadithsTable.narratorId],
    references: [narratorsTable.id],
  }),
}));

export const insertHadithBookSchema = createInsertSchema(hadithBooksTable);
export const insertNarratorSchema = createInsertSchema(narratorsTable);
export const insertHadithSchema = createInsertSchema(hadithsTable);

export type HadithBook = typeof hadithBooksTable.$inferSelect;
export type Narrator = typeof narratorsTable.$inferSelect;
export type Hadith = typeof hadithsTable.$inferSelect;
export type InsertHadithBook = z.infer<typeof insertHadithBookSchema>;
export type InsertNarrator = z.infer<typeof insertNarratorSchema>;
export type InsertHadith = z.infer<typeof insertHadithSchema>;