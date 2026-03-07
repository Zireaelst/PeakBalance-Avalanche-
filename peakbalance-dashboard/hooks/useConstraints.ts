'use client';

import { useState } from 'react';
import { MOCK_CONSTRAINTS } from '@/lib/mock-data';
import type { Constraints } from '@/types';

export function useConstraints() {
    const [constraints] = useState<Constraints>(MOCK_CONSTRAINTS);
    const [isLoading] = useState(false);

    return { constraints, isLoading };
}
