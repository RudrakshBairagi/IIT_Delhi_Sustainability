'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavStore } from '@/lib/store/nav-store';

const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/marketplace', icon: 'storefront', label: 'Trade' },
    { href: '/scanner', icon: 'photo_camera', label: 'Scan' },
    { href: '/tutorials', icon: 'lightbulb', label: 'DIY' },
    { href: '/settings', icon: 'settings', label: 'Settings' },
];

export function BottomNav() {
    const pathname = usePathname();
    const { primaryAction } = useNavStore();

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-6">
            <div className="bg-dark dark:bg-dark-surface dark:border dark:border-gray-700 rounded-[2rem] px-4 py-3 flex items-center justify-between gap-2 shadow-2xl transition-all">
                {navItems.map((item, index) => {
                    // Center Item (Index 2) Logic
                    if (index === 2) {
                        // Dynamic Action Button
                        if (primaryAction) {
                            return (
                                <button
                                    key="action-btn"
                                    onClick={primaryAction.onClick}
                                    disabled={primaryAction.disabled || primaryAction.loading}
                                    className="flex items-center justify-center w-12 h-12 bg-primary text-dark rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all group relative"
                                >
                                    {primaryAction.loading ? (
                                        <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span className="material-symbols-outlined text-2xl">
                                            {primaryAction.icon || 'check'}
                                        </span>
                                    )}
                                </button>
                            );
                        }
                    }

                    // Standard Navigation Logic (applies to standard items AND center item if no action)
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    if (isActive) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 bg-primary text-dark px-5 py-3 rounded-full font-bold text-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {item.icon}
                                </span>
                                <span className="uppercase tracking-wide">{item.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center justify-center w-12 h-12 bg-dark-surface dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-all group"
                        >
                            <span className="material-symbols-outlined text-xl text-white/70 group-hover:text-primary transition-colors">
                                {item.icon}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default BottomNav;
