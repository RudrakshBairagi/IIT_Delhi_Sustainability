'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { RecycleZone } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

function RecycleContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const itemTitle = searchParams.get('item') || 'Your Item';

    const [zones] = useState<RecycleZone[]>(DemoManager.getRecycleZones());
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [qrGenerated, setQrGenerated] = useState(false);

    const handleGenerateQR = async () => {
        if (!selectedZone) return;
        setGenerating(true);
        await DemoManager.simulateDelay(1500);
        DemoManager.sendToRecycling(itemTitle, selectedZone);
        setGenerating(false);
        setQrGenerated(true);
    };

    if (qrGenerated) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-28 h-28 bg-white rounded-2xl border-4 border-dark shadow-brutal flex items-center justify-center mb-6">
                    <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className={`w-3 h-3 ${Math.random() > 0.4 ? 'bg-dark' : 'bg-white'}`} />
                        ))}
                    </div>
                </div>
                <h1 className="text-2xl font-black text-dark dark:text-white mb-2">QR Ready!</h1>
                <p className="text-dark/70 dark:text-white/70 mb-6 text-sm">
                    Show at {zones.find(z => z.id === selectedZone)?.name}
                </p>
                <div className="bg-card-green rounded-2xl border-2 border-dark shadow-brutal-sm p-4 mb-6 w-full flex justify-center gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-black text-dark">+5</p>
                        <p className="text-xs font-bold text-dark/70">🪙 Coins</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-dark">+10</p>
                        <p className="text-xs font-bold text-dark/70">⭐ XP</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-dark text-white font-black py-4 rounded-2xl border-2 border-dark shadow-brutal"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Recycling Zone" backHref="/scanner/result" />

            <motion.div
                className="px-5 pb-28 space-y-4"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
                {/* Compact rewards preview at top */}
                <motion.div variants={itemVariants} className="flex items-center gap-3 bg-card-green rounded-xl border-2 border-dark shadow-brutal-sm px-4 py-3">
                    <span className="material-symbols-outlined text-dark">recycling</span>
                    <span className="text-sm font-bold text-dark flex-1">Drop off to earn:</span>
                    <span className="bg-white rounded-full px-2 py-1 border border-dark font-black text-xs">+5 🪙</span>
                    <span className="bg-white rounded-full px-2 py-1 border border-dark font-black text-xs">+10 ⭐</span>
                </motion.div>

                {/* Recycling Zones - Simplified */}
                <motion.div variants={itemVariants} className="space-y-2">
                    <p className="font-bold text-dark dark:text-white text-sm ml-1">Select Location</p>
                    {zones.map((zone) => (
                        <div
                            key={zone.id}
                            onClick={() => setSelectedZone(zone.id)}
                            className={`bg-white dark:bg-dark-surface rounded-xl border-2 ${selectedZone === zone.id
                                ? 'border-green-500 ring-2 ring-green-200'
                                : 'border-dark dark:border-gray-600'
                                } shadow-brutal-sm p-3 cursor-pointer transition-all flex items-center gap-3`}
                        >
                            {selectedZone === zone.id ? (
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white text-sm">check</span>
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-gray-100 dark:bg-dark-bg rounded-full border-2 border-dashed border-gray-300 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-dark dark:text-white text-sm">{zone.name}</p>
                                <p className="text-xs text-dark/50 dark:text-white/50 truncate">{zone.location}</p>
                            </div>
                            {zone.distance && (
                                <span className="bg-card-blue px-2 py-1 rounded-lg text-xs font-bold border border-dark shrink-0">
                                    {zone.distance}
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Generate QR Button */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={handleGenerateQR}
                        disabled={!selectedZone || generating}
                        className={`w-full py-4 rounded-2xl border-2 border-dark shadow-brutal font-black text-lg transition-all flex items-center justify-center gap-2 ${selectedZone
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined">qr_code_2</span>
                        {generating ? 'Generating...' : 'Get Drop-off QR'}
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}

// Loading fallback for Suspense
function RecycleLoading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function RecyclePage() {
    return (
        <Suspense fallback={<RecycleLoading />}>
            <RecycleContent />
        </Suspense>
    );
}
