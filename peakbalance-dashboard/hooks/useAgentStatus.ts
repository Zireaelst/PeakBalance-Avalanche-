'use client';

import { useState } from 'react';
import { MOCK_AGENT_STATUS } from '@/lib/mock-data';
import type { AgentStatus } from '@/types';

export function useAgentStatus() {
    const [status] = useState<AgentStatus>(MOCK_AGENT_STATUS);
    const [isLoading] = useState(false);

    return { status, isLoading };
}
