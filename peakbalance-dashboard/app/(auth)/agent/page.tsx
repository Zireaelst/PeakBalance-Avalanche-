'use client';
import { DecisionFeed } from '@/components/agent/DecisionFeed';
import { OraclePayments } from '@/components/agent/OraclePayments';
import { ReputationWidget } from '@/components/agent/ReputationWidget';
import { Divider } from '@/components/ui/Divider';
import { MOCK_DECISIONS, MOCK_ORACLE_PAYMENTS, MOCK_REPUTATION } from '@/lib/mock-data';
export default function AgentPage() {
    return (<div><ReputationWidget data={MOCK_REPUTATION} /><Divider char="═" /><DecisionFeed decisions={MOCK_DECISIONS} /><Divider char="═" /><OraclePayments payments={MOCK_ORACLE_PAYMENTS} /></div>);
}
