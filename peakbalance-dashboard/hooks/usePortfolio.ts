'use client';

import { useState, useCallback } from 'react';
import { MOCK_PORTFOLIO } from '@/lib/mock-data';
import type { Portfolio } from '@/types';

export function usePortfolio() {
    const [portfolio] = useState<Portfolio>(MOCK_PORTFOLIO);
    const [isLoading] = useState(false);
    const [error] = useState<Error | null>(null);

    const refetch = useCallback(() => {
        // When contracts are deployed, replace with:
        // const { data } = useReadContract({ ... })
    }, []);

    return { portfolio, isLoading, error, refetch };
}
