import { NextRequest, NextResponse } from "next/server";
import { runAgentTask, AgentConfig, Task } from "../../../agent/src/agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskType, input, budgetUsdc = 0.1 } = body;

    if (!taskType || !input) {
      return NextResponse.json(
        { error: "Missing taskType or input" },
        { status: 400 }
      );
    }

    const config: AgentConfig = {
      walletName: `agent-${Date.now()}`,
      budgetUsdc,
      dailyCapUsdc: 1.0,
    };

    const task: Task = { type: taskType, input };
    const result = await runAgentTask(task, config);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
