'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { LiveTicker } from '@/components/ui/LiveTicker';
import { MOCK_TICKER_ITEMS } from '@/lib/mock-data';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <LiveTicker items={MOCK_TICKER_ITEMS} />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar />
                <main style={{ flex: 1, background: '#0a0a0a', overflow: 'auto' }}>{children}</main>
            </div>
        </div>
    );
}
