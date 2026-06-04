# Products V2 SQL Editor Order

> 建立日期：2026-06-04
> 用途：商品資料庫 V2 進 production Supabase 的人工執行順序與後續驗證。

## 目前狀態

`20260604_products_v2_catalog.sql` 是 upsert seed，不會重建 `public.products`，也不會刪除既有資料。

Bryan 已於 2026-06-04 回報本 SQL 已於 Supabase SQL Editor 套用 production。後續可依本檔的 read-only 查詢驗證 7 品項與 `metadata.canonical_id`。

## 執行前檢查

1. 先做 read-only schema check，確認 `public.products` 存在且至少包含：

```txt
id
slug
sort_order
name
short_name
color_name
theme
description
focus
tags
audience
ingredients
best_for
system_keys
line_summary
bg_color
text_color
status
metadata
```

2. 若 `metadata` 不存在，先不要執行 V2 catalog，需另開 migration 補欄位。
3. 確認 `products_status_check` 允許 `active`。

## 執行順序

```sql
-- 1. 若 production 尚未有 products table，先執行：
-- supabase/products.sql

-- 2. 套用商品資料庫 V2：
-- supabase/20260604_products_v2_catalog.sql

-- 3. 驗證筆數：
select id, name, status, metadata->>'canonical_id' as canonical_id
from public.products
where id in ('white_gold_base', 'snow', 'lime', 'rose', 'cinna', 'berry', 'platinum')
order by sort_order;
```

## 預期結果

應回傳 7 筆 active products：

```txt
white_gold_base -> white_gold_base_liquid
snow -> snow_mountain_white
lime -> lime_green
rose -> rose_red
cinna -> cinnamon_gold
berry -> berry_purple
platinum -> platinum_elixir
```

## 相容性說明

現有 app / Dr. Marvin 仍使用短 ID：

```txt
snow
lime
rose
cinna
berry
```

商品資料庫 canonical ID 先放在 `metadata.canonical_id`，避免破壞既有報告、推薦規則與 fallback catalog。
