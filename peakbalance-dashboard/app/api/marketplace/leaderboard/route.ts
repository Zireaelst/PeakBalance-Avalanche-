import { NextResponse } from 'next/server';
import { MOCK_AGENTS } from '@/lib/mock-data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = Math.min(20, parseInt(searchParams.get('count') ?? '20'));
    const sorted = [...MOCK_AGENTS].sort((a, b) => b.score - a.score).slice(0, count);
    return NextResponse.json(
        { data: sorted, count: sorted.length, updatedAt: new Date().toISOString() },
        { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
}
