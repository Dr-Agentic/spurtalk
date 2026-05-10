#!/bin/bash
# SpurTalk Daily QA Runner
# Runs Playwright E2E tests against production and posts results to Slack
#
# Usage:
#   ./run-qa.sh                    # Run all tests
#   ./run-qa.sh --smoke           # Smoke tests only
#   ./run-qa.sh --env staging     # Override environment
#
# Env vars:
#   QA_BASE_URL       - Web app base URL (default: from playwright.config)
#   QA_BACKEND_URL    - Backend API URL (for health check)
#   QA_SLACK_WEBHOOK  - Slack webhook for notifications
#   QA_ENV           - Environment name: prod|staging|dev (default: prod)

set -euo pipefail

# ─── Defaults ────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QA_ENV="${QA_ENV:-prod}"
QA_START_TIME=$(date +%s)
QA_COLOR="good"   # green
QA_ICON=":white_check_mark:"
FAIL_COUNT=0
PASS_COUNT=0

# ─── Parse Args ─────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --smoke)     QA_MODE="smoke";     shift ;;
    --env)       QA_ENV="$2";         shift 2 ;;
    --help)      echo "Usage: $0 [--smoke] [--env prod|staging]"; exit 0 ;;
    *)           echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ─── Env-Specific URLs ──────────────────────────────────────────────────
case "$QA_ENV" in
  prod)
    export QA_BASE_URL="${QA_BASE_URL:-https://app.spurtalk.com}"
    export QA_BACKEND_URL="${QA_BACKEND_URL:-https://api.spurtalk.com}"
    ;;
  staging)
    export QA_BASE_URL="${QA_BASE_URL:-http://localhost:7100}"
    export QA_BACKEND_URL="${QA_BACKEND_URL:-http://localhost:7101}"
    ;;
  dev)
    export QA_BASE_URL="${QA_BASE_URL:-http://127.0.0.1:7100}"
    export QA_BACKEND_URL="${QA_BACKEND_URL:-http://localhost:7101}"
    ;;
esac

# ─── Directories ────────────────────────────────────────────────────────
QA_LOG_DIR="${SCRIPT_DIR}/logs"
QA_REPORT_DIR="${SCRIPT_DIR}/reports"
mkdir -p "$QA_LOG_DIR" "$QA_REPORT_DIR"

LOGFILE="${QA_LOG_DIR}/qa-$(date +%Y%m%d-%H%M%S).log"
REPORT_HTML="${QA_REPORT_DIR}/report-$(date +%Y%m%d-%H%M%S).html"

# ─── Logging ──────────────────────────────────────────────────────────
exec > >(tee -a "$LOGFILE") 2>&1
echo "========================================"
echo "SpurTalk QA Runner — $(date '+%Y-%m-%d %H:%M:%S')"
echo "Environment : $QA_ENV"
echo "Base URL    : $QA_BASE_URL"
echo "Mode        : ${QA_MODE:-full}"
echo "========================================"

# ─── Pre-flight Checks ─────────────────────────────────────────────────
echo ""
echo "▶ Pre-flight checks..."

# Check backend health
echo "  Checking backend health: $QA_BACKEND_URL/api/health"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$QA_BACKEND_URL/api/health" 2>/dev/null || echo "000")
if [[ "$BACKEND_STATUS" != "200" ]]; then
  echo "  ⚠ Backend unhealthy (HTTP $BACKEND_STATUS) — continuing anyway..."
  QA_ICON=":warning:"
  QA_COLOR="warning"
else
  echo "  ✓ Backend healthy"
fi

# Check web reachable
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$QA_BASE_URL" 2>/dev/null || echo "000")
if [[ "$WEB_STATUS" == "200" || "$WEB_STATUS" == "301" || "$WEB_STATUS" == "302" ]]; then
  echo "  ✓ Web app reachable (HTTP $WEB_STATUS)"
else
  echo "  ⚠ Web app returned HTTP $WEB_STATUS — continuing..."
  QA_ICON=":warning:"
  QA_COLOR="warning"
fi

