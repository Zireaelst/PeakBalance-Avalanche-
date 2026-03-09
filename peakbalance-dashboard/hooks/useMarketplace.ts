'use client';
import { useState, useEffect, useCallback } from 'react';
import type { MarketplaceAgent, SortKey } from '@/types';
import { MOCK_AGENTS } from '@/lib/mock-data';

export function useMarketplace() {
    const [agents, setAgents] = useState<MarketplaceAgent[]>(MOCK_AGENTS);
    const [filtered, setFiltered] = useState<MarketplaceAgent[]>(MOCK_AGENTS);
    const [sortKey, setSortKey] = useState<SortKey>('score');
    const [minScore, setMinScore] = useState(300);
    const [search, setSearch] = useState('');
    const [tiers, setTiers] = useState({ APEX: true, ELITE: true, TRUSTED: true, RISING: false });

    const applyFilters = useCallback(() => {
        let result = agents.filter(a => {
            if (a.score < minScore) return false;
            if (!tiers[a.tier as keyof typeof tiers]) return false;
            if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
                !a.strategy.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
        result = [...result].sort((a, b) => {
            if (sortKey === 'score')    return b.score - a.score;
            if (sortKey === 'ret30')    return b.ret30 - a.ret30;
            if (sortKey === 'subs')     return b.subs - a.subs;
            if (sortKey === 'winrate')  return b.winRate - a.winRate;
            if (sortKey === 'drawdown') return Math.abs(a.maxDD) - Math.abs(b.maxDD);
            if (sortKey === 'volume')   return parseFloat(b.vol) - parseFloat(a.vol);
            return 0;
        });
        setFiltered(result);
    }, [agents, sortKey, minScore, search, tiers]);

    useEffect(() => { applyFilters(); }, [applyFilters]);

    // Live score simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(a => ({
                ...a,
                score: Math.min(1000, Math.max(300, a.score + Math.round((Math.random() - 0.48) * 3))),
            })));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return { agents, filtered, sortKey, setSortKey, minScore, setMinScore, search, setSearch, tiers, setTiers };
}
