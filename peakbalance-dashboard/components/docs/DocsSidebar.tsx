'use client';

const SECTIONS = [
    { id: 'overview', label: 'OVERVIEW', icon: '◆' },
    { id: 'tech-stack', label: 'TECH STACK', icon: '⚙' },
    { id: 'architecture', label: 'ARCHITECTURE', icon: '◈' },
    { id: 'smart-contracts', label: 'SMART CONTRACTS', icon: '▣' },
    { id: 'user-journey', label: 'USER JOURNEY', icon: '→' },
    { id: 'safety', label: 'SAFETY & CONSTRAINTS', icon: '⛊' },
    { id: 'marketplace', label: 'MARKETPLACE', icon: '◉' },
    { id: 'fees', label: 'FEE MODEL', icon: '◇' },
    { id: 'roadmap', label: 'ROADMAP', icon: '▸' },
];

interface Props {
    activeSection: string;
    onSectionClick: (id: string) => void;
    search?: string;
    onSearchChange?: (value: string) => void;
}

export function DocsSidebar({ activeSection, onSectionClick, search = '', onSearchChange }: Props) {
    const filteredSections = search
        ? SECTIONS.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
        : SECTIONS;

    return (
        <aside style={{
            width: 260,
            minWidth: 260,
            background: '#0a0a0a',
            borderRight: '1px solid #2a2a2a',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: 'calc(100vh - 48px)',
        }}>
            {/* Search */}
            {onSearchChange && (
                <div style={{ padding: '16px 16px 12px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        border: '1px solid #2a2a2a', padding: '6px 10px',
                        background: '#111111',
                    }}>
                        <span style={{ fontSize: 11, color: '#444444' }}>⌕</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search docs..."
                            style={{
                                background: 'transparent', border: 'none', outline: 'none',
                                fontSize: 10, color: '#e8e8e8', fontFamily: "'JetBrains Mono', monospace",
                                width: '100%', letterSpacing: '0.05em',
                            }}
                        />
                        {search && (
                            <button
                                onClick={() => onSearchChange('')}
                                style={{
                                    background: 'none', border: 'none', color: '#444444',
                                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                                    padding: 0,
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Section Label */}
            <div style={{
                padding: onSearchChange ? '0 16px 12px' : '16px 16px 12px',
                borderBottom: '1px solid #2a2a2a',
            }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #2a2a2a', padding: '2px 8px' }}>
                    <span style={{ color: '#444444', fontSize: 9, letterSpacing: '0.2em', fontFamily: "'JetBrains Mono', monospace" }}>{'// '}</span>
                    <span style={{ color: '#888888', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>CONTENTS</span>
                </div>
                <div style={{ fontSize: 9, color: '#444444', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
                    {filteredSections.length} of {SECTIONS.length} sections
                </div>
            </div>

            {/* Navigation Items */}
            <div style={{ padding: '8px 0', flex: 1 }}>
                {filteredSections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => onSectionClick(section.id)}
                            className="dh"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                width: '100%',
                                padding: '9px 16px',
                                background: isActive ? '#111111' : 'transparent',
                                border: 'none',
                                borderLeft: isActive ? '2px solid #22d3ee' : '2px solid transparent',
                                textAlign: 'left',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span style={{
                                fontSize: 11,
                                color: isActive ? '#22d3ee' : '#444444',
                                fontFamily: "'JetBrains Mono', monospace",
                                width: 16,
                                textAlign: 'center',
                            }}>
                                {section.icon}
                            </span>
                            <span style={{
                                fontSize: 10,
                                letterSpacing: '0.1em',
                                color: isActive ? '#e8e8e8' : '#888888',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: isActive ? 700 : 400,
                            }}>
                                {section.label}
                            </span>
                            {isActive && (
                                <span style={{
                                    marginLeft: 'auto',
                                    width: 4,
                                    height: 4,
                                    background: '#22d3ee',
                                    display: 'inline-block',
                                    animation: 'pulse-dot 2s ease-in-out infinite',
                                }} />
                            )}
                        </button>
                    );
                })}
                {filteredSections.length === 0 && (
                    <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#444444', fontFamily: "'JetBrains Mono', monospace" }}>NO MATCHING SECTIONS</div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '14px 16px',
                borderTop: '1px solid #2a2a2a',
                fontSize: 8,
                color: '#444444',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.1em',
            }}>
                <div>PEAKBALANCE PROTOCOL</div>
                <div style={{ marginTop: 2 }}>Safety-First Autonomous DeFi</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', textDecoration: 'none', fontSize: 9 }}>
                        ↗ GITHUB
                    </a>
                    <a href="/dashboard" style={{ color: '#888888', textDecoration: 'none', fontSize: 9 }}>
                        ← DASHBOARD
                    </a>
                </div>
            </div>
        </aside>
    );
}
