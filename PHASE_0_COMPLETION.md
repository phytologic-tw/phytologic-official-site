# Phase 0 Completion Report

> Date: 2026-05-28  
> Scope: LINE / LIFF member schema technical debt repair  
> Status: Completed, with one verification note on `assessment_reports` RLS

## Summary

Phase 0 is complete. The production Supabase schema has been migrated manually through Supabase SQL Editor, and the post-migration checks confirm that `profiles` is now the canonical LINE member table.

The legacy `line_members` table has been removed from the exposed REST schema. `daily_checkins` and `daily_ai_messages` now resolve their member foreign-key relationships through `profiles(id)`.

## Completed Items

- Rotated away from using the exposed service role key in this workflow.
- Expanded `profiles` for LINE / LIFF member identity, profile data, promoter tracking, points, and check-in state.
- Removed `line_members` from the active schema.
- Repaired `daily_checkins.member_id -> profiles(id)`.
- Repaired `daily_ai_messages.member_id -> profiles(id)`.
- Created / verified `promoters`.
- Created / verified `dr_marvin_reports`.
- Updated frontend daily message lookup/write behavior to use `sent_date`.
- Added `.env.*` to `.gitignore` so local phase env files are not accidentally committed.

## Verification Results

Verified with anon-key, read-only Supabase REST schema checks:

| Check | Result |
| --- | --- |
| `profiles` required columns | PASS |
| `daily_checkins` required columns | PASS |
| `daily_checkins.member_id` FK relationship | PASS |
| `daily_ai_messages` required columns | PASS |
| `daily_ai_messages.member_id` FK relationship | PASS |
| `promoters` columns | PASS |
| `dr_marvin_reports` columns | PASS |
| `dr_marvin_reports.profile_id` FK relationship | PASS |
| `line_members` removed from REST schema | PASS |
| `assessment_reports.member_id/profile_id` anon check | WARN: permission denied by RLS |

`assessment_reports` could not be verified with anon access because RLS correctly denies direct reads. Verify it in Supabase SQL Editor with:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'assessment_reports'
  and column_name in ('member_id', 'profile_id', 'line_user_id', 'line_sent_at')
order by column_name;
```

## Build Verification

```bash
npm run build
```

Result: passed. Vite still reports the existing large chunk warning for the app bundle.

## Current Schema Backup Commands

Use one of the following after setting `SUPABASE_DB_URL` in a local shell. Do not commit the URL or any database credentials.

### Option A: pg_dump

```bash
STAMP="$(date +%Y%m%d_%H%M%S)"
mkdir -p "backups/supabase_schema_${STAMP}_phase0_complete"

pg_dump "$SUPABASE_DB_URL" \
  --schema=public \
  --schema-only \
  --no-owner \
  --no-privileges \
  --file "backups/supabase_schema_${STAMP}_phase0_complete/schema.sql"
```

### Option B: Supabase CLI

```bash
STAMP="$(date +%Y%m%d_%H%M%S)"
mkdir -p "backups/supabase_schema_${STAMP}_phase0_complete"

supabase db dump \
  --db-url "$SUPABASE_DB_URL" \
  --schema public \
  --file "backups/supabase_schema_${STAMP}_phase0_complete/schema.sql"
```

## Phase 1 Readiness

Phase 1 can proceed with these assumptions:

- `profiles` is the only LINE / LIFF member identity source.
- New LIFF writes should use `profiles.id` as the member identifier.
- `daily_checkins.member_id` and `daily_ai_messages.member_id` are valid FK targets to `profiles(id)`.
- `line_members` must not be referenced by new code, docs, migrations, or prompts.
- Service role access remains backend-only and must never be placed in frontend code or committed env files.

Recommended next Phase 1 tasks:

- Implement / harden LIFF member home data loading.
- Complete end-to-end member registration through `/api/line-member`.
- Test check-in write path against the migrated schema.
- Verify `assessment_reports.member_id/profile_id` linkage from backend code or SQL Editor.
- Start Dr. Marvin report and daily insight flows using `profiles` as the identity anchor.
