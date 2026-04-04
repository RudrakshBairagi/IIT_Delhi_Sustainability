'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { DBService } from '@/lib/firebase/db';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Message } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

function timeAgo(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
}

export default function MessagesPage() {
    const { user, isDemo } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (isDemo) {
                setMessages(DemoManager.getMockMessages());
                const unsubscribe = DemoManager.subscribe(() => {
                    setMessages([...DemoManager.getMockMessages()]);
                });
                setIsLoading(false);
                return unsubscribe;
            }

            if (user?.uid) {
                try {
                    // Try Firebase first
                    const conversations = await DBService.getConversations(user.uid);
                    if (conversations.length > 0) {
                        // Transform conversations to Message format
                        const msgs = conversations.map((conv: any) => ({
                            id: conv.id,
                            senderId: conv.participants.find((p: string) => p !== user.uid) || 'unknown',
                            senderName: conv.otherUserName || 'User',
                            senderAvatar: conv.otherUserAvatar || 'https://ui-avatars.com/api/?name=User',
                            lastMessage: conv.lastMessage,
                            timestamp: conv.lastMessageAt?.toDate?.() || new Date(),
                            unread: !conv.readBy?.includes(user.uid),
                            listingTitle: conv.listingTitle
                        }));
                        setMessages(msgs);
                    } else {
                        // Empty or mock logic if needed for real user
                        setMessages([]);
                    }
                } catch (error) {
                    console.error('Error loading conversations:', error);
                    setMessages([]);
                }
            } else {
                setMessages([]);
            }
            setIsLoading(false);
        };
        const unsubscribePromise = load();

        // Cleanup if load returns a function (unsubscribe)
        return () => {
            unsubscribePromise.then(unsub => unsub && typeof unsub === 'function' && unsub());
        };
    }, [user, isDemo]);

    const unreadCount = messages.filter(m => m.unread).length;

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Messages"
                subtitle={unreadCount > 0 ? `${unreadCount} unread` : undefined}
            />

            <div className="px-5 pb-28">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <EmptyState icon="chat" title="No messages yet" description="Start a trade to begin chatting!" />
                ) : (
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-2">
                        {messages.map((msg) => (
                            <motion.div key={msg.id} variants={itemVariants}>
                                <Link href={`/messages/${msg.senderId}`}>
                                    <div className={`rounded-2xl border-2 p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 ${msg.unread ? 'bg-card-green border-dark dark:border-gray-600 shadow-brutal-sm' : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700'}`}>
                                        <div className="relative shrink-0">
                                            <div className="w-14 h-14 rounded-full border-2 border-dark dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full object-cover" />
                                            </div>
                                            {msg.unread && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className={`font-bold text-dark dark:text-white truncate ${msg.unread ? 'font-black' : ''}`}>{msg.senderName}</p>
                                                <span className="text-xs text-dark/40 dark:text-white/40 font-bold shrink-0 ml-2">{timeAgo(msg.timestamp)}</span>
                                            </div>
                                            {msg.listingTitle && (
                                                <p className="text-xs text-primary font-bold truncate mb-0.5">{msg.listingTitle}</p>
                                            )}
                                            <p className={`text-sm truncate ${msg.unread ? 'text-dark font-medium' : 'text-dark/60 dark:text-white/60'}`}>{msg.lastMessage}</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
