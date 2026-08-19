#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter @workspace/db run push
pnpm --filter @workspace/scripts run import:hadith-corpus
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "create extension if not exists pg_trgm; create index if not exists hadiths_text_ar_trgm_idx on hadiths using gin (text_ar gin_trgm_ops); create index if not exists hadiths_narrator_idx on hadiths (narrator_id);"
