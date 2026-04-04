'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { PageHeader } from '@/components/ui/PageHeader';

// Animated counter
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const controls = animate(count, value, { duration });
        const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
        return () => { controls.stop(); unsubscribe(); };
    }, [value, count, rounded, duration]);

    return <span>{displayValue}</span>;
}

// Story bar - Instagram style
function StoryBar({ stories, onStoryClick }: { stories: any[]; onStoryClick: (story: any) => void }) {
    return (
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-3 pb-1">
                {stories.map((story, i) => (
                    <motion.button
                        key={story.id}
                        onClick={() => onStoryClick(story)}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col items-center gap-1 flex-shrink-0"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-3 ${story.viewed
                            ? 'border-gray-300 bg-gray-100'
                            : 'border-primary bg-gradient-to-br from-green-100 to-emerald-200'
                            }`}>
                            {story.thumbnail}
                        </div>
                        <span className="text-[8px] font-bold text-dark/50 max-w-14 truncate">
                            {story.charityName.split(' ')[0]}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

// Story viewer modal
function StoryViewer({ story, onClose }: { story: any; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={onClose}
        >
            <div className="absolute top-0 left-0 right-0 p-3 z-10">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                        onAnimationComplete={onClose}
                    />
                </div>
            </div>
            <div className="p-4 pt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                    {story.charityLogo}
                </div>
                <div className="flex-1">
                    <p className="text-white font-black text-sm">{story.charityName}</p>
                    <p className="text-white/50 text-xs">{story.timeAgo}</p>
                </div>
                <button onClick={onClose} className="text-white/70 text-2xl">×</button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-8">
                <motion.span
                    className="text-8xl mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                >
                    {story.thumbnail}
                </motion.span>
                <motion.h2 className="text-white text-2xl font-black text-center">
                    {story.title}
                </motion.h2>
                <p className="text-white/60 text-sm text-center mt-2">Thanks to your donations! 💚</p>
            </div>
        </motion.div>
    );
}

// Statful charity card (compact but with stats)
function CharityCard({ charity, onClick }: { charity: any; onClick: () => void }) {
    const progress = (charity.current / charity.goal) * 100;

    const colorMap: Record<string, { bg: string; accent: string }> = {
        green: { bg: 'from-green-100 to-emerald-100', accent: 'bg-green-500' },
        blue: { bg: 'from-blue-100 to-cyan-100', accent: 'bg-blue-500' },
        orange: { bg: 'from-orange-100 to-amber-100', accent: 'bg-orange-500' },
    };
    const colors = colorMap[charity.color] || colorMap.green;

    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-br ${colors.bg} rounded-2xl border-3 border-dark shadow-brutal-sm p-4 text-left`}
        >
            <div className="flex items-start gap-3">
                <motion.span
                    className="text-4xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {charity.logo}
                </motion.span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-dark">{charity.name}</h3>
                        {charity.almostThere && (
                            <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">🔥 89%</span>
                        )}
                    </div>
                    <p className="text-xs text-dark/60 font-bold mt-0.5">{charity.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="bg-white/60 rounded-lg px-2 py-1 border border-dark/10">
                            <p className="text-lg font-black text-dark leading-none">{charity.current}</p>
                            <p className="text-[8px] text-dark/50 font-bold">{charity.impactMetric}</p>
                        </div>
                        <div className="bg-white/60 rounded-lg px-2 py-1 border border-dark/10">
                            <p className="text-lg font-black text-dark leading-none">{Math.floor(charity.current * 0.8)}</p>
                            <p className="text-[8px] text-dark/50 font-bold">donors</p>
                        </div>
                        <div className="flex-1">
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                                <div className={`h-full ${colors.accent}`} style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-[8px] text-dark/40 font-bold mt-0.5">{Math.round(progress)}% to goal</p>
                        </div>
                    </div>
                </div>
                <span className="material-symbols-outlined text-dark/30 mt-1">chevron_right</span>
            </div>
        </motion.button>
    );
}

// Charity popup modal
function CharityModal({
    charity,
    userCoins,
    onDonate,
    isDonating,
    onClose
}: {
    charity: any;
    userCoins: number;
    onDonate: (amount: number) => void;
    isDonating: boolean;
    onClose: () => void;
}) {
    const progress = (charity.current / charity.goal) * 100;
    const colorMap: Record<string, { gradient: string; btn: string }> = {
        green: { gradient: 'from-green-400 to-emerald-500', btn: 'bg-green-500' },
        blue: { gradient: 'from-blue-400 to-cyan-500', btn: 'bg-blue-500' },
        orange: { gradient: 'from-orange-400 to-amber-500', btn: 'bg-orange-500' },
    };
    const colors = colorMap[charity.color] || colorMap.green;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-lg bg-white rounded-t-3xl border-t-4 border-x-4 border-dark overflow-hidden"
            >
                {/* Header */}
                <div className={`bg-gradient-to-br ${colors.gradient} p-5`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-5xl">{charity.logo}</span>
                            <div>
                                <h2 className="text-xl font-black text-dark">{charity.name}</h2>
                                <p className="text-sm text-dark/70 font-bold">{charity.description}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/30 rounded-full">
                            <span className="material-symbols-outlined text-dark">close</span>
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="bg-white/80 rounded-xl p-3">
                        <div className="flex justify-between text-xs font-bold text-dark/50 mb-1">
                            <span>Community Goal</span>
                            <span>{charity.current} / {charity.goal} {charity.impactMetric}</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${colors.btn}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Impact info */}
                <div className="p-5 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-dark/50 font-bold">Your Impact</p>
                            <p className="text-lg font-black text-dark">{charity.impact}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-dark/50 font-bold">Your Balance</p>
                            <p className="text-xl font-black text-dark">🪙 {userCoins}</p>
                        </div>
                    </div>

                    {/* Donate buttons */}
                    <div className="flex gap-2">
                        {[1, 2, 5].map((multiplier) => {
                            const amount = charity.minDonation * multiplier;
                            const canAfford = userCoins >= amount;
                            return (
                                <motion.button
                                    key={multiplier}
                                    onClick={() => onDonate(amount)}
                                    disabled={!canAfford || isDonating}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-1 py-4 rounded-xl font-black border-2 border-dark ${canAfford
                                        ? `${colors.btn} text-white shadow-brutal-sm`
                                        : 'bg-gray-200 text-gray-400 border-gray-300'
                                        }`}
                                >
                                    {isDonating ? '...' : `🪙 ${amount}`}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Success modal
function SuccessModal({ donation, onClose }: { donation: any; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-xs bg-white rounded-3xl border-3 border-dark shadow-brutal p-6 text-center"
            >
                <motion.div className="text-6xl mb-3" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>💚</motion.div>
                <h2 className="text-xl font-black text-dark">Thank You!</h2>
                <p className="text-sm text-dark/60 font-bold mt-1">{donation.impact}</p>
                <div className="mt-4 bg-card-yellow rounded-xl p-3">
                    <p className="text-xs text-dark/50 font-bold">Donated to {donation.charity}</p>
                    <p className="text-2xl font-black text-dark">🪙 {donation.amount}</p>
                </div>
                <button onClick={onClose} className="mt-4 w-full py-3 bg-dark text-white font-black rounded-xl active:scale-95">
                    Done ✓
                </button>
            </motion.div>
        </motion.div>
    );
}

export default function GiveBackPage() {
    const [userCoins, setUserCoins] = useState(DemoManager.user.coins);
    const [charities, setCharities] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [stories, setStories] = useState<any[]>([]);
    const [activeStory, setActiveStory] = useState<any>(null);
    const [selectedCharity, setSelectedCharity] = useState<any>(null);
    const [donating, setDonating] = useState(false);
    const [successModal, setSuccessModal] = useState<any>(null);

    useEffect(() => {
        setCharities(DemoManager.getCharityGoals());
        setStats(DemoManager.getGiveBackStats());
        setStories(DemoManager.getCharityStories());
        setUserCoins(DemoManager.user.coins);
    }, []);

    const handleDonate = async (amount: number) => {
        if (!selectedCharity || userCoins < amount) return;
        setDonating(true);
        await DemoManager.simulateDelay(600);

        const result = DemoManager.donateToCharity(selectedCharity.id, amount);
        if (result.success) {
            setUserCoins(result.remainingCoins);
            setSelectedCharity(null);
            setSuccessModal({
                charity: selectedCharity.name,
                amount,
                impact: `You just ${selectedCharity.impact.split(' per')[0]}!`
            });
        }
        setDonating(false);
    };

    if (!stats) return null;

    return (
        <div className="min-h-screen bg-background">
            <PageHeader title="Give Back" backHref="/" />

            <div className="px-4 pb-32 space-y-4">
                {/* Story bar */}
                {stories.length > 0 && (
                    <StoryBar stories={stories} onStoryClick={setActiveStory} />
                )}

                {/* Community stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl border-2 border-dark shadow-brutal-sm p-3"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-2 h-2 bg-white rounded-full"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-xs font-black text-dark/70">Community Impact</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-black text-dark">
                            <span>🌳 {stats.treesPlanted}</span>
                            <span>🍎 {stats.mealsProvided}</span>
                            <span>🌊 {stats.plasticRemoved}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/30 px-2 py-1 rounded-lg">
                            <span className="text-sm">🪙</span>
                            <span className="font-black text-dark text-sm">{userCoins}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Charity cards */}
                <div className="space-y-3">
                    {charities.map((charity, i) => (
                        <motion.div
                            key={charity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <CharityCard charity={charity} onClick={() => setSelectedCharity(charity)} />
                        </motion.div>
                    ))}
                </div>

                <p className="text-center text-xs text-dark/40 font-bold">
                    100% of donations go directly to verified partners 💚
                </p>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
                {selectedCharity && (
                    <CharityModal
                        charity={selectedCharity}
                        userCoins={userCoins}
                        onDonate={handleDonate}
                        isDonating={donating}
                        onClose={() => setSelectedCharity(null)}
                    />
                )}
                {successModal && <SuccessModal donation={successModal} onClose={() => setSuccessModal(null)} />}
            </AnimatePresence>
        </div>
    );
}
