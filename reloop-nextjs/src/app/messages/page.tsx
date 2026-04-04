'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';
import { Message } from '@/types';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
};

type TabType = 'marketplace' | 'community';

import { PageHeader } from '@/components/ui/PageHeader';

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('marketplace');
    const { isDemo, user } = useAuth();

    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            try {
                if (isDemo) {
                    setMessages(DemoManager.getMockMessages());
                } else if (user) {
                    const conversations = await DBService.getConversations(user.uid);
                    const formattedMessages: Message[] = conversations.map((conv: any) => {
                        const otherParticipantId = conv.participants?.find((p: string) => p !== user.uid) || '';
                        const senderName = conv.sellerName || conv.otherParticipantName || 'Seller';
                        const senderAvatar = conv.sellerAvatar || conv.otherParticipantAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=4ce68a&color=fff`;
                        return {
                            id: conv.id,
                            senderId: otherParticipantId,
                            senderName,
                            senderAvatar,
                            lastMessage: conv.lastMessage || 'Start chatting!',
                            timestamp: conv.lastMessageAt?.toDate?.() || new Date(),
                            unread: conv.unreadCount > 0,
                            conversationType: conv.listingId ? 'marketplace' : 'community',
                            listingId: conv.listingId,
                            listingTitle: conv.listingTitle,
                            listingPrice: conv.listingPrice,
                            listingImage: conv.listingImage,
                        };
                    });
                    setMessages(formattedMessages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Failed to load messages', error);
                if (isDemo) setMessages(DemoManager.getMockMessages());
                else setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();

        let unsubscribe = () => { };
        let pollInterval: NodeJS.Timeout | null = null;

        if (isDemo) {
            unsubscribe = DemoManager.subscribe(() => {
                setMessages([...DemoManager.getMockMessages()]);
            });
        } else if (user) {
            pollInterval = setInterval(loadMessages, 3000);
        }

        return () => {
            unsubscribe();
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [isDemo, user]);

    const filteredMessages = messages.filter(m => m.conversationType === activeTab);
    const marketplaceUnread = messages.filter(m => m.conversationType === 'marketplace' && m.unread).length;
    const communityUnread = messages.filter(m => m.conversationType === 'community' && m.unread).length;

    return (
        <div className="min-h-screen text-[#29302f]" style={{ backgroundColor: '#f1f8f6' }}>
            <PageHeader title="MESSAGES" backHref="/" />

            <main className="pt-16 pb-32 px-6 max-w-2xl mx-auto space-y-2">

                {/* Segmented Controls */}
                <section className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`relative flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-sm transition-all active:scale-95 border-2 ${activeTab === 'marketplace'
                            ? 'bg-[#29302f] text-[#f1f8f6] border-[#29302f]'
                            : 'bg-white text-[#29302f] border-[#29302f]/10 hover:border-[#29302f]/30'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                        <span>Marketplace</span>
                        {marketplaceUnread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#b31b25] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {marketplaceUnread}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('community')}
                        className={`relative flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-sm transition-all active:scale-95 border-2 ${activeTab === 'community'
                            ? 'bg-[#29302f] text-[#f1f8f6] border-[#29302f]'
                            : 'bg-white text-[#29302f] border-[#29302f]/10 hover:border-[#29302f]/30'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                        <span>DIY Community</span>
                        {communityUnread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#b31b25] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {communityUnread}
                            </span>
                        )}
                    </button>
                </section>

                {/* Message List */}
                <section className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="pt-16 text-center space-y-3">
                            <span className="material-symbols-outlined text-5xl text-[#29664c]/30">
                                {activeTab === 'marketplace' ? 'shopping_bag' : 'forum'}
                            </span>
                            <p className="text-sm font-bold text-[#565d5c]">
                                {activeTab === 'marketplace' ? 'No marketplace chats yet' : 'No community discussions yet'}
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            {filteredMessages.map((msg) => (
                                <motion.div key={msg.id} variants={itemVariants}>
                                    <Link href={`/messages/${msg.id}`}>
                                        <div className="group relative flex items-center gap-4 p-5 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:bg-[#eaf2f0] transition-colors duration-300">
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}`}
                                                    alt={msg.senderName}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#b9f9d6]"
                                                />
                                                {msg.unread && (
                                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#006946] rounded-full border-2 border-white" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-[#29302f] truncate">{msg.senderName}</h3>
                                                    <span className="text-[11px] font-bold text-[#717877] uppercase tracking-wider ml-2 shrink-0">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                                <p className={`text-[#565d5c] text-sm line-clamp-1 font-medium ${msg.unread ? 'italic' : ''}`}>
                                                    {msg.unread ? `"${msg.lastMessage}"` : msg.lastMessage}
                                                </p>
                                            </div>

                                            {/* Listing thumbnail */}
                                            {msg.listingImage && (
                                                <div className="flex-shrink-0 ml-2">
                                                    <img
                                                        src={msg.listingImage}
                                                        alt={msg.listingTitle || 'Item'}
                                                        className="w-12 h-12 rounded-xl object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <div className="pt-8 text-center">
                        <span className="text-[10px] font-bold text-[#717877] uppercase tracking-[0.2em] opacity-40">
                            End of conversations
                        </span>
                    </div>
                </section>
            </main>
        </div>
    );
}

function formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
