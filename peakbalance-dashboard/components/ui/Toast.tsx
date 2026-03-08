'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    timestamp: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (type: ToastType, message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_COLORS: Record<ToastType, string> = {
    success: '#4ade80',
    error: '#f87171',
    info: '#22d3ee',
    warning: '#fbbf24',
};

const TOAST_PREFIXES: Record<ToastType, string> = {
    success: '✓',
    error: '✗',
    info: '→',
    warning: '⚠',
};

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts(prev => [...prev, { id, type, message, timestamp: Date.now() }]);
        // Auto-remove after 4s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Toast container */}
            <div style={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10000 }}>
                {toasts.map((toast, i) => (
                    <div
                        key={toast.id}
                        className="animate-fade-in"
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: '#111111',
                            border: `1px solid ${TOAST_COLORS[toast.type]}`,
                            padding: '8px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            maxWidth: 360,
                            fontFamily: "'JetBrains Mono', monospace",
                        }}
                    >
                        <span style={{ color: TOAST_COLORS[toast.type], fontSize: 12, flexShrink: 0 }}>
                            {TOAST_PREFIXES[toast.type]}
                        </span>
                        <span style={{ fontSize: 10, color: '#e8e8e8', letterSpacing: '0.05em' }}>
                            {toast.message}
                        </span>
                        <span style={{ fontSize: 8, color: '#444444', marginLeft: 'auto', flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                            ×
                        </span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
