'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
interface Props { avaxPct: number; usdcPct: number; }
export function AllocationRing({ avaxPct, usdcPct }: Props) {
    const r = 80, cx = 120, cy = 120, C = 2 * Math.PI * r;
    const avaxLen = (avaxPct / 100) * C, usdcLen = (usdcPct / 100) * C;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={240} height={240} viewBox="0 0 240 240">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2a2a" strokeWidth={18} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22d3ee" strokeWidth={18} strokeDasharray={`${avaxLen} ${C}`} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#888888" strokeWidth={18} strokeDasharray={`${usdcLen} ${C}`} strokeDashoffset={-avaxLen} transform={`rotate(-90 ${cx} ${cy})`} />
                {/* Target line at 50% */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`} opacity={0.5} />
                <text x={cx} y={cy - 8} textAnchor="middle" fill="#e8e8e8" fontSize={28} fontWeight={700} fontFamily="'JetBrains Mono', monospace">{avaxPct.toFixed(1)}%</text>
                <text x={cx} y={cy + 16} textAnchor="middle" fill="#888888" fontSize={11} fontFamily="'JetBrains Mono', monospace">AVAX</text>
            </svg>
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}><span style={{ color: '#22d3ee' }}>■</span> AVAX {avaxPct.toFixed(1)}%</span>
                <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}><span style={{ color: '#888888' }}>■</span> USDC {usdcPct.toFixed(1)}%</span>
                <span style={{ fontSize: 9, color: '#888888', fontFamily: "'JetBrains Mono', monospace" }}><span style={{ color: '#fbbf24' }}>■</span> TARGET 50%</span>
            </div>
        </div>
    );
}
