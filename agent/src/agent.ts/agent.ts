import { execSync } from "child_process";

export interface AgentConfig {
  walletName: string;
  budgetUsdc: number;
  dailyCapUsdc: number;
}

export interface Task {
  type: "translate" | "data" | "summarize" | "image";
  input: string;
}

export interface TaskResult {
  success: boolean;
  walletAddress?: string;
  serviceUsed?: string;
  amountPaid?: number;
  output?: string;
  error?: string;
}

const SERVICE_MAP: Record<Task["type"], { name: string; price: number; endpoint: string }> = {
  translate:  { name: "lingua-agent-v2",  price: 0.008, endpoint: "svc-translate-001" },
  data:       { name: "datastream-pro",   price: 0.002, endpoint: "svc-data-001" },
  summarize:  { name: "summarybot",       price: 0.012, endpoint: "svc-summarize-001" },
  image:      { name: "pixel-agent",      price: 0.035, endpoint: "svc-image-001" },
};

function cli(cmd: string): string {
  try {
    return execSync(`circle ${cmd}`, { encoding: "utf8" }).trim();
  } catch (e: any) {
    throw new Error(`CLI error: ${e.message}`);
  }
}

export async function runAgentTask(task: Task, config: AgentConfig): Promise<TaskResult> {
  const service = SERVICE_MAP[task.type];

  try {
    console.log(`[AgentTask] Creating wallet: ${config.walletName}`);
    const walletOut = cli(`wallet create --name ${config.walletName} --type agent`);
    const addressMatch = walletOut.match(/0x[a-fA-F0-9]{40}/);
    const walletAddress = addressMatch ? addressMatch[0] : "unknown";

    console.log(`[AgentTask] Setting policy: per-tx $${service.price}, daily $${config.dailyCapUsdc}`);
    cli(
      `wallet policy set --name ${config.walletName}` +
      ` --per-tx-cap ${service.price}` +
      ` --daily-cap ${config.dailyCapUsdc}` +
      ` --recipient-allowlist ${service.endpoint}`
    );

    console.log(`[AgentTask] Funding wallet with $${config.budgetUsdc} USDC`);
    cli(`wallet fund --name ${config.walletName} --amount ${config.budgetUsdc} --asset USDC`);

    console.log(`[AgentTask] Searching Agent Marketplace for: ${task.type}`);
    cli(`marketplace search --query ${task.type} --limit 1`);

    console.log(`[AgentTask] Paying $${service.price} USDC to ${service.name}`);
    const payOut = cli(
      `pay --from ${config.walletName}` +
      ` --to ${service.endpoint}` +
      ` --amount ${service.price}` +
      ` --asset USDC`
    );
    console.log(`[AgentTask] Payment confirmed: ${payOut}`);

    const output = await simulateServiceCall(task, service.name);

    return {
      success: true,
      walletAddress,
      serviceUsed: service.name,
      amountPaid: service.price,
      output,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function simulateServiceCall(task: Task, service: string): Promise<string> {
  const outputs: Record<Task["type"], string> = {
    translate:  `[${service}] Translation complete: "${task.input.slice(0, 40)}..."`,
    data:       `[${service}] BTC: $68,420 | ETH: $3,210 | SOL: $142`,
    summarize:  `[${service}] Summary: Article covers recent developments in AI agent payments.`,
    image:      `[${service}] Image generated: https://cdn.pixelagent.ai/out/abc123.png`,
  };
  return outputs[task.type];
}
