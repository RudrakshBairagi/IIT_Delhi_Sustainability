'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import DemoManager from '@/lib/demo-manager';
import { SmartBag } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const STATUS_STEPS = ['registered', 'filled', 'collected', 'processed'];

export default function SmartBagDetailPage() {
    const router = useRouter();
    const params = useParams();
    const bagId = params.id as string;

    const [bag, setBag] = useState<SmartBag | null>(null);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        const allBags = DemoManager.getAllSmartBags();
        const found = allBags.find(b => b.id === bagId);
        setBag(found || null);
    }, [bagId]);

    const handleMarkAsFilled = async () => {
        setMarking(true);
        await DemoManager.simulateDelay(1000);

        DemoManager.markBagAsFilled(bagId, 'recyclable');

        const allBags = DemoManager.getAllSmartBags();
        const updated = allBags.find(b => b.id === bagId);
        setBag(updated || null);

        setMarking(false);
    };

    if (!bag) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-dark/60 dark:text-white/60">Bag not found</p>
            </div>
        );
    }

    const currentStepIndex = STATUS_STEPS.indexOf(bag.status);
    const statusProgress = ((currentStepIndex + 1) / STATUS_STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Bag Details" backHref="/smart-bags" />

            <motion.div
                className="px-5 pb-28 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* QR Code Card */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl border-3 border-dark shadow-brutal p-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-xl border-2 border-dark">
                            <QRCode value={bag.qrCode} size={180} />
                        </div>
                    </div>
                    <p className="text-center font-black text-dark dark:text-white text-lg">{bag.qrCode}</p>
                    <p className="text-center text-sm text-dark/60 dark:text-white/60 mt-1">Worker scans this QR for collection</p>
                </div>

                {/* Status Timeline */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-6">
                    <p className="font-black text-dark dark:text-white mb-4">Status Timeline</p>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${statusProgress}%` }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-0 top-0 h-full bg-green-500"
                        />
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-4">
                        {STATUS_STEPS.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            const icons: Record<string, string> = {
                                registered: 'add_circle',
                                filled: 'shopping_bag',
                                collected: 'local_shipping',
                                processed: 'check_circle'
                            };

                            const labels: Record<string, string> = {
                                registered: 'Registered to your account',
                                filled: 'Marked as filled',
                                collected: 'Collected by worker',
                                processed: 'Processed & coins awarded'
                            };

                            return (
                                <div key={step} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted
                                            ? 'bg-green-500 border-green-600'
                                            : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                                        }`}>
                                        <span
                                            className={`material-symbols-outlined ${isCompleted ? 'text-white' : 'text-gray-400'}`}
                                            style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                                        >
                                            {icons[step]}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${isCompleted
                                                ? 'text-dark dark:text-white'
                                                : 'text-dark/40 dark:text-white/40'
                                            }`}>
                                            {labels[step]}
                                        </p>
                                    </div>
                                    {isCurrent && (
                                        <div className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">Current</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bag Info */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-dark/60 dark:text-white/60">Waste Type</span>
                        <span className="text-sm font-bold text-dark dark:text-white capitalize">{bag.wasteType || 'Recyclable'}</span>
                    </div>
                    {bag.estimatedWeight && (
                        <div className="flex justify-between">
                            <span className="text-sm text-dark/60 dark:text-white/60">Weight</span>
                            <span className="text-sm font-bold text-dark dark:text-white">{bag.estimatedWeight.toFixed(1)} kg</span>
                        </div>
                    )}
                    {bag.coinsAwarded && (
                        <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-dark/10">
                            <span className="text-sm text-dark/60 dark:text-white/60">Coins Earned</span>
                            <span className="text-2xl font-black text-green-600 dark:text-green-400">+{bag.coinsAwarded}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {bag.status === 'registered' && (
                    <button
                        onClick={handleMarkAsFilled}
                        disabled={marking}
                        className="w-full bg-green-500 text-white font-black py-4 rounded-2xl border-2 border-dark shadow-brutal flex items-center justify-center gap-2 active:translate-y-0.5 transition-transform"
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        {marking ? 'Marking...' : 'Mark as Filled'}
                    </button>
                )}

                {bag.status === 'filled' && (
                    <div className="bg-card-yellow rounded-xl border-2 border-dark shadow-brutal-sm px-4 py-3">
                        <p className="text-sm font-bold text-dark">✅ Ready for Collection</p>
                        <p className="text-xs text-dark/70 mt-1">
                            Drop this bag at any Reloop Point. A worker will scan and weigh it to award you coins!
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
