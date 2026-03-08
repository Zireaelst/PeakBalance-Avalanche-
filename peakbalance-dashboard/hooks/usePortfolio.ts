'use client';
import { MOCK_PORTFOLIO } from '@/lib/mock-data';
export function usePortfolio() { return { data: MOCK_PORTFOLIO, isLoading: false }; }
