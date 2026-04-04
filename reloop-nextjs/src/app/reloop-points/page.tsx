'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import DemoManager from '@/lib/demo-manager';
import { ReloopPoint } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function ReloopPointsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listingId');
    const listingTitle = searchParams.get('title') || 'Your Item';

    const [points] = useState<ReloopPoint[]>(DemoManager.getReloopPoints());
    const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
    const [dropping, setDropping] = useState(false);
    const [dropped, setDropped] = useState(false);
    const [expiryDate, setExpiryDate] = useState<Date | null>(null);

    const handleDropOff = async () => {
        if (!selectedPoint || !listingId) return;

        setDropping(true);
        await DemoManager.simulateDelay(1500);

        const result = DemoManager.dropItemAtPoint(listingId, selectedPoint);

        if (result.success) {
            setExpiryDate(result.expiresAt);
            setDropped(true);
        }

        setDropping(false);
    };

    if (dropped && expiryDate) {
        const daysRemaining = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-28 h-28 bg-green-500 rounded-full border-4 border-dark shadow-brutal flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h1 className="text-2xl font-black text-dark dark:text-white mb-2">Item Dropped!</h1>
                <p className="text-dark/70 dark:text-white/70 mb-6 text-sm max-w-xs">
                    Your item is now listed at {points.find(p => p.id === selectedPoint)?.name}
                </p>
                <div className="bg-card-yellow rounded-2xl border-2 border-dark shadow-brutal-sm p-4 mb-6 w-full max-w-xs">
                    <p className="text-xs font-bold text-dark/70 mb-1">14-Day Liquidity Window</p>
                    <p className="text-2xl font-black text-dark">{daysRemaining} days remaining</p>
                    <p className="text-xs text-dark/50 mt-2">If unsold, you can recycle or donate it</p>
                </div>
                <div className="space-y-3 w-full max-w-xs">
                    <button
                        onClick={() => router.push('/my-listings')}
                        className="w-full bg-dark text-white font-black py-4 rounded-2xl border-2 border-dark shadow-brutal flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">list</span>
                        View My Listings
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-white dark:bg-dark-surface text-dark dark:text-white font-bold py-3 rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Reloop Points" backHref="/marketplace" />

            <motion.div
                className="px-5 pb-28 space-y-4"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
                {/* Info Card */}
                <motion.div variants={itemVariants} className="bg-card-blue rounded-xl border-2 border-dark shadow-brutal-sm px-4 py-3">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-dark text-2xl">info</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-dark">{listingTitle}</p>
                            <p className="text-xs text-dark/70 mt-1">Drop off your item at a Reloop Point. If it doesn&apos;t sell in 14 days, you can recycle or donate it for coins.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Reloop Points List */}
                <motion.div variants={itemVariants} className="space-y-2">
                    <p className="font-bold text-dark dark:text-white text-sm ml-1">Select Drop-off Location</p>
                    {points.map((point) => (
                        <div
                            key={point.id}
                            onClick={() => setSelectedPoint(point.id)}
                            className={`bg-white dark:bg-dark-surface rounded-xl border-2 ${selectedPoint === point.id
                                ? 'border-green-500 ring-2 ring-green-200'
                                : 'border-dark dark:border-gray-600'
                                } shadow-brutal-sm p-4 cursor-pointer transition-all`}
                        >
                            <div className="flex items-start gap-3">
                                {selectedPoint === point.id ? (
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-white">check</span>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-dark-bg rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                                        <span className="text-2xl">{point.icon}</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-dark dark:text-white">{point.name}</p>
                                    <p className="text-xs text-dark/60 dark:text-white/60 mt-0.5">{point.location}</p>
                                    <div className="flex gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-xs text-dark/50 dark:text-white/50">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {point.hours}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-dark/50 dark:text-white/50">
                                            <span className="material-symbols-outlined text-sm">inventory_2</span>
                                            {point.itemsCollected} items
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Drop Off Button */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={handleDropOff}
                        disabled={!selectedPoint || dropping}
                        className={`w-full py-4 rounded-2xl border-2 border-dark shadow-brutal font-black text-lg transition-all flex items-center justify-center gap-2 ${selectedPoint
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined">location_on</span>
                        {dropping ? 'Dropping Off...' : 'Confirm Drop-off'}
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
