'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ScannerService from '@/lib/scanner-service';
import { ScanResult, ItemClassification } from '@/types';
import { useNavStore } from '@/lib/store/nav-store';
import { PageHeader } from '@/components/ui/PageHeader';

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function ScanResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const [showImage, setShowImage] = useState(false);
    const { setActions, reset } = useNavStore();

    useEffect(() => {
        const storedResult = ScannerService.getStoredResult();
        const storedImage = ScannerService.getStoredImage();

        if (!storedResult) {
            router.push('/scanner');
            return;
        }

        setResult(storedResult);
        setScannedImage(storedImage);
    }, [router]);

    useEffect(() => {
        setActions({
            label: 'Done',
            onClick: () => router.push('/'),
            variant: 'primary'
        });
        return () => reset();
    }, [router, setActions, reset]);

    if (!result) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { item } = result;
    const classification = result.classification || 'safe';
    const xpEarned = result.xpEarned || 15;

    const isSafe = classification === 'safe';
    const isHazardous = classification === 'hazardous';
    const isNonReusable = classification === 'non_reusable';

    const classificationStyles: Record<ItemClassification, { bg: string; text: string; icon: string }> = {
        safe: { bg: 'bg-card-green', text: 'Safe & Reusable', icon: 'check_circle' },
        hazardous: { bg: 'bg-orange-200 dark:bg-orange-900', text: 'Hazardous', icon: 'warning' },
        non_reusable: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'Recycle Only', icon: 'recycling' }
    };

    const currentStyle = classificationStyles[classification];

    // Build action items based on classification
    const actions = [];

    if (isSafe) {
        actions.push({ href: '/scanner/ideas', icon: 'palette', label: 'DIY Ideas', color: 'bg-card-pink' });
        actions.push({ href: '/makeover', icon: 'brush', label: 'Art Makeover', color: 'bg-gradient-to-br from-pink-200 to-purple-200' });
    }

    if (isSafe || isHazardous) {
        actions.push({
            href: `/marketplace/create?title=${encodeURIComponent(item.objectName)}&category=${encodeURIComponent(item.category)}&condition=${encodeURIComponent(item.condition || 'Good')}&price=${item.estimatedCoins}`,
            icon: 'storefront',
            label: 'Sell',
            color: 'bg-card-blue',
            badge: `~${item.estimatedCoins} coins`
        });
    }

    if (isSafe) {

    }

    actions.push({
        href: '/recycle',
        icon: 'recycling',
        label: 'Recycle',
        color: isNonReusable ? 'bg-card-green' : 'bg-gray-100 dark:bg-gray-800'
    });

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title={item.objectName} backHref="/scanner" />

            <motion.div
                className="px-5 pb-28 space-y-4"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
                {/* Classification + Stats Row */}
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                    {/* Classification Badge */}
                    <div className={`flex-1 ${currentStyle.bg} rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4 flex items-center gap-3`}>
                        <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl text-dark">{currentStyle.icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-dark dark:text-white text-sm">{currentStyle.text}</p>
                            <p className="text-xs text-dark/60 dark:text-white/60">{item.category}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Rewards Row - Compact */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                    <div className="bg-card-yellow rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3 text-center">
                        <p className="text-2xl font-black text-dark dark:text-white">+{xpEarned}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">XP Earned</p>
                    </div>
                    <div className="bg-card-green rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3 text-center">
                        <p className="text-2xl font-black text-dark dark:text-white">{item.co2Savings}</p>
                        <p className="text-xs font-bold text-dark/60 dark:text-white/60">kg CO₂ Saved</p>
                    </div>
                </motion.div>

                {/* Scanned Image - Thumbnail with expand */}
                {scannedImage && (
                    <motion.div variants={itemVariants}>
                        <button
                            onClick={() => setShowImage(!showImage)}
                            className="w-full bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden"
                        >
                            <img
                                src={scannedImage}
                                alt="Scanned item"
                                className={`w-full object-cover transition-all ${showImage ? 'h-48' : 'h-20'}`}
                            />
                            <div className="p-2 flex items-center justify-center gap-1 text-xs font-bold text-dark/50 dark:text-white/50">
                                <span className="material-symbols-outlined text-sm">{showImage ? 'expand_less' : 'expand_more'}</span>
                                {showImage ? 'Collapse' : 'View photo'}
                            </div>
                        </button>
                    </motion.div>
                )}

                {/* Quick Actions Grid - Compact */}
                <motion.div variants={itemVariants}>
                    <p className="font-bold text-dark dark:text-white text-sm mb-2 ml-1">Quick Actions</p>
                    <div className={`grid ${actions.length <= 3 ? 'grid-cols-3' : 'grid-cols-3'} gap-2`}>
                        {actions.slice(0, 3).map((action) => (
                            <Link key={action.href} href={action.href}>
                                <div className={`${action.color} rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3 flex flex-col items-center gap-1 hover:-translate-y-1 transition-transform min-h-[80px] justify-center`}>
                                    <span className="material-symbols-outlined text-2xl text-dark dark:text-white">{action.icon}</span>
                                    <span className="text-[10px] font-[800] text-dark dark:text-white text-center">{action.label}</span>
                                    {action.badge && (
                                        <span className="text-[9px] font-bold text-dark/60 dark:text-white/60">{action.badge}</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* More actions row */}
                    {actions.length > 3 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {actions.slice(3).map((action) => (
                                <Link key={action.href} href={action.href}>
                                    <div className={`${action.color} rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3 flex items-center gap-3 hover:-translate-y-1 transition-transform`}>
                                        <span className="material-symbols-outlined text-xl text-dark dark:text-white">{action.icon}</span>
                                        <span className="text-xs font-[800] text-dark dark:text-white">{action.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Scan Another Button */}
                <motion.div variants={itemVariants}>
                    <Link href="/scanner">
                        <button className="w-full py-4 bg-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-brutal-sm border-2 border-dark hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">photo_camera</span>
                            Scan Another Item
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
