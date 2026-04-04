'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Reward, User } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const TABS = ['All', 'Vouchers', 'Merch', 'Donate'];

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('All');
    const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
    const [showHowToEarn, setShowHowToEarn] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        setRewards(DemoManager.getMockRewards());
        setUser(DemoManager.getMockUser());
        setRedeemed(new Set(DemoManager.getRedeemedRewards()));
    }, []);

    const categoryMap: Record<string, string> = {
        'Vouchers': 'voucher',
        'Merch': 'merch',
        'Donate': 'donation',
    };

    const filtered = activeTab === 'All'
        ? rewards
        : rewards.filter(r => r.category === categoryMap[activeTab]);

    const handleRedeem = (reward: Reward) => {
        if (!user || user.coins < reward.cost || redeemed.has(reward.id)) return;
        const success = DemoManager.redeemReward(reward.id, reward.cost);
        if (success) {
            setUser(DemoManager.getMockUser());
            setRedeemed(new Set(DemoManager.getRedeemedRewards()));
            setToast(`Redeemed "${reward.title}"!`);
            setTimeout(() => setToast(''), 3000);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Rewards" backHref="/" />

            <motion.div
                className="px-5 pb-28 space-y-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Balance Card */}
                <motion.div variants={itemVariants} className="bg-primary rounded-2xl border-2 border-dark shadow-brutal p-5 flex items-center justify-between">
                    <div>
                        <p className="text-dark/60 font-bold text-xs uppercase">Your Balance</p>
                        <p className="text-4xl font-[900] text-dark">{user.coins}</p>
                        <p className="text-dark/50 font-bold text-sm">ReCoins</p>
                    </div>
                    <div className="text-5xl">🪙</div>
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto no-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={activeTab === tab ? 'tab-pill-active' : 'tab-pill-inactive'}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>

                {/* Rewards Grid - 2 Column Cards */}
                <motion.div variants={containerVariants} className="grid grid-cols-2 gap-3">
                    {filtered.map((reward) => {
                        const isRedeemed = redeemed.has(reward.id);
                        const canAfford = user.coins >= reward.cost;
                        return (
                            <motion.div key={reward.id} variants={itemVariants}>
                                <div className={`bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden ${!reward.available ? 'opacity-50' : ''}`}>
                                    {/* Icon Header */}
                                    <div className="bg-card-yellow border-b-2 border-dark p-4 flex items-center justify-center">
                                        <span className="text-4xl">{reward.icon}</span>
                                    </div>
                                    {/* Content */}
                                    <div className="p-3 text-center">
                                        <p className="font-bold text-dark dark:text-white text-sm truncate">{reward.title}</p>
                                        <p className="text-[10px] text-dark/50 dark:text-white/50 mt-0.5 line-clamp-2 h-7">{reward.description}</p>
                                        <p className="text-lg font-black text-primary mt-2">🪙 {reward.cost}</p>

                                        {isRedeemed ? (
                                            <div className="mt-2 flex items-center justify-center gap-1 text-primary text-xs font-bold">
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Redeemed
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleRedeem(reward)}
                                                disabled={!canAfford || !reward.available}
                                                className={`mt-2 w-full py-2 rounded-xl border-2 border-dark font-bold text-xs active:scale-95 transition-transform ${canAfford && reward.available
                                                    ? 'bg-primary text-dark'
                                                    : 'bg-gray-100 dark:bg-dark-bg text-dark/40 dark:text-white/40'
                                                    }`}
                                            >
                                                {canAfford ? 'Redeem' : 'Need more coins'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* How to Earn - Collapsible */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={() => setShowHowToEarn(!showHowToEarn)}
                        className="w-full bg-card-blue rounded-xl border-2 border-dark shadow-brutal-sm p-3 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-dark text-lg">help</span>
                            <span className="font-bold text-dark text-sm">How to Earn More</span>
                        </div>
                        <span className={`material-symbols-outlined text-dark transition-transform ${showHowToEarn ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>
                    <AnimatePresence>
                        {showHowToEarn && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-card-blue/50 rounded-b-xl border-2 border-t-0 border-dark p-3 space-y-2">
                                    {[
                                        { icon: 'photo_camera', text: 'Scan items: 10-45 coins' },
                                        { icon: 'swap_horiz', text: 'Complete trades: 25-100 coins' },
                                        { icon: 'flag', text: 'Finish missions: bonus coins' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-dark/60">{item.icon}</span>
                                            <p className="text-xs text-dark/70 font-medium">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
