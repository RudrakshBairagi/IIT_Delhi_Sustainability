'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { DBService } from '@/lib/firebase/db';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Listing } from '@/types';
import { useNavContext, NavPresets } from '@/lib/hooks/useNavContext';
import { TradeOfferModal } from '@/components/marketplace/TradeOfferModal';

// Format price as Indian Rupees
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function ItemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isDemo } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Owner detection
    const currentUserId = isDemo ? 'demo-user-123' : user?.uid;
    const isOwner = listing?.seller?.id === currentUserId;

    useEffect(() => {
        const loadListing = async () => {
            setIsLoading(true);
            const id = params.id as string;

            // Try Firebase first with timeout
            try {
                const firebasePromise = DBService.getListingById(id);
                const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));

                const firebaseListing = await Promise.race([firebasePromise, timeoutPromise]);

                if (firebaseListing) {
                    setListing(firebaseListing);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Firebase listing fetch failed:', error);
            }

            // Fallback to DemoManager
            const found = DemoManager.getListingById?.(id);
            if (!found) {
                console.log('Listing not found in Firebase or DemoManager, redirecting...');
                router.push('/marketplace');
                return;
            }

            setListing(found);
            setIsLoading(false);
        };

        loadListing();
    }, [params.id, router]);

    // Dynamic navigation context using presets
    const navContextConfig = useMemo(() => {
        if (!listing) return null;

        return NavPresets.itemDetail({
            onMessage: () => router.push(`/messages/new?itemId=${listing.id}&sellerId=${listing.seller?.id}`),
            onBack: () => router.back(),
            onShare: () => {
                if (navigator.share) {
                    navigator.share({
                        title: listing.title,
                        text: `Check out ${listing.title} on ReLoop!`,
                        url: window.location.href,
                    });
                }
            },
            onSave: () => setIsFavorited(!isFavorited),
            isOwner,
            onEdit: () => router.push(`/marketplace/${listing.id}/edit`),
        });
    }, [listing, isOwner, isFavorited, router]);

    // Register the navigation context
    useNavContext(navContextConfig);

    const handleTradeSuccess = () => {
        setShowTradeModal(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    if (isLoading || !listing) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    const co2Saved = listing.co2Saved || 15;
    const ecoPoints = Math.round((listing.price || 0) * 1.5);

    return (
        <div className="bg-surface text-on-surface antialiased overflow-x-hidden min-h-screen">
            {/* TopAppBar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#f1f8f6]/80 dark:bg-[#1a1c1b]/80 backdrop-blur-3xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <div className="flex justify-between items-center px-6 h-16 w-full">
                    <button onClick={() => router.push('/marketplace')} className="active:scale-95 transition-transform duration-200 hover:bg-[#eaf2f0] dark:hover:bg-[#2d312f] p-2 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#29664c] dark:text-[#b9f9d6]">arrow_back</span>
                    </button>
                    <h1 className="text-[#29664c] dark:text-[#b9f9d6] font-['Plus_Jakarta_Sans'] font-extrabold tracking-tight text-lg">Item Details</h1>
                    <button onClick={() => setIsFavorited(!isFavorited)} className="active:scale-95 transition-transform duration-200 hover:bg-[#eaf2f0] dark:hover:bg-[#2d312f] p-2 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#29664c] dark:text-[#b9f9d6]" style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                </div>
                <div className="bg-[#eaf2f0] dark:bg-[#2d312f] h-[1px]"></div>
            </header>

            <main className="pt-20 pb-32 px-6 space-y-8 max-w-lg mx-auto">
                {/* Hero Section */}
                <section className="w-full">
                    <div className="relative w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
                        <img 
                            className="w-full h-full object-cover" 
                            alt={listing.title} 
                            src={(listing.images && listing.images.length > 0) ? listing.images[0] : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&fit=crop'}
                        />
                    </div>
                </section>

                {/* Impact Badge */}
                <section className="bg-primary shadow-[0_20px_40px_rgba(41,102,76,0.15)] rounded-lg p-5 flex items-center gap-4 text-white">
                    <div className="bg-primary-dim p-3 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Eco Impact</p>
                        <p className="font-extrabold text-lg leading-tight">YOU CAN SAVE {co2Saved} KG OF CO2</p>
                    </div>
                </section>

                {/* Product Info Title */}
                <section>
                    <h2 className="text-3xl font-extrabold tracking-tight text-on-surface uppercase">{listing.title}</h2>
                    <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                        Sustainability Score: {listing.isTopImpact ? '95/100' : '88/100'}
                    </p>
                </section>

                {/* Price & Action */}
                <section className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Price</span>
                        <span className="text-2xl font-extrabold text-primary">{listing.price > 0 ? `${listing.price} Coins` : 'FREE'}</span>
                    </div>
                    {!isOwner ? (
                        <button 
                            onClick={() => setShowTradeModal(true)}
                            className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-white h-14 rounded-full flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">swap_horiz</span>
                            REQUEST FOR TRADE
                        </button>
                    ) : (
                        <div className="flex-1 flex gap-2">
                            <button 
                                onClick={() => router.push(`/marketplace/${listing.id}/edit`)}
                                className="flex-1 bg-surface-container-high text-on-surface h-14 rounded-full flex items-center justify-center gap-2 font-bold shadow-sm hover:shadow-md active:scale-95 transition-all"
                            >
                                <span className="material-symbols-outlined">edit</span>
                                EDIT
                            </button>
                        </div>
                    )}
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-3 gap-4">
                    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container z-10">
                            <span className="material-symbols-outlined text-[20px]">water_drop</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest z-10 text-on-surface">Water</span>
                        <div className="absolute inset-0 bg-secondary-container/0 group-hover:bg-secondary-container/10 transition-colors"></div>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container z-10">
                            <span className="material-symbols-outlined text-[20px]">delete_outline</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest z-10 text-on-surface">Waste</span>
                        <div className="absolute inset-0 bg-secondary-container/0 group-hover:bg-secondary-container/10 transition-colors"></div>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden group">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container z-10">
                            <span className="material-symbols-outlined text-[20px]">forest</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest z-10 text-on-surface">Points</span>
                        <div className="absolute inset-0 bg-secondary-container/0 group-hover:bg-secondary-container/10 transition-colors"></div>
                    </div>
                </section>

                {/* Condition/Category */}
                <section className="flex gap-4">
                    <div className="flex-1 bg-surface-container-highest/30 p-4 rounded-lg">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Condition</p>
                        <p className="font-bold text-on-surface">{listing.condition || 'N/A'}</p>
                    </div>
                    <div className="flex-1 bg-surface-container-highest/30 p-4 rounded-lg">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</p>
                        <p className="font-bold text-on-surface">{listing.category || 'N/A'}</p>
                    </div>
                </section>

                {/* Description */}
                <section className="space-y-2 bg-surface-container-lowest p-4 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">description</span>
                        Description
                    </h3>
                    <p className="text-on-surface leading-relaxed text-sm font-medium">{listing.description}</p>
                </section>

                {/* Owner Info */}
                {!isOwner && listing.seller && (
                    <section className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-surface" 
                                    alt={listing.seller.name} 
                                    src={listing.seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller.name)}&background=29664c&color=fff`}
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-on-surface text-sm">{listing.seller.name}</h4>
                                <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-[12px] text-primary">schedule</span>
                                    Responds in {listing.seller.responseTime || '2h'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => router.push(`/messages/new?sellerId=${listing.seller.id}&listingId=${listing.id}&listingTitle=${encodeURIComponent(listing.title)}`)}
                            className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                        >
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </button>
                    </section>
                )}
            </main>

            {/* Modals and Toasts overlay */}
            <AnimatePresence>
                {showTradeModal && (
                    <TradeOfferModal
                        targetListing={listing}
                        onClose={() => setShowTradeModal(false)}
                        onSuccess={handleTradeSuccess}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#29302f] text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50 flex items-center gap-2 w-max"
                    >
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        Trade offer sent!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
