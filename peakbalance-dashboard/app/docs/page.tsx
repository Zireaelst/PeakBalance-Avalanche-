'use client';

import { useState, useCallback } from 'react';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsContent } from '@/components/docs/DocsContent';

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview');
    const [search, setSearch] = useState('');

    const handleSectionClick = useCallback((id: string) => {
        setActiveSection(id);
        setSearch('');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 48px)' }}>
            <DocsSidebar activeSection={activeSection} onSectionClick={handleSectionClick} search={search} onSearchChange={setSearch} />
            <DocsContent />
        </div>
    );
}
