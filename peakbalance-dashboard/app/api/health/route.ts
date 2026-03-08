import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'operational',
        service: 'peakbalance-dashboard',
        version: '0.1.0',
        chain: 'avalanche-fuji',
        chainId: 43113,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
}
