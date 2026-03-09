import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '@/lib/mock-data';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ agentId: string }> }
) {
    const { agentId } = await params;
    const agent = MOCK_AGENTS.find(a => a.id === Number(agentId));
    if (!agent) {
        return NextResponse.json({ error: 'AGENT_NOT_FOUND' }, { status: 404 });
    }
    return NextResponse.json(
        { data: agent, updatedAt: new Date().toISOString() },
        { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=10' } }
    );
}