# ─── Run Playwright Tests ───────────────────────────────────────────────
cd "$SCRIPT_DIR/../web"

# Set test URL via env (override playwright.config.ts baseURL)
export PLAYWRIGHT_BASE_URL="$QA_BASE_URL"

# Build test filter
TEST_FILTER=""
case "${QA_MODE:-}" in
  smoke) TEST_FILTER="--grep 'smoke|Smoke'";;
  *)     TEST_FILTER="";;
esac

echo ""
echo "▶ Running Playwright tests..."
echo "  Filter: ${TEST_FILTER:-all tests}"

# Run with JSON reporter for parsing
npx playwright test \
  --reporter=list \
  --timeout=90000 \
  ${TEST_FILTER:-} \
  2>&1 | tee -a "$LOGFILE" || true

EXIT_CODE=${PIPESTATUS[0]}

# ─── Parse Results ──────────────────────────────────────────────────────
# Extract pass/fail counts from Playwright output
FAIL_COUNT=$(grep -c "failed" "$LOGFILE" 2>/dev/null || echo 0)
PASS_COUNT=$(grep -c "passed" "$LOGFILE" 2>/dev/null || echo 0)

QA_DURATION=$(( $(date +%s) - QA_START_TIME ))
QA_DURATION_STR=""
if   (( QA_DURATION < 60 )); then
  QA_DURATION_STR="${QA_DURATION}s"
elif (( QA_DURATION < 3600 )); then
  QA_DURATION_STR="$(( QA_DURATION / 60 ))m ${QA_DURATION % 60}s"
else
  QA_DURATION_STR="$(( QA_DURATION / 3600 ))h $(( (QA_DURATION % 3600) / 60 ))m"
fi

# ─── Summary ────────────────────────────────────────────────────────────
echo ""
echo "========================================"
echo "QA Complete — $(date '+%Y-%m-%d %H:%M:%S')"
echo "Duration    : $QA_DURATION_STR"
echo "Exit Code   : $EXIT_CODE"
echo "Log file    : $LOGFILE"
echo "========================================"

# ─── Slack Notification ────────────────────────────────────────────────
if [[ -n "${QA_SLACK_WEBHOOK:-}" ]]; then
  echo ""
  echo "▶ Posting to Slack..."

  if [[ "$EXIT_CODE" -eq 0 ]]; then
    QA_EMOJI=":white_check_mark:"
    QA_STATUS_TEXT="✅ All tests passed"
    QA_COLOR="good"
  else
    QA_EMOJI=":x:"
    QA_STATUS_TEXT="❌ Tests failed (exit $EXIT_CODE)"
    QA_COLOR="danger"
  fi

  # Build failure details
  FAILED_TESTS=$(grep -A1 "failed" "$LOGFILE" 2>/dev/null | grep -E "^\s+\S" | head -10 || echo "")

  SLACK_PAYLOAD=$(cat <<EOF
{
  "text": "${QA_EMOJI} SpurTalk QA Report — ${QA_ENV}",
  "attachments": [{
    "color": "${QA_COLOR}",
    "fields": [
      { "title": "Environment", "value": "${QA_ENV}", "short": true },
      { "title": "Duration", "value": "${QA_DURATION_STR}", "short": true },
      { "title": "Status", "value": "${QA_STATUS_TEXT}", "short": false },
      { "title": "Base URL", "value": "<${QA_BASE_URL}|${QA_BASE_URL}>", "short": false }
    ],
    "footer": "SpurTalk Devvy QA Runner",
    "ts": $(date +%s)
  }]
}
EOF
)

  curl -s -X POST \
    -H 'Content-type: application/json' \
    -d "$SLACK_PAYLOAD" \
    "${QA_SLACK_WEBHOOK}" 2>&1 | tee -a "$LOGFILE" || true
fi

# ─── Exit ──────────────────────────────────────────────────────────────
if [[ "$EXIT_CODE" -ne 0 ]]; then
  echo ""
  echo "❌ QA FAILED — exit code: $EXIT_CODE"
  exit 1
else
  echo ""
  echo "✅ QA PASSED"
  exit 0
fi
