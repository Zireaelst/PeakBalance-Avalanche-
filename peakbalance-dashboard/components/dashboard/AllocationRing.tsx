'use client';

interface AllocationRingProps {
    avaxPct: number;
    usdcPct: number;
    targetPct?: number;
}

export function AllocationRing({ avaxPct, usdcPct, targetPct = 50 }: AllocationRingProps) {
    const size = 200;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const avaxDash = (avaxPct / 100) * circumference;
    const usdcDash = (usdcPct / 100) * circumference;

    // Target marker position (angle in radians from top)
    const targetAngle = ((targetPct / 100) * 360 - 90) * (Math.PI / 180);
    const markerR = radius;
    const markerX = size / 2 + markerR * Math.cos(targetAngle);
    const markerY = size / 2 + markerR * Math.sin(targetAngle);
    const markerX2 = size / 2 + (markerR + 10) * Math.cos(targetAngle);
    const markerY2 = size / 2 + (markerR + 10) * Math.sin(targetAngle);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth={strokeWidth}
                />

                {/* USDC segment (drawn first, underneath) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#444444"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} 0`}
                    strokeLinecap="butt"
                />

                {/* AVAX segment */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${avaxDash} ${circumference - avaxDash}`}
                    strokeLinecap="butt"
                />

                {/* Target marker line */}
                <line
                    x1={markerX}
                    y1={markerY}
                    x2={markerX2}
                    y2={markerY2}
                    stroke="#fbbf24"
                    strokeWidth={2}
                />
            </svg>

            {/* Center overlay text */}
            <div
                style={{
                    position: 'relative',
                    marginTop: -size / 2 - 30,
                    marginBottom: size / 2 - 30,
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#e8e8e8',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    {avaxPct.toFixed(1)}%
                </div>
                <div
                    style={{
                        fontSize: 9,
                        color: '#888888',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontFamily: "'JetBrains Mono', monospace",
                    }}
                >
                    AVAX
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 3, background: '#22d3ee', display: 'inline-block' }} />
                    <span
                        style={{
                            fontSize: 9,
                            color: '#888888',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        AVAX {avaxPct.toFixed(1)}%
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 3, background: '#444444', display: 'inline-block' }} />
                    <span
                        style={{
                            fontSize: 9,
                            color: '#888888',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        USDC {usdcPct.toFixed(1)}%
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 2, background: '#fbbf24', display: 'inline-block' }} />
                    <span
                        style={{
                            fontSize: 9,
                            color: '#888888',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        TARGET {targetPct}%
                    </span>
                </div>
            </div>
        </div>
    );
}
