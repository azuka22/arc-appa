# Arc App Kit Demo — Next.js + Vercel

A full-stack Next.js app showcasing all 4 Arc App Kit capabilities:
**Send · Bridge · Swap · Unified Balance**

Built with `@circle-fin/app-kit` and deployable to Vercel in minutes.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd arc-app
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Your testnet wallet private key
PRIVATE_KEY=0x...

# From https://console.circle.com (free, required for Swap)
KIT_KEY=your_kit_key_here
```

### 3. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Add environment variables:
   - `PRIVATE_KEY` → your testnet wallet private key
   - `KIT_KEY` → your Circle Console kit key
5. Click **Deploy**

---

## 📦 Arc App Kit — Package Summary

| Package | Purpose |
|---|---|
| `@circle-fin/app-kit` | Core SDK (Send, Bridge, Swap, Unified Balance) |
| `@circle-fin/adapter-viem-v2` | Viem wallet adapter |
| `viem` | EVM wallet/provider library |

---

## 🔑 Prerequisites

- **Node.js v22+**
- **Testnet wallet** funded with testnet USDC + ETH
  - Get testnet funds: [faucet.circle.com](https://faucet.circle.com)
- **Arc Testnet RPC**: [docs.arc.network/arc/references/connect-to-arc](https://docs.arc.network/arc/references/connect-to-arc)
- **Circle Console Kit Key** (for Swap): [console.circle.com](https://console.circle.com)

---

## 🗂️ Project Structure

```
arc-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   ├── globals.css         # Global styles
│   └── api/
│       ├── send/route.ts           # POST /api/send
│       ├── bridge/route.ts         # POST /api/bridge
│       ├── swap/route.ts           # POST /api/swap
│       └── unified-balance/route.ts # POST /api/unified-balance
├── components/
│   ├── SendPanel.tsx
│   ├── BridgePanel.tsx
│   ├── SwapPanel.tsx
│   ├── UnifiedBalancePanel.tsx
│   └── panel.module.css
├── .env.example
├── vercel.json
└── README.md
```

---

## 📖 API Routes

### `POST /api/send`
```json
{ "chain": "Arc_Testnet", "token": "USDC", "to": "0x...", "amount": "1.00" }
```

### `POST /api/bridge`
```json
{ "fromChain": "Ethereum_Sepolia", "toChain": "Arc_Testnet", "amount": "1.00" }
```

### `POST /api/swap`
```json
{ "chain": "Arc_Testnet", "tokenIn": "USDC", "tokenOut": "EURC", "amountIn": "1.00" }
```

### `POST /api/unified-balance`
```json
// Deposit
{ "mode": "deposit", "fromChain": "Base_Sepolia", "amount": "1.00" }

// Spend
{ "mode": "spend", "spendChain": "Arc_Testnet", "recipient": "0x...", "amount": "1.50" }
```

---

## 🔗 Resources

- [Arc Docs](https://docs.arc.network)
- [App Kit Overview](https://docs.arc.network/app-kit)
- [Supported Blockchains](https://docs.arc.network/app-kit/references/supported-blockchains)
- [Block Explorer](https://testnet.arcscan.app)
- [Circle Faucet](https://faucet.circle.com)

---

> ⚠️ **Security**: Never commit your `PRIVATE_KEY` to Git. Always use environment variables.
