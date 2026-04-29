import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, fromChain, amount, spendChain, recipient } = body;

    if (!process.env.PRIVATE_KEY) {
      return NextResponse.json({ error: 'PRIVATE_KEY not set' }, { status: 500 });
    }

    const { AppKit } = await import('@circle-fin/app-kit');
    const { createViemAdapterFromPrivateKey } = await import('@circle-fin/adapter-viem-v2');

    const kit = new AppKit();
    const adapter = createViemAdapterFromPrivateKey({
      privateKey: process.env.PRIVATE_KEY as string,
    });

    let result;

    if (mode === 'deposit') {
      result = await kit.unifiedBalance.deposit({
        from: { adapter, chain: fromChain },
        amount,
        token: 'USDC',
      });
    } else {
      result = await kit.unifiedBalance.spend({
        from: { adapter },
        to: {
          adapter,
          chain: spendChain,
          recipientAddress: recipient,
        },
        amount,
      });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
