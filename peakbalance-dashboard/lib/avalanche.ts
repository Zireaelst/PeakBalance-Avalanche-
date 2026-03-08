import { defineChain } from 'viem';
export const avalancheFuji = defineChain({ id: 43113, name: 'Avalanche Fuji Testnet', nativeCurrency: { decimals: 18, name: 'Avalanche', symbol: 'AVAX' }, rpcUrls: { default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'], webSocket: ['wss://api.avax-test.network/ext/bc/C/ws'] } }, blockExplorers: { default: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io' } }, testnet: true });
export const avalancheMainnet = defineChain({ id: 43114, name: 'Avalanche C-Chain', nativeCurrency: { decimals: 18, name: 'Avalanche', symbol: 'AVAX' }, rpcUrls: { default: { http: ['https://api.avax.network/ext/bc/C/rpc'], webSocket: ['wss://api.avax.network/ext/bc/C/ws'] } }, blockExplorers: { default: { name: 'Snowtrace', url: 'https://snowtrace.io' } } });
export const SUPPORTED_CHAINS = [avalancheFuji, avalancheMainnet] as const;
export const DEFAULT_CHAIN = avalancheFuji;
