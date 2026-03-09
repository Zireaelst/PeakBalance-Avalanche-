'use client';
import { useState } from 'react';
import { MOCK_AGENTS } from '@/lib/mock-data';
import type { MarketplaceAgent } from '@/types';

export function useReputation(agentId?: number) {
    const agent = agentId ? MOCK_AGENTS.find(a => a.id === agentId) : undefined;
    return {
        score: agent?.score ?? 0,
        tier: agent?.tier ?? 'UNVERIFIED',
        radar: agent?.radar ?? [0, 0, 0, 0, 0, 0],
        lastUpdated: Date.now() - 1800_000, // simulated 30 min ago
    };
}

export function useLeaderboard(count = 10): MarketplaceAgent[] {
    return [...MOCK_AGENTS]
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
}
