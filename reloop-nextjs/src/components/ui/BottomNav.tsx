'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavStore, ContextAction } from '@/lib/store/nav-store';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';

const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/marketplace', icon: 'storefront', label: 'Market' },
    { href: '/scanner', icon: 'qr_code_scanner', label: 'Scan', isFab: true },
    { href: '/messages', icon: 'chat_bubble', label: 'Chat' },
    { href: '/community', icon: 'lightbulb', label: 'DIY' }, // Keeping DIY as per app structure, styled as Profile slot
];

// Animation variants
const centerButtonVariants = {
    initial: { scale: 0.8, opacity: 0, y: 20 },
    animate: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
    },
    exit: { scale: 0.8, opacity: 0, y: 20 },
    tap: { scale: 0.95 }
};

export function BottomNav() {
    const pathname = usePathname();
    const { navContext } = useNavStore(); // Removed unused primaryAction destructuring if not needed for FAB override
    const [unreadCount, setUnreadCount] = useState(0);

    // Track unread messages for badge
    useEffect(() => {
        const updateUnread = () => {
            const messages = DemoManager.getMockMessages();
            const count = messages.filter(m => m.unread).length;
            setUnreadCount(count);
        };

        updateUnread();
        const unsubscribe = DemoManager.subscribe(updateUnread);
        return unsubscribe;
    }, []);

    // Hide nav on auth pages and scanner pages (for immersion/collision avoidance)
    const hiddenRoutes = ['/login', '/register', '/onboarding', '/scanner'];
    if (hiddenRoutes.some(route => pathname.startsWith(route))) {
        return null;
    }

    // Check if we're in context mode (e.g. inside a selection view)
    // If context mode active, we might want to hide the standard nav or show context actions?
    // User requested specific design. I'll overlay context actions if needed, or replace content.
    const isContextMode = navContext && navContext.mode !== 'standard';

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-0 pb-0 shrink-0">
            {/* Main Bar Container */}
            <div className="bg-white dark:bg-[#112118] border-t-[3px] border-black dark:border-white rounded-t-[32px] px-6 pb-6 pt-3 flex justify-around items-end shadow-[0px_-4px_20px_rgba(0,0,0,0.1)] max-w-md mx-auto relative h-[88px]">

                {isContextMode ? (
                    <div className="flex items-center justify-between w-full h-full pb-2">
                        {/* Context Mode Rendering (Simplified to match height constraint) */}
                        {navContext.actions?.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={action.onClick}
                                className="flex flex-col items-center gap-1 group w-16"
                            >
                                <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-colors ${action.variant === 'danger' ? 'bg-red-100' : 'bg-gray-100'} dark:bg-white/10`}>
                                    <span className="material-symbols-outlined text-black dark:text-white text-[24px]">
                                        {action.icon}
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold text-black dark:text-white truncate max-w-full">{action.label}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        // Special Render for FAB (Scan)
                        if (item.isFab) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative -top-8 flex flex-col items-center group"
                                >
                                    <div className="h-16 w-16 bg-black dark:bg-[#4ce68a] rounded-full border-[4px] border-white dark:border-[#112118] flex items-center justify-center shadow-lg transform active:scale-95 transition-transform group-hover:scale-105">
                                        <span className="material-symbols-outlined text-white dark:text-[#112118] text-[32px]">
                                            {item.icon}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-black dark:text-white relative -top-1">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        }

                        // Standard Items
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center gap-1 group w-16 pb-2"
                            >
                                <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-colors ${isActive ? 'bg-gray-100 dark:bg-white/10' : 'group-hover:bg-gray-100 dark:group-hover:bg-white/5'}`}>
                                    <span
                                        className={`material-symbols-outlined text-[28px] transition-colors ${isActive ? 'text-black dark:text-white font-bold' : 'text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white'}`}
                                        style={{ fontVariationSettings: isActive ? "'wght' 600" : "'wght' 400" }}
                                    >
                                        {item.icon}
                                    </span>
                                </div>
                                <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white'}`}>
                                    {item.label}
                                </span>

                                {/* Unread badge */}
                                {item.href === '/messages' && unreadCount > 0 && (
                                    <span className="absolute top-2 right-4 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </Link>
                        );
                    })
                )}
            </div>
        </nav>
    );
}

export default BottomNav;
