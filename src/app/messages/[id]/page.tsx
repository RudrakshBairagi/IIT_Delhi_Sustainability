'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { DBService } from '@/lib/firebase/db';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ChatMessage, Message } from '@/types';
import { useNavContext, NavPresets } from '@/lib/hooks/useNavContext';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { InlineOffer } from '@/components/chat/InlineOffer';
import { OfferCard } from '@/components/chat/OfferCard';
import { QRCodeMessage } from '@/components/chat/QRCodeMessage';

// Format price as Indian Rupees
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.id as string;
    const { user } = useAuth();
    const [messages, setChatMessages] = useState<ChatMessage[]>([]);
    const [contact, setContact] = useState<Message | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showOfferUI, setShowOfferUI] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Real-time message subscription
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const setupRealtime = async () => {
            if (user?.uid) {
                try {
                    const conversations = await DBService.getConversations(user.uid);
                    const conv: any = conversations.find((c: any) => c.id === conversationId);

                    if (conv) {
                        const otherParticipantId = conv.participants.find((p: string) => p !== user.uid);
                        const contactName = conv.sellerName || conv.otherParticipantName || 'User';
                        const contactAvatar = conv.sellerAvatar || conv.otherParticipantAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=4ce68a&color=fff`;

                        setContact({
                            id: conv.id,
                            senderId: otherParticipantId || conversationId,
                            senderName: contactName,
                            senderAvatar: contactAvatar,
                            lastMessage: '',
                            timestamp: new Date(),
                            unread: false,
                            conversationType: conv.listingId ? 'marketplace' : 'community',
                            listingTitle: conv.listingTitle,
                            listingPrice: conv.listingPrice,
                            listingImage: conv.listingImage,
                            listingId: conv.listingId,
                        });
                    }

                    unsubscribe = DBService.subscribeToMessages(conversationId, (firebaseMessages) => {
                        const formattedMessages = firebaseMessages.map((m: any) => ({
                            id: m.id,
                            senderId: m.senderId,
                            text: m.text,
                            timestamp: m.timestamp?.toDate?.() || new Date(),
                            isOwn: m.senderId === user.uid,
                            read: m.read || false,
                            type: m.type || 'text',
                            offerAmount: m.offerAmount,
                            offerStatus: m.offerStatus,
                            counterAmount: m.counterAmount,
                            qrType: m.qrType,
                            qrData: m.qrData,
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
            const found = allMessages.find(m => m.id === conversationId) ||
                allMessages.find(m => m.senderId === conversationId);
            if (found) setContact(found as Message);
            setChatMessages(DemoManager.getConversation(conversationId));
            DemoManager.markConversationRead(conversationId);
            setIsLoading(false);
        };

        setupRealtime();

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

    // Dynamic navigation context for chat
    const navContextConfig = useMemo(() => {
        if (!contact) return null;
        if (contact.conversationType !== 'marketplace') return null;

        return NavPresets.chat({
            onOffer: () => {
                const offerAmount = contact.listingPrice
                    ? Math.round(contact.listingPrice * 0.9)
                    : 0;
                setNewMessage(`I'd like to offer ${formatPrice(offerAmount)} for this item. Let me know if that works!`);
            },
            onBack: () => router.back(),
            onCall: () => {
                alert('Calling feature coming soon!');
            },
            onAttach: () => {
                alert('Attach media coming soon!');
            },
        });
    }, [contact, router]);

    useNavContext(navContextConfig);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: `chat-${Date.now()}`,
            senderId: user?.uid || 'demo-user-123',
            text: newMessage.trim(),
            timestamp: new Date(),
            isOwn: true,
        };

        setChatMessages(prev => [...prev, msg]);
        setNewMessage('');

        if (user?.uid) {
            try {
                await DBService.sendMessage(conversationId, user.uid, msg.text);
            } catch (error) {
                console.error('Failed to send message:', error);
                setChatMessages(prev => prev.filter(m => m.id !== msg.id));
            }
        } else {
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
            <div className="min-h-screen bg-[#f1f8f6] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f8f6] text-[#29302f] font-body flex flex-col">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full z-50 bg-[#f1f8f6]/80 backdrop-blur-xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]">
                <div className="flex justify-between items-center px-6 py-4 w-full">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center hover:bg-[#eaf2f0] transition-colors rounded-full active:scale-95 duration-200">
                            <span className="material-symbols-outlined text-[#29664c]">arrow_back</span>
                        </button>
                        {contact && (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        alt={contact.senderName}
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={contact.senderAvatar}
                                    />
                                    {user?.uid && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#006946] border-2 border-[#f1f8f6] rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-[#29302f] font-headline font-extrabold tracking-tight">{contact.senderName}</h1>
                                    {user?.uid ? (
                                        <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#006946]">Live</span>
                                    ) : (
                                        <span className="text-[10px] font-label font-bold uppercase tracking-widest text-[#565d5c]">Demo Mode</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="hover:bg-[#eaf2f0] transition-colors p-2 rounded-full active:scale-95 duration-200">
                        <span className="material-symbols-outlined text-[#29664c]">more_vert</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 pt-24 pb-32 overflow-y-auto no-scrollbar">
                {/* Product Header Card */}
                {contact && (contact.conversationType === 'marketplace' || contact.listingTitle) && (
                    <div className="px-6 mb-8">
                        <div className="bg-[#ffffff] rounded-xl p-4 flex items-center gap-4 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.04)]">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#e1eae8] shrink-0">
                                <img
                                    alt={contact.listingTitle || 'Item'}
                                    className="w-full h-full object-cover"
                                    src={contact.listingImage || 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=100&h=100&fit=crop'}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-headline font-bold text-[#29302f] truncate">{contact.listingTitle}</h2>
                                {contact.listingPrice && (
                                    <p className="text-[#29664c] font-bold">{formatPrice(contact.listingPrice)}</p>
                                )}
                            </div>
                            {contact.conversationType === 'marketplace' && contact.listingPrice && (
                                <button
                                    onClick={() => setShowOfferUI(true)}
                                    className="bg-[#29664c] text-[#c8ffe0] px-5 py-2 rounded-lg font-bold text-sm hover:scale-95 transition-transform active:bg-[#1b5a40] shrink-0"
                                >
                                    Offer
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Area */}
                <div className="bg-[#ffffff] rounded-t-[3rem] min-h-full px-6 pt-10 pb-20 space-y-6">
                    {/* System/Date Message */}
                    <div className="flex justify-center">
                        <span className="bg-[#eaf2f0] text-[#565d5c] px-4 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest">Today</span>
                    </div>

                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="material-symbols-outlined text-5xl text-[#a7afad] mb-4">chat_bubble</span>
                            <p className="text-[#565d5c] font-medium">No messages yet</p>
                            <p className="text-[#a7afad] text-sm">Start the conversation!</p>
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
                                {/* Offer Card */}
                                {msg.type === 'offer' && msg.offerAmount ? (
                                    <OfferCard
                                        amount={msg.offerAmount}
                                        status={msg.offerStatus || 'pending'}
                                        counterAmount={msg.counterAmount}
                                        isSeller={!msg.isOwn}
                                        isOwn={msg.isOwn}
                                        onAccept={async () => {
                                            if (user?.uid && msg.offerAmount && contact) {
                                                try {
                                                    await DBService.updateOfferStatus(
                                                        conversationId,
                                                        msg.id,
                                                        'accepted',
                                                        undefined,
                                                        msg.offerAmount,
                                                        contact.listingId,
                                                        contact.listingTitle,
                                                        user.uid,
                                                        msg.senderId
                                                    );
                                                    if (contact.listingId) {
                                                        await DBService.updateListingStatus(contact.listingId, 'pending');
                                                        alert(`🎉 Deal confirmed! Pickup QR sent to buyer.`);
                                                    }
                                                } catch (error) {
                                                    console.error('Error accepting offer:', error);
                                                    alert('Failed to accept offer. Please try again.');
                                                }
                                            }
                                        }}
                                        onDecline={async () => {
                                            if (user?.uid) {
                                                try {
                                                    await DBService.updateOfferStatus(conversationId, msg.id, 'declined');
                                                } catch (error) {
                                                    console.error('Error declining offer:', error);
                                                }
                                            }
                                        }}
                                        timestamp={msg.timestamp}
                                    />
                                ) : msg.type === 'qr' && msg.qrData ? (
                                    <QRCodeMessage
                                        type={msg.qrType || 'pickup'}
                                        qrData={msg.qrData}
                                        isOwn={msg.isOwn}
                                        timestamp={msg.timestamp}
                                    />
                                ) : msg.type === 'system' ? (
                                    <div className="w-full text-center py-2">
                                        <span className="text-xs text-[#565d5c] bg-[#eaf2f0] px-3 py-1 rounded-full">
                                            {msg.text}
                                        </span>
                                    </div>
                                ) : (
                                    /* Regular text message */
                                    <div className="flex flex-col gap-2 max-w-[80%]">
                                        <div
                                            className={`p-4 text-sm font-medium ${msg.isOwn
                                                ? 'bg-[#29664c] text-[#c8ffe0] rounded-t-xl rounded-l-xl shadow-[0_10px_20px_-5px_rgba(41,102,76,0.2)]'
                                                : 'bg-[#eaf2f0] text-[#29302f] rounded-t-xl rounded-r-xl'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <div className={`flex items-center gap-1 ${msg.isOwn ? 'justify-end mr-1' : 'ml-1'}`}>
                                            <span className="text-[10px] text-[#717877]">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.isOwn && (
                                                <span className={`text-[10px] ${msg.read ? 'text-[#006946]' : 'text-[#a7afad]'}`}>
                                                    {msg.read ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}

                    {/* Quick Replies */}
                    {contact && contact.conversationType === 'marketplace' && showQuickReplies && !showOfferUI && (
                        <div className="flex flex-wrap gap-3 pt-4">
                            <button
                                onClick={() => { setNewMessage('Is this still available?'); setShowQuickReplies(false); }}
                                className="bg-[#d4dfdd] text-[#29302f] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#b9f9d6] transition-colors active:scale-95 border border-[#a7afad]/10"
                            >
                                Is this still available?
                            </button>
                            <button
                                onClick={() => { setNewMessage("What's your best price?"); setShowQuickReplies(false); }}
                                className="bg-[#d4dfdd] text-[#29302f] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#b9f9d6] transition-colors active:scale-95 border border-[#a7afad]/10"
                            >
                                What&apos;s your best price?
                            </button>
                            <button
                                onClick={() => { setNewMessage('Can you send your location?'); setShowQuickReplies(false); }}
                                className="bg-[#d4dfdd] text-[#29302f] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#b9f9d6] transition-colors active:scale-95 border border-[#a7afad]/10"
                            >
                                Send location
                            </button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Inline Offer UI */}
            <AnimatePresence>
                {showOfferUI && contact?.listingPrice && (
                    <InlineOffer
                        listingPrice={contact.listingPrice}
                        onSubmit={async (amount) => {
                            setShowOfferUI(false);
                            if (user?.uid) {
                                try {
                                    await DBService.sendOffer(
                                        conversationId,
                                        user.uid,
                                        amount,
                                        contact.listingTitle
                                    );
                                } catch (error) {
                                    console.error('Error sending offer:', error);
                                    alert('Failed to send offer. Please try again.');
                                }
                            } else {
                                const offerMessage = `💰 Offer: ${amount} coins\n\nI'd like to offer ${amount} coins for "${contact.listingTitle}". Let me know if that works!`;
                                const msg: ChatMessage = {
                                    id: `chat-${Date.now()}`,
                                    senderId: 'demo-user-123',
                                    text: offerMessage,
                                    timestamp: new Date(),
                                    isOwn: true,
                                    type: 'offer',
                                    offerAmount: amount,
                                    offerStatus: 'pending',
                                };
                                setChatMessages(prev => [...prev, msg]);
                                DemoManager.addMessage(conversationId, msg);
                            }
                        }}
                        onCancel={() => setShowOfferUI(false)}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Input Area */}
            {!showOfferUI && (
                <footer className="fixed bottom-0 w-full z-50 bg-[#f1f8f6]/80 backdrop-blur-xl pt-4 pb-10 px-6">
                    <div className="flex items-center gap-3">
                        {contact?.conversationType === 'marketplace' && (
                            <button
                                onClick={() => setShowQuickReplies(!showQuickReplies)}
                                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${showQuickReplies
                                    ? 'bg-[#d1fee5] text-[#3c6451]'
                                    : 'bg-[#e1eae8] text-[#565d5c]'
                                    }`}
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                            </button>
                        )}
                        <div className="flex-1 relative">
                            <input
                                className="w-full h-12 bg-[#d4dfdd] border-none rounded-full px-6 text-[#29302f] placeholder:text-[#717877] font-medium focus:ring-2 focus:ring-[#b9f9d6] transition-all outline-none"
                                placeholder="Type a message..."
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="w-12 h-12 flex items-center justify-center bg-[#29664c] text-[#c8ffe0] rounded-full hover:scale-95 transition-transform shadow-lg active:bg-[#1b5a40] disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                        </button>
                    </div>
                </footer>
            )}

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
