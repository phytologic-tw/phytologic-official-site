# Dr. Marvin SQL Editor 執行順序

> 建立日期：2026-06-02
> 用途：本機缺少 `SUPABASE_SERVICE_ROLE_KEY` / DB 直連工具時，供 Bryan 直接在 Supabase SQL Editor 依序貼上執行。

## 執行順序

1. `supabase/dr_marvin_question_engine.sql`
2. `supabase/seed_question_bank.sql`
3. `supabase/seed_inflammation_alerts.sql`
4. `supabase/seed_anti_inflammation_protocols.sql`

## 驗證 SQL

```sql
select count(*) as question_bank_count
from public.question_bank;

select count(*) as inflammation_alerts_count
from public.inflammation_alerts;

select count(*) as anti_inflammation_protocols_count
from public.anti_inflammation_protocols;

select to_regclass('public.member_question_history') as member_question_history_table;
```

## 預期結果

| 項目 | 預期 |
|------|------|
| `question_bank` | 475 |
| `inflammation_alerts` | 8 |
| `anti_inflammation_protocols` | 21 |
| `member_question_history` | `public.member_question_history` |

## 注意

- 本次 migration 不會 drop table，不會 truncate，也不會清空 production 資料。
- 三個 seed 都可重複執行；`question_bank` 依 `question_bank_unique_question` 更新，警示與 protocol 依 code 更新。
- 若 Supabase SQL Editor 回報 constraint 已存在但名稱不同，先停止並做 read-only schema check，不要手動刪表。
