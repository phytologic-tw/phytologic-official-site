#!/bin/bash

###############################################################################
# 植本邏輯 Phase 0 技術債修復 - Codex CLI 自動化執行腳本
###############################################################################
# 
# 用途：完全自動化執行 Phase 0 的所有 SQL Migration 與驗證
# 執行方式：codex run ./PHASE_0_CODEX_CLI.sh
# 預計時間：5-10 分鐘（不含 Vercel 部署時間）
# 
# 前置條件：
# 1. 已設定 Supabase DB 連線字串：SUPABASE_DB_URL
# 2. 已在 Supabase / Vercel 外部完成必要密鑰輪替
# 3. 已備份 Supabase 資料庫
#
###############################################################################

set -e  # 有任何錯誤立即停止

# 色彩定義（便於閱讀）
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 環境變數檢查
check_env() {
    log_header "Step 0：環境變數檢查"
    
    if [ -z "$SUPABASE_URL" ]; then
        log_error "SUPABASE_URL 未設定"
        exit 1
    fi
    log_success "SUPABASE_URL: ${SUPABASE_URL:0:30}..."
    
    if [ -z "$SUPABASE_DB_URL" ]; then
        log_error "SUPABASE_DB_URL 未設定"
        exit 1
    fi
    log_success "SUPABASE_DB_URL: 已設定"
    
    log_success "所有環境變數已設定"
    echo
}

confirm_migration_safety() {
    log_header "Step 0.5：Migration 安全確認"

    if [ "$PHASE0_BACKUP_CONFIRMED" != "YES" ]; then
        log_error "尚未確認 Supabase 備份。請先完成備份，並以 PHASE0_BACKUP_CONFIRMED=YES 明確確認。"
        exit 1
    fi

    if [ "$CONFIRM_PHASE0_SUPABASE_MIGRATION" != "YES" ]; then
        log_error "尚未確認要執行 Phase 0 Supabase migration。若已完成風險確認，請設定 CONFIRM_PHASE0_SUPABASE_MIGRATION=YES。"
        exit 1
    fi

    log_success "已確認備份與 migration 執行授權"
    echo
}

execute_phase0_migration_file() {
    log_header "執行：PHASE_0_MIGRATION.sql"

    if [ ! -f "PHASE_0_MIGRATION.sql" ]; then
        log_error "找不到 PHASE_0_MIGRATION.sql"
        exit 1
    fi

    if command -v psql &> /dev/null && [ -n "$SUPABASE_DB_URL" ]; then
        psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f PHASE_0_MIGRATION.sql
        log_success "PHASE_0_MIGRATION.sql 已透過 psql 執行"
        echo
        return
    fi

    log_error "找不到 psql，無法安全地由 CLI 直接執行 SQL。"
    echo "請改用 Supabase SQL Editor 分段執行 PHASE_0_MIGRATION.sql，或安裝 psql 後重跑。"
    exit 1
}

# ============================================================================
# Phase 7：驗證
# ============================================================================

step_7_verify() {
    log_header "Phase 7：驗證結果"
    
    log_warning "驗證查詢應在 Supabase SQL Editor 手動執行"
    echo ""
    echo "請在 Supabase 控制台執行以下查詢："
    echo ""
    echo "1. 確認 profiles 欄位數："
    echo "   SELECT COUNT(*) FROM information_schema.columns WHERE table_name='profiles';"
    echo "   應該 >= 25"
    echo ""
    echo "2. 確認 line_members 是否仍存在（若存在需人工確認遷移後再刪除）："
    echo "   SELECT COUNT(*) FROM information_schema.tables WHERE table_name='line_members';"
    echo "   若 > 0，請先確認備份與資料遷移狀態"
    echo ""
    echo "3. 確認新表存在："
    echo "   SELECT table_name FROM information_schema.tables WHERE table_name IN ('daily_ai_messages','promoters','dr_marvin_reports') ORDER BY table_name;"
    echo "   應該顯示 3 行"
    echo ""
}

# ============================================================================
# 主程序執行
# ============================================================================

main() {
    log_header "植本邏輯 Phase 0 技術債修復 - Codex CLI 執行"
    echo "開始時間：$(date)"
    echo ""
    
    # 前置檢查
    check_env
    confirm_migration_safety
    
    # 執行 Phase 0 migration 檔案
    execute_phase0_migration_file
    step_7_verify
    
    # 完成訊息
    log_header "Phase 0 Migration 已完成！"
    echo ""
    log_success "Phase 0 SQL 已送出執行"
    log_success "建立了 3 個新表：daily_ai_messages, promoters, dr_marvin_reports"
    log_success "profiles 表已擴展 LINE/LIFF 會員欄位"
    log_success "所有 RLS Policy 已設定"
    echo ""
    log_warning "後續步驟："
    echo "1. 在 Supabase SQL Editor 執行 Phase 7 的驗證查詢"
    echo "2. 若 line_members 仍存在，確認資料已遷移與備份後再人工刪除"
    echo "3. 檢查 Vercel 環境變數（確認所有後端密鑰已完成輪替）"
    echo "4. 重新部署 Vercel（若環境變數已更新）"
    echo "5. 執行功能測試（打卡、報告、推廣）"
    echo "6. 簽名確認 PHASE_0_CODEX_IMPLEMENTATION_GUIDE.md"
    echo ""
    echo "結束時間：$(date)"
}

# 執行主程序
main
