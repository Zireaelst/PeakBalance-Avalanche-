'use client';
import { MOCK_AGENT_STATUS } from '@/lib/mock-data';
export function useAgentStatus() { return { data: MOCK_AGENT_STATUS, isLoading: false }; }
