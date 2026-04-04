'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import DemoManager from '@/lib/demo-manager';
import { Reward } from '@/types';
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

const ACCENT_COLORS: Record<string, string> = {
    voucher: '#4a90e2',
    merch: '#d1a054',
    donation: '#29664c',
};

const ACCENT_ICONS: Record<string, string> = {
    voucher: 'confirmation_number',
    merch: 'checkroom',
    donation: 'volunteer_activism',
};

// Generate a QR-like pattern (simplified visual representation)
function QRPattern({ code }: { code: string }) {
    const size = 140;
    const cellSize = 7;
    const cells = [];

    for (let y = 0; y < size / cellSize; y++) {
        for (let x = 0; x < size / cellSize; x++) {
            const hash = (code.charCodeAt(x % code.length) * (y + 1) + x * 13) % 10;
            if (hash > 4 || x < 2 || y < 2 || x > 17 || y > 17) {
                const isCorner = (x < 3 && y < 3) || (x < 3 && y > 16) || (x > 16 && y < 3);
                if (isCorner || hash > 5) {
                    cells.push(
                        <rect
                            key={`${x}-${y}`}
                            x={x * cellSize}
                            y={y * cellSize}
                            width={cellSize - 1}
                            height={cellSize - 1}
                            fill="currentColor"
                        />
                    );
                }
            }
        }
    }

    return (
        <svg width={size} height={size} className="text-[#29302f]">
            {cells}
            <rect x="0" y="0" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="5" y="5" width="11" height="11" fill="currentColor" />
            <rect x={size - 21} y="0" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x={size - 16} y="5" width="11" height="11" fill="currentColor" />
            <rect x="0" y={size - 21} width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="5" y={size - 16} width="11" height="11" fill="currentColor" />
        </svg>
    );
}

