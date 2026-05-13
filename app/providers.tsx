'use client';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';

const arcTestnet = defineChain({
  id: 2911,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.arc.network'] },
  },
});

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;

const metadata = {
  name: 'Arc App Kit Demo',
  description: 'Multichain Finance on Arc Network',
  url: 'https://arc-appa.vercel.app',
  icons: ['https://arc-appa.vercel.app/favicon.ico'],
};

const config = defaultWagmiConfig({
  chains: [arcTestnet],
  projectId,
  metadata,
});

createWeb3Modal({ wagmiConfig: config, projectId });

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
