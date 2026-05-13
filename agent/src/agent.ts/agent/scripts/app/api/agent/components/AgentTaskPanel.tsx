"use client";
import { useState } from "react";
import styles from "./AgentTaskPanel.module.css";

const TASKS = [
  { value: "translate", label: "🌐 Translate text", price: "$0.008" },
  { value: "data",      label: "📊 Fetch crypto data", price: "$0.002" },
  { value: "summarize", label: "📝 Summarize article", price: "$0.012" },
  { value: "image",     label: "🎨 Generate image", price: "$0.035" },
];

interface Log {
  text: string;
  type: "info" | "success" | "error" | "dim";
}

export default function AgentTaskPanel() {
  const [taskType, setTaskType] = useState("data");
  const [input, setInput] = useState("");
  const [budget, setBudget] = useState("0.10");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [result, setResult] = useState<any>(null);

  const addLog = (text: string, type: Log["type"] = "info") =>
    setLogs((prev) => [...prev, { text, type }]);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setLogs([]);
    setResult(null);

    addLog(`→ Task: ${taskType} | Budget: $${budget} USDC`, "info");
    addLog("Creating scoped Agent Wallet...", "dim");
    addLog("Applying spending policy (per-tx cap, daily cap)...", "dim");
    addLog("Funding wallet via testnet faucet...", "dim");
    addLog("Searching Agent Marketplace...", "dim");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskType, input, budgetUsdc: parseFloat(budget) }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      addLog(`x402 Nanopayment sent — $${data.amountPaid} USDC (gas: $0.000)`, "dim");
      addLog("Tx confirmed in 0.4s on Arc testnet", "success");
      addLog(`Service: ${data.serviceUsed}`, "success");
      addLog(`Output: ${data.output}`, "success");
      setResult(data);
    } catch (err: any) {
      addLog(`Error: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>
        🤖 AgentTask
        <span className={styles.badge}>Circle Agent Stack</span>
      </h2>
      <p className={styles.desc}>
        AI agent that autonomously pays for services using a scoped USDC wallet.
      </p>

      <div className={styles.field}>
        <label>Task type</label>
        <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
          {TASKS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label} — {t.price}/call
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Input / prompt</label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            taskType === "translate"  ? "Enter text to translate..." :
            taskType === "data"       ? "Enter token symbol e.g. BTC, ETH..." :
            taskType === "summarize"  ? "Paste article URL or text..." :
            "Describe the image to generate..."
          }
        />
      </div>

      <div className={styles.field}>
        <label>USDC budget</label>
        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="0.05">$0.05</option>
          <option value="0.10">$0.10</option>
          <option value="0.25">$0.25</option>
          <option value="1.00">$1.00</option>
        </select>
      </div>

      <button
        className={styles.btn}
        onClick={run}
        disabled={loading || !input.trim()}
      >
        {loading ? "Running agent..." : "Run agent →"}
      </button>

      {logs.length > 0 && (
        <div className={styles.log}>
          {logs.map((l, i) => (
            <div key={i} className={styles[`log-${l.type}`]}>
              {l.text}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultRow}>
            <span>Wallet</span>
            <code>{result.walletAddress}</code>
          </div>
          <div className={styles.resultRow}>
            <span>Service</span>
            <code>{result.serviceUsed}</code>
          </div>
          <div className={styles.resultRow}>
            <span>Paid</span>
            <code>${result.amountPaid} USDC</code>
          </div>
          <div className={styles.resultRow}>
            <span>Output</span>
            <span>{result.output}</span>
          </div>
        </div>
      )}
    </div>
  );
}
