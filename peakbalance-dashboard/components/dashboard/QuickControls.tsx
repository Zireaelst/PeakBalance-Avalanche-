'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Btn } from '@/components/ui/Btn';
export function QuickControls() {
    return (
        <div style={{ background: '#161616', padding: '14px 16px' }}>
            <SectionLabel label="CONTROLS" />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Btn>▮▮ PAUSE AGENT</Btn>
                <Btn variant="danger">⚠ EMERGENCY EXIT</Btn>
                <Btn variant="success">↻ FORCE CHECK</Btn>
            </div>
        </div>
    );
}
