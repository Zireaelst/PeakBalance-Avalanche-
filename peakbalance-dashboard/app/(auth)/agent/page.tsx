'use client';

import { DecisionFeed } from '@/components/agent/DecisionFeed';
import { OraclePayments } from '@/components/agent/OraclePayments';
import { ReputationWidget } from '@/components/agent/ReputationWidget';
import { Divider } from '@/components/ui/Divider';
import { MOCK_DECISIONS, MOCK_ORACLE_PAYMENTS, MOCK_REPUTATION } from '@/lib/mock-data';

export default function AgentPage() {
    return (
        <div>
            {/* Row 1: Reputation Widget */}
            <ReputationWidget data={MOCK_REPUTATION} />

            <Divider char="═" />

            {/* Row 2: Decision Feed */}
            <DecisionFeed decisions={MOCK_DECISIONS} />

            <Divider char="═" />

            {/* Row 3: Oracle Payments */}
            <OraclePayments payments={MOCK_ORACLE_PAYMENTS} />
        </div>
    );
}