// QR Coupon Modal
function QRCouponModal({ reward, code, onClose }: { reward: Reward; code: string; onClose: () => void }) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-5"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.85, y: 30, rotateX: 15 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Ticket-style Header */}
                <div className="bg-gradient-to-br from-[#29664c] to-[#1b5a40] p-6 text-center relative">
                    <div className="absolute -left-3 top-1/2 w-6 h-6 bg-black/70 rounded-full" />
                    <div className="absolute -right-3 top-1/2 w-6 h-6 bg-black/70 rounded-full" />
                    <motion.span
                        className="text-6xl block mb-3"
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {reward.icon}
                    </motion.span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">{reward.title}</h2>
                    <p className="text-sm text-white/70 font-bold mt-1">{reward.description}</p>
                </div>

                {/* Dashed Separator */}
                <div className="border-t-2 border-dashed border-[#29302f]/20 mx-4" />

                {/* QR Code Section */}
                <div className="p-6 flex flex-col items-center bg-gradient-to-b from-white to-gray-50">
                    <motion.div
                        className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
                        whileHover={{ scale: 1.02 }}
                    >
                        <QRPattern code={code} />
                    </motion.div>

                    {/* Redemption Code */}
                    <div className="mt-5 w-full bg-gray-100 rounded-2xl px-5 py-4 border-2 border-dashed border-[#29302f]/20 text-center">
                        <p className="text-[10px] text-[#29302f]/40 font-extrabold uppercase tracking-widest">Your Coupon Code</p>
                        <p className="text-2xl font-mono font-extrabold text-[#29302f] tracking-[0.2em] mt-1">{code}</p>
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 flex items-center gap-3 bg-primary-container rounded-xl px-4 py-3 w-full">
                        <span className="material-symbols-outlined text-2xl text-on-primary-container">qr_code_scanner</span>
                        <div>
                            <p className="text-sm font-extrabold text-on-primary-container">Show at Counter</p>
                            <p className="text-[10px] text-on-primary-container/50 font-bold">
                                Valid until {expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="p-5 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[#29302f] text-white font-extrabold text-lg rounded-2xl active:scale-[0.98] transition-transform shadow-sm"
                    >
                        Got It! ✓
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Community Donation Celebration Modal
function CommunityStoryModal({ reward, onClose }: { reward: Reward; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-5"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-b from-green-100 via-green-50 to-white"
            >
                <div className="p-8 text-center">
                    <motion.div
                        className="text-8xl mb-4 drop-shadow-lg"
                        animate={{ scale: [1, 1.15, 1], y: [0, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {reward.icon}
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-[#29302f] mb-2 tracking-tight">You Did It! 🎉</h2>
                    <p className="text-[#29302f]/60 font-bold text-lg">{reward.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 px-5 pb-5">
                    <div className="bg-green-100 rounded-2xl p-4 text-center">
                        <p className="text-3xl font-extrabold text-[#29302f]">1</p>
                        <p className="text-xs font-bold text-[#29302f]/50 uppercase tracking-wide">Tree Planted</p>
                    </div>
                    <div className="bg-green-100 rounded-2xl p-4 text-center">
                        <p className="text-3xl font-extrabold text-[#29302f]">20kg</p>
                        <p className="text-xs font-bold text-[#29302f]/50 uppercase tracking-wide">CO₂ Offset</p>
                    </div>
                </div>

                <div className="p-5 flex gap-3 bg-white/50">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-gray-200 text-[#29302f] font-extrabold rounded-2xl active:scale-[0.98] transition-transform"
                    >
                        Done
                    </button>
                    <button
                        onClick={() => {
                            const text = `I just contributed to ${reward.title} on ReLoop! 🌍✨`;
                            if (navigator.share) {
                                navigator.share({ title: 'ReLoop Impact', text, url: window.location.origin }).catch(() => {});
                            } else {
                                navigator.clipboard.writeText(text);
                            }
                        }}
                        className="flex-1 py-4 bg-green-500 text-white font-extrabold rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">share</span>
                        Share
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function RewardsPage() {
    const { user: authUser, isDemo } = useAuth();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [activeTab, setActiveTab] = useState('All');
    const [redeemed, setRedeemed] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [redemptionCode, setRedemptionCode] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                setRewards(DemoManager.getMockRewards());
                setRedeemed(new Set(DemoManager.getRedeemedRewards()));
            } catch (error) {
                console.error('Error loading rewards:', error);
                setRewards(DemoManager.getMockRewards());
                setRedeemed(new Set(DemoManager.getRedeemedRewards()));
            }
            setIsLoading(false);
        };
        loadData();
    }, [authUser, isDemo]);

    const categoryMap: Record<string, string> = {
        'Vouchers': 'voucher',
        'Merch': 'merch',
        'Donate': 'donation',
    };

    const filtered = activeTab === 'All'
        ? rewards
        : rewards.filter(r => r.category === categoryMap[activeTab]);

    const generateRedemptionCode = useCallback(() => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'RL-';
        for (let i = 0; i < 8; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }, []);

    const handleRedeem = async (reward: Reward) => {
        if (!authUser || authUser.coins < reward.cost || redeemed.has(reward.id) || isRedeeming) return;

        setIsRedeeming(true);
        try {
            const success = DemoManager.redeemReward(reward.id, reward.cost);
            if (success) {
                setRedeemed(new Set(DemoManager.getRedeemedRewards()));
                if (reward.category !== 'donation') {
                    setRedemptionCode(generateRedemptionCode());
                }
                setSelectedReward(reward);
            }
        } catch (error) {
            console.error('Error redeeming reward:', error);
        }
        setIsRedeeming(false);
    };

    const closeModal = () => {
        setSelectedReward(null);
        setRedemptionCode('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!authUser) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">redeem</span>
                    <p className="font-bold text-on-surface">Sign in to view rewards</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-on-surface font-['Plus_Jakarta_Sans']">
            <PageHeader title="REWARDS" backHref="/" />

            <motion.main
                className="pt-2 pb-32 px-6 max-w-2xl mx-auto space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Hero: Wallet Card */}
                <motion.section
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-xl p-8 text-on-primary shadow-[0_20px_40px_rgba(41,68,58,0.15)]"
                    style={{ background: 'linear-gradient(135deg, #29664c 0%, #1b5a40 100%)' }}
                >
                    <div className="relative z-10">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">YOUR BALANCE</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <h2 className="text-5xl font-extrabold tracking-tighter">{authUser.coins}</h2>
                            <span className="text-xl font-bold opacity-90">Eco Coins</span>
                        </div>
                        <p className="mt-1 text-sm font-medium opacity-70">≈ ₹{Math.round(authUser.coins * 0.5)} Value</p>

                        {/* Tier Progress */}
                        <div className="mt-10 space-y-3">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="block text-[10px] font-black tracking-widest opacity-60 uppercase">CURRENT STATUS</span>
                                    <span className="text-lg font-extrabold tracking-tight">SILVER TIER</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold opacity-70">550 to GOLD</span>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-secondary-fixed-dim rounded-full shadow-[0_0_12px_rgba(146,247,195,0.4)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute -right-4 -top-4 w-40 h-40 opacity-20 pointer-events-none">
                        <span className="material-symbols-outlined text-[10rem]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    </div>
                </motion.section>

                {/* Category Filters */}
                <motion.nav variants={itemVariants} className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-none px-6 py-2.5 rounded-full text-sm font-bold tracking-tight transition-all active:scale-95 ${
                                activeTab === tab
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.nav>

                {/* Rewards List */}
                <motion.section variants={containerVariants} className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-on-surface-variant mb-4">Available Rewards</h3>

                    {filtered.map((reward) => {
                        const isRedeemed = redeemed.has(reward.id);
                        const canAfford = authUser.coins >= reward.cost;
                        const accentColor = ACCENT_COLORS[reward.category] || '#29664c';
                        const accentIcon = ACCENT_ICONS[reward.category] || 'redeem';

                        return (
                            <motion.div
                                key={reward.id}
                                variants={itemVariants}
                                className="group relative flex items-center bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-transform active:scale-[0.98]"
                            >
                                {/* Accent bar */}
                                <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: accentColor }} />

                                {/* Icon */}
                                <div className="p-5 flex-shrink-0 flex items-center justify-center bg-surface-container-low ml-6 rounded-lg">
                                    <span className="material-symbols-outlined text-3xl" style={{ color: accentColor }}>{accentIcon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-grow p-4 pr-6 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-bold text-on-surface tracking-tight leading-tight">{reward.title}</h4>
                                        <p className="text-sm text-on-surface-variant mt-0.5">{reward.description}</p>
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                                            <span className="text-sm font-extrabold text-primary">{reward.cost} Coins</span>
                                        </div>
                                    </div>

                                    {isRedeemed ? (
                                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 flex-shrink-0">
                                            <span className="material-symbols-outlined text-base">check_circle</span>
                                            Claimed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleRedeem(reward)}
                                            disabled={!canAfford || !reward.available || isRedeeming}
                                            className={`px-5 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform flex-shrink-0 ${
                                                canAfford && reward.available
                                                    ? 'bg-primary text-on-primary'
                                                    : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'
                                            }`}
                                        >
                                            {canAfford ? 'Claim' : `Need ${reward.cost - authUser.coins}`}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.section>

                {/* Donate CTA */}
                <motion.div
                    variants={itemVariants}
                    className="bg-surface-container-low rounded-xl p-6 flex items-center gap-6"
                >
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-4xl">volunteer_activism</span>
                    </div>
                    <div>
                        <h5 className="text-sm font-extrabold uppercase tracking-widest text-primary mb-1">Make a Difference</h5>
                        <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Don't need a voucher? Donate your coins to local reforestation projects.</p>
                    </div>
                </motion.div>
            </motion.main>

            {/* Redemption Modals */}
            <AnimatePresence>
                {selectedReward && (
                    selectedReward.category === 'donation' ? (
                        <CommunityStoryModal reward={selectedReward} onClose={closeModal} />
                    ) : (
                        <QRCouponModal reward={selectedReward} code={redemptionCode} onClose={closeModal} />
                    )
                )}
            </AnimatePresence>
        </div>
    );
}
