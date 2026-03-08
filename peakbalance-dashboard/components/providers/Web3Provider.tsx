'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { avalancheFuji, avalancheMainnet } from '@/lib/avalanche';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig({
    chains: [avalancheFuji, avalancheMainnet],
    transports: {
        [avalancheFuji.id]: http(),
        [avalancheMainnet.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#22d3ee',
                        accentColorForeground: '#0a0a0a',
                        borderRadius: 'none',
                        fontStack: 'system',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
