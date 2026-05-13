import { runAgentTask, AgentConfig, Task } from "./agent";

const config: AgentConfig = {
  walletName: "agent-task-01",
  budgetUsdc: 0.10,
  dailyCapUsdc: 1.00,
};

const task: Task = {
  type: (process.argv[2] as Task["type"]) || "data",
  input: process.argv[3] || "default input",
};

(async () => {
  console.log("\n🤖 AgentTask — Circle Agent Stack Demo");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Task type : ${task.type}`);
  console.log(`Budget    : $${config.budgetUsdc} USDC`);
  console.log(`Daily cap : $${config.dailyCapUsdc} USDC`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const result = await runAgentTask(task, config);

  if (result.success) {
    console.log("\n✅ Task completed successfully");
    console.log(`   Wallet  : ${result.walletAddress}`);
    console.log(`   Service : ${result.serviceUsed}`);
    console.log(`   Paid    : $${result.amountPaid} USDC`);
    console.log(`   Output  : ${result.output}`);
  } else {
    console.error("\n❌ Task failed:", result.error);
    process.exit(1);
  }
})();
