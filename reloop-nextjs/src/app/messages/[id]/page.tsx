'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { DBService } from '@/lib/firebase/db';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ChatMessage, Message } from '@/types';

export default function ChatPage() {
    const params = useParams();
    const conversationId = params.id as string;
    const { user } = useAuth();
    const [messages, setChatMessages] = useState<ChatMessage[]>([]);
    const [contact, setContact] = useState<Message | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Real-time message subscription
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const setupRealtime = async () => {
            if (user?.uid) {
                try {
                    // Get conversation info
                    const conversations = await DBService.getConversations(user.uid);
                    const conv: any = conversations.find((c: any) => c.id === conversationId);

                    if (conv) {
                        // Find the other participant
                        const otherParticipantId = conv.participants.find((p: string) => p !== user.uid);
                        setContact({
                            id: conv.id,
                            senderId: otherParticipantId || conversationId,
                            senderName: conv.otherParticipant?.name || 'User',
                            senderAvatar: conv.otherParticipant?.avatar || 'https://ui-avatars.com/api/?name=User',
                            lastMessage: '',
                            timestamp: new Date(),
                            unread: false,
                            listingTitle: conv.listingTitle
                        });
                    }

                    // Subscribe to real-time messages
                    unsubscribe = DBService.subscribeToMessages(conversationId, (firebaseMessages) => {
                        const formattedMessages = firebaseMessages.map((m: any) => ({
                            id: m.id,
                            senderId: m.senderId,
                            text: m.text,
                            timestamp: m.timestamp?.toDate?.() || new Date(),
                            isOwn: m.senderId === user.uid
                        }));
                        setChatMessages(formattedMessages);
                        setIsLoading(false);
                    });
                } catch (error) {
                    console.error('Error setting up real-time chat:', error);
                    loadMockData();
                }
            } else {
                loadMockData();
            }
        };

        const loadMockData = () => {
            const allMessages = DemoManager.getMockMessages();
            const found = allMessages.find(m => m.senderId === conversationId);
            if (found) setContact(found as Message);
            setChatMessages(DemoManager.getConversation(conversationId));
            DemoManager.markConversationRead(conversationId);
            setIsLoading(false);
        };

        setupRealtime();

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [conversationId, user]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: `chat-${Date.now()}`,
            senderId: user?.uid || 'demo-user-123',
            text: newMessage.trim(),
            timestamp: new Date(),
            isOwn: true,
        };

        // Optimistic update for smoother UX
        setChatMessages(prev => [...prev, msg]);
        setNewMessage('');

        // Send via Firebase if authenticated
        if (user?.uid) {
            try {
                await DBService.sendMessage(conversationId, user.uid, msg.text);
            } catch (error) {
                console.error('Failed to send message:', error);
                // Revert on error
                setChatMessages(prev => prev.filter(m => m.id !== msg.id));
            }
        } else {
            // Mock mode - add to DemoManager and simulate reply
            DemoManager.addMessage(conversationId, msg);

            setTimeout(() => {
                const replies = [
                    'Sounds good! Let me know if you have any questions.',
                    'Great, I\'ll be around campus today!',
                    'Sure thing! When works for you?',
                    'Awesome, looking forward to it!',
                ];
                const reply: ChatMessage = {
                    id: `chat-${Date.now() + 1}`,
                    senderId: conversationId,
                    text: replies[Math.floor(Math.random() * replies.length)],
                    timestamp: new Date(),
                    isOwn: false,
                };
                DemoManager.addMessage(conversationId, reply);
                setChatMessages(prev => [...prev, reply]);
            }, 1500);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="px-5 pt-6 pb-4 flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg sticky top-0 z-20">
                <Link
                    href="/messages"
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm shrink-0"
                >
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                {contact && (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full border-2 border-dark dark:border-gray-600 overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                            <img src={contact.senderAvatar} alt={contact.senderName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-dark dark:text-white truncate">{contact.senderName}</p>
                            {contact.listingTitle && (
                                <p className="text-xs text-primary font-bold truncate">{contact.listingTitle}</p>
                            )}
                        </div>
                    </div>
                )}
                {/* Real-time indicator */}
                {user?.uid && (
                    <div className="flex items-center gap-1 text-xs text-green-500 font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </div>
                )}
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">chat_bubble</span>
                        <p className="text-gray-500 font-medium">No messages yet</p>
                        <p className="text-gray-400 text-sm">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium ${msg.isOwn
                                    ? 'bg-primary text-dark rounded-br-md border-2 border-dark dark:border-gray-600'
                                    : 'bg-white dark:bg-dark-surface text-dark dark:text-white rounded-bl-md border-2 border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-dark/50 dark:text-white/50' : 'text-dark/40 dark:text-white/40'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-t-2 border-gray-100 dark:border-gray-700 sticky bottom-0">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 h-12 rounded-full bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 px-5 font-medium placeholder:text-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-primary rounded-full border-2 border-dark dark:border-gray-600 flex items-center justify-center shadow-brutal-sm disabled:opacity-50 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-dark dark:text-white">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
