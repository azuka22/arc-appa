# Arc App Kit Demo — Next.js + Vercel + AgentTask

A full-stack Next.js app showcasing Arc App Kit capabilities and **AgentTask** — an AI agent that autonomously pays for services using a scoped USDC wallet powered by Circle Agent Stack.

Built with `@circle-fin/app-kit` and deployable to Vercel in minutes.

---

## 🧩 What's included

| Feature | Description |
|---|---|
| **Send** | Transfer USDC across chains |
| **Bridge** | Cross-chain bridging (Sepolia → Arc Testnet) |
| **Swap** | Swap USDC ↔ EURC on Arc |
| **Unified Balance** | Deposit + spend across chains |
| **🤖 AgentTask** | AI agent with scoped USDC wallet — pays for APIs automatically |

---

## 🤖 AgentTask — Circle Agent Stack

AgentTask is an AI task agent built on top of **Circle Agent Stack**. It:

1. Creates a scoped **Agent Wallet** with spending policies (per-tx cap, daily cap, recipient allowlist)
2. Funds the wallet with USDC (testnet faucet)
3. Searches the **Agent Marketplace** for the right service
4. Pays via **Nanopayments (x402)** — gas-free, sub-cent, settled in <1s on Arc
5. Executes the task and returns the result

### Supported tasks

| Task | Service | Price/call |
|---|---|---|
| `translate` | LinguaAgent v2 | $0.008 USDC |
| `data` | DataStream Pro | $0.002 USDC |
| `summarize` | SummaryBot | $0.012 USDC |
| `image` | PixelAgent | $0.035 USDC |

### Circle Agent Stack components used

- ✅ **Agent Wallets** — scoped USDC wallet per agent session
- ✅ **Agent Marketplace** — service discovery
- ✅ **Nanopayments (x402)** — gas-free payments on Arc
- ✅ **Circle CLI** — wallet creation, policy, funding, payment

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/azuka22/arc-appa
cd arc-appa
npm install
```

### 2. Install Circle CLI

```bash
npm install -g @circle-fin/cli
circle auth login
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
PRIVATE_KEY=0x...
KIT_KEY=your_kit_key_here
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## 🤖 Run AgentTask via CLI

```bash
./agent/scripts/demo.sh data "BTC,ETH,SOL"
npx ts-node agent/src/index.ts translate "Hello, world!"
npx ts-node agent/src/index.ts data "BTC"
npx ts-node agent/src/index.ts summarize "https://example.com/article"
npx ts-node agent/src/index.ts image "A futuristic city at night"
```

---

## 📖 API Routes

### `POST /api/agent`

```json
{
  "taskType": "data",
  "input": "BTC,ETH,SOL",
  "budgetUsdc": 0.10
}
```

Response:
```json
{
  "success": true,
  "walletAddress": "0x7f3a...c82b",
  "serviceUsed": "datastream-pro",
  "amountPaid": 0.002,
  "output": "[datastream-pro] BTC: $68,420 | ETH: $3,210 | SOL: $142"
}
```

---

## 🔗 Resources

- [Arc Docs](https://docs.arc.network)
- [Circle Agent Stack](https://agents.circle.com)
- [Circle Faucet](https://faucet.circle.com)
- [Arc Block Explorer](https://testnet.arcscan.app)

---

> ⚠️ **Security**: Never commit your `PRIVATE_KEY` to Git. Always use environment variables.
