'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/marketplace', icon: 'storefront', label: 'Market' },
    { href: '/community', icon: 'lightbulb', label: 'DIY' },
    { href: '/messages', icon: 'chat', label: 'Chat' },
];

export function BottomNav() {
    const pathname = usePathname();

    // Hide nav on auth pages, scanner, and item detail pages
    const hiddenRoutes = ['/login', '/register', '/onboarding', '/scanner'];
    const hiddenPatterns = [
        /^\/marketplace\/[^/]+$/, // /marketplace/[id] - item detail
        /^\/marketplace\/[^/]+\/trade$/, // /marketplace/[id]/trade
        /^\/messages\/[^/]+$/, // /messages/[id] - chat page (has its own input footer)
    ];

    const shouldHideNav = hiddenRoutes.some(route => pathname.startsWith(route)) ||
        hiddenPatterns.some(pattern => pattern.test(pathname));

    if (shouldHideNav) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[#f1f8f6]/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-20px_40px_-10px_rgba(41,48,47,0.06)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={
                            isActive
                            ? "flex flex-col items-center justify-center bg-[#b9f9d6] text-[#29664c] rounded-full px-6 py-2 translate-y-[-2px] transition-transform duration-300"
                            : "flex flex-col items-center justify-center text-[#29302f] opacity-60 px-6 py-2 hover:opacity-100 transition-all font-bold"
                        }
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-widest mt-1">
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default BottomNav;
