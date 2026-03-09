import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '@/lib/mock-data';

export async function GET() {
    const active = MOCK_AGENTS.filter(a => a.tier !== 'UNVERIFIED');
    return NextResponse.json(
        { data: active, count: active.length, updatedAt: new Date().toISOString() },
        { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
    );
}
