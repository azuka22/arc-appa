#!/usr/bin/env bash
# Usage: ./scripts/demo.sh [taskType] [input]

TASK=${1:-data}
INPUT=${2:-"BTC,ETH,SOL"}
WALLET="agent-demo-$(date +%s)"
BUDGET=0.10
DAILY=1.00

echo ""
echo "🤖 AgentTask — Circle Agent Stack Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Task    : $TASK"
echo "  Input   : $INPUT"
echo "  Wallet  : $WALLET"
echo "  Budget  : \$$BUDGET USDC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "[1/5] Creating agent wallet..."
circle wallet create --name "$WALLET" --type agent

echo "[2/5] Applying spending policy..."
circle wallet policy set \
  --name "$WALLET" \
  --per-tx-cap "$BUDGET" \
  --daily-cap "$DAILY"

echo "[3/5] Funding wallet (testnet)..."
circle wallet fund --name "$WALLET" --amount "$BUDGET" --asset USDC

echo "[4/5] Searching Agent Marketplace for: $TASK..."
circle marketplace search --query "$TASK" --limit 1

echo "[5/5] Paying and executing task..."
circle pay \
  --from "$WALLET" \
  --to "svc-${TASK}-001" \
  --amount 0.008 \
  --asset USDC

echo ""
echo "✅ Done! Task '$TASK' completed via Circle Agent Stack."
echo "   Nanopayment: gas-free, confirmed in ~0.4s on Arc testnet."
