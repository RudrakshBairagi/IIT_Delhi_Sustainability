'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title?: string;
    showBackButton?: boolean;
    backHref?: string;
    rightAction?: ReactNode;
    subtitle?: string;
    className?: string;
    hideUserProfile?: boolean;
}

export function PageHeader({ title = 'RELOOP', showBackButton = true, backHref, rightAction, subtitle, className, hideUserProfile }: PageHeaderProps) {
    const { user } = useAuth();
    const router = useRouter();

    const handleBack = () => {
        if (backHref) {
            router.push(backHref);
        } else {
            router.back();
        }
    };

    return (
        <header className={cn('w-full z-50 bg-[#f1f8f6]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] mx-auto', className)}>
            <div className="flex items-center gap-3">
                {showBackButton ? (
                    <button onClick={handleBack} className="text-[#29664c] hover:opacity-80 transition-opacity active:scale-95 duration-200 p-1 flex items-center justify-center -ml-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_back</span>
                    </button>
                ) : (
                    <span className="material-symbols-outlined text-[#29664c]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                )}
                <div className="flex flex-col">
                     <h1 className="text-2xl font-extrabold tracking-tight text-[#29664c] leading-none uppercase truncate max-w-[150px]">{title}</h1>
                     {subtitle && <p className="text-[10px] uppercase font-bold text-[#29664c]/60 tracking-widest truncate max-w-[150px]">{subtitle}</p>}
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {rightAction && <div className="shrink-0">{rightAction}</div>}
                {!hideUserProfile && user && (
                    <>
                        <div className="hidden sm:flex bg-[#b9f9d6]/40 px-4 py-1.5 rounded-full items-center gap-2 hover:bg-[#b9f9d6]/60 transition-colors duration-300 cursor-pointer">
                            <span className="text-[#29664c] font-bold text-sm">{user.coins} Coins</span>
                            <span className="material-symbols-outlined text-xs text-[#29664c]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                        </div>
                        <Link href="/profile" className="flex-shrink-0 transition-transform active:scale-95">
                            <img alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-[#29664c]/30" src={user.avatar || ("https://ui-avatars.com/api/?name=" + (user.name || 'User') + "&background=random")} />
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default PageHeader;
