'use client';

import { useState } from 'react';
import { Btn } from '@/components/ui/Btn';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function QuickControls() {
    const [agentPaused, setAgentPaused] = useState(false);

    return (
        <div
            style={{
                background: '#161616',
                padding: '14px 16px',
            }}
        >
            <SectionLabel label="CONTROLS" />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {agentPaused ? (
                    <Btn variant="success" onClick={() => setAgentPaused(false)}>
                        ▶ RESUME AGENT
                    </Btn>
                ) : (
                    <Btn onClick={() => setAgentPaused(true)}>
                        ▮▮ PAUSE AGENT
                    </Btn>
                )}
                <Btn variant="danger">
                    ⚠ EMERGENCY EXIT
                </Btn>
                <Btn size="sm">
                    ↻ FORCE CHECK
                </Btn>
            </div>

            {agentPaused && (
                <div
                    style={{
                        marginTop: 10,
                        fontSize: 9,
                        color: '#fbbf24',
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.1em',
                        border: '1px solid #3d2e0a',
                        padding: '4px 8px',
                        background: '#3d2e0a',
                    }}
                >
                    ⚠ AGENT PAUSED — No automated trades will execute
                </div>
            )}
        </div>
    );
}
