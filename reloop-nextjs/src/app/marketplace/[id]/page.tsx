'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { DBService } from '@/lib/firebase/db';
import { Listing } from '@/types';
import { useNavStore } from '@/lib/store/nav-store';
import { TradeOfferModal } from '@/components/marketplace/TradeOfferModal';

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
    const { setActions, reset } = useNavStore();
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        const loadListing = async () => {
            setIsLoading(true);
            const id = params.id as string;

            // Try Firebase first
            try {
                const firebaseListing = await DBService.getListingById(id);
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
                router.push('/marketplace');
                return;
            }

            setListing(found);
            setIsLoading(false);
        };

        loadListing();
    }, [params.id, router]);

    // Register nav actions
    useEffect(() => {
        if (!listing) return;

        setActions({
            label: 'Trade',
            onClick: () => setShowTradeModal(true),
            icon: 'swap_horiz'
        });

        return () => reset();
    }, [listing, setActions, reset]);

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
        <div className="relative min-h-screen flex flex-col pb-28 bg-background overflow-x-hidden">
            {/* Hero Image Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full pt-6 pb-16 px-6 flex flex-col items-center justify-start bg-gradient-to-b from-blue-100 via-blue-50 to-background dark:from-blue-900/30 dark:via-blue-900/10 dark:to-background"
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-6 z-10">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <Link href="/marketplace" className="flex items-center justify-center w-12 h-12 bg-white dark:bg-dark-surface rounded-full border-2 border-dark shadow-brutal-sm active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                        </Link>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-bold tracking-widest uppercase text-dark/50 dark:text-white/50"
                    >
                        Item Detail
                    </motion.p>
                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        onClick={() => setIsFavorited(!isFavorited)}
                        className="flex items-center justify-center w-12 h-12 bg-white dark:bg-dark-surface rounded-full border-2 border-dark shadow-brutal-sm active:scale-95 transition-transform"
                    >
                        <span
                            className={`material-symbols-outlined ${isFavorited ? 'text-red-500' : 'text-dark dark:text-white'}`}
                            style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            favorite
                        </span>
                    </motion.button>
                </div>

                {/* Product Image */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative"
                >
                    <div className="w-56 h-56 rounded-3xl border-3 border-dark shadow-brutal overflow-hidden bg-white dark:bg-dark-surface">
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {listing.isTopImpact && (
                        <motion.div
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: -4 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className="absolute -bottom-3 -right-3 bg-primary text-dark px-4 py-2 rounded-xl border-2 border-dark shadow-brutal-sm flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined material-symbols-filled text-lg">eco</span>
                            <span className="text-xs font-black uppercase">Top Impact</span>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>

            {/* Content Card */}
            <motion.div
                className="flex-1 w-full px-4 -mt-6 z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="bg-white dark:bg-dark-surface w-full rounded-3xl border-3 border-dark shadow-brutal p-5 space-y-5">

                    {/* Eco Impact Banner */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-primary rounded-2xl border-2 border-dark shadow-brutal-sm p-4 relative overflow-hidden"
                    >
                        <div className="absolute right-[-10px] top-[-10px] opacity-20">
                            <span className="material-symbols-outlined material-symbols-filled text-[80px]">eco</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined material-symbols-filled text-lg text-dark">eco</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-dark/70">Eco Impact</p>
                        </div>
                        <h3 className="text-xl font-black text-dark uppercase">You save {co2Saved}kg CO₂</h3>
                    </motion.div>

                    {/* Title & Price */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-2xl font-black text-dark dark:text-white uppercase tracking-tight">{listing.title}</h1>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-xl border-2 border-dark font-bold text-dark">
                                <span className="text-lg">🪙</span> {listing.price} Coins
                            </span>
                            {listing.location && (
                                <span className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-dark-bg rounded-xl text-sm font-medium text-dark/60 dark:text-white/60">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {listing.location}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* Impact Stats Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
                        {[
                            { icon: 'water_drop', label: 'Water', bg: 'bg-blue-100' },
                            { icon: 'delete', label: 'Waste', bg: 'bg-orange-100' },
                            { icon: 'forest', label: 'Points', bg: 'bg-green-100' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.icon}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                                className="flex flex-col items-center gap-1"
                            >
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl border-2 border-dark flex items-center justify-center`}>
                                    <span className="material-symbols-outlined material-symbols-filled text-xl text-dark">{stat.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold text-dark/60 dark:text-white/60 uppercase">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Details */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-dark/40 dark:text-white/40">Condition</span>
                            <p className="text-base font-bold text-dark dark:text-white">{listing.condition}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-bg">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-dark/40 dark:text-white/40">Category</span>
                            <p className="text-base font-bold text-dark dark:text-white">{listing.category}</p>
                        </div>
                        <div className="col-span-2 mt-1">
                            <p className="text-sm text-dark/70 dark:text-white/70 leading-relaxed">{listing.description}</p>
                        </div>
                    </motion.div>

                    {/* Seller Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-50 dark:bg-dark-bg p-4 rounded-2xl flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-11 h-11 rounded-full border-2 border-dark overflow-hidden bg-gray-200">
                                    <img src={listing.seller.avatar} alt={listing.seller.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-dark-surface" />
                            </div>
                            <div>
                                <p className="font-bold text-dark dark:text-white">{listing.seller.name}</p>
                                <p className="text-xs text-dark/50 dark:text-white/50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-primary text-xs">bolt</span>
                                    Responds in {listing.seller.responseTime || '2h'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push(`/messages/${listing.seller.id}`)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-dark-surface border-2 border-dark shadow-brutal-sm active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-dark dark:text-white">chat</span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>

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
                        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50 flex items-center gap-2 w-max"
                    >
                        <span className="material-symbols-outlined text-green-400">check_circle</span>
                        Trade offer sent!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
