'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { DBService } from '@/lib/firebase/db';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Notification } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const ICON_COLORS: Record<string, string> = {
    trade: 'bg-card-yellow',
    achievement: 'bg-card-pink',
    system: 'bg-card-blue',
    coin: 'bg-card-green',
    level: 'bg-primary',
};

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (user?.uid) {
                try {
                    const notifs = await DBService.getNotifications(user.uid);
                    if (notifs.length > 0) {
                        setNotifications(notifs.map((n: any) => ({
                            ...n,
                            timestamp: n.createdAt?.toDate?.() || new Date()
                        })));
                    } else {
                        setNotifications(DemoManager.getMockNotifications() as Notification[]);
                    }
                } catch (error) {
                    console.error('Error loading notifications:', error);
                    setNotifications(DemoManager.getMockNotifications() as Notification[]);
                }
            } else {
                setNotifications(DemoManager.getMockNotifications() as Notification[]);
            }
            setIsLoading(false);
        };
        load();
    }, [user]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Notifications"
                subtitle={unreadCount > 0 ? `${unreadCount} new` : undefined}
                rightAction={
                    unreadCount > 0 ? (
                        <button onClick={markAllRead} className="text-sm font-bold text-primary">
                            Mark all read
                        </button>
                    ) : undefined
                }
            />

            <div className="px-5 pb-28">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <EmptyState icon="notifications_none" title="No notifications" description="You're all caught up!" />
                ) : (
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-2">
                        {notifications.map((notif) => {
                            const Wrapper = notif.actionUrl ? Link : 'div';
                            const wrapperProps = notif.actionUrl ? { href: notif.actionUrl } : {};
                            return (
                                <motion.div key={notif.id} variants={itemVariants}>
                                    <Wrapper {...wrapperProps as any}>
                                        <div className={`rounded-2xl border-2 p-4 flex items-start gap-4 transition-all hover:-translate-y-0.5 ${notif.read ? 'bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700' : 'bg-card-green border-dark dark:border-gray-600 shadow-brutal-sm'}`}>
                                            <div className={`w-12 h-12 ${ICON_COLORS[notif.type] || 'bg-gray-100 dark:bg-dark-surface'} rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center shrink-0`}>
                                                <span className="material-symbols-outlined text-xl text-dark dark:text-white">{notif.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`font-bold text-dark dark:text-white text-sm ${!notif.read ? 'font-black' : ''}`}>{notif.title}</p>
                                                    <span className="text-[10px] text-dark/40 dark:text-white/40 font-bold shrink-0">{timeAgo(notif.timestamp)}</span>
                                                </div>
                                                <p className="text-sm text-dark/60 dark:text-white/60 mt-0.5">{notif.message}</p>
                                            </div>
                                        </div>
                                    </Wrapper>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
