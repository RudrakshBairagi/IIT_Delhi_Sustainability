'use client';

import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

function ImpactContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'personal'>('leaderboard');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'personal' || tab === 'leaderboard') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab: 'leaderboard' | 'personal') => {
        setActiveTab(tab);
        router.replace(`/impact?tab=${tab}`);
    };

    if (!user) return null;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-sky-100 to-white dark:from-dark-bg dark:to-dark-surface text-[#111714] dark:text-white font-sans">
            {/* Header */}
            <header className="flex flex-col gap-1 p-4 pt-8 pb-2 shrink-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex size-10 items-center justify-center rounded-full border-2 border-black dark:border-gray-600 bg-white dark:bg-dark-surface shadow-brutal active:translate-y-[2px] active:shadow-none transition-all">
                        <span className="material-symbols-outlined text-black dark:text-white">arrow_back</span>
                    </Link>
                    <button className="flex size-10 items-center justify-center rounded-full border-2 border-black dark:border-gray-600 bg-white dark:bg-dark-surface shadow-brutal active:translate-y-[2px] active:shadow-none transition-all">
                        <span className="material-symbols-outlined text-black dark:text-white">info</span>
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl border-2 border-dark dark:border-gray-600 mb-2">
                    <button
                        onClick={() => handleTabChange('leaderboard')}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wide transition-all ${activeTab === 'leaderboard'
                            ? 'bg-dark text-white shadow-md'
                            : 'text-dark/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5'
                            }`}
                    >
                        Leaderboard
                    </button>
                    <button
                        onClick={() => handleTabChange('personal')}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wide transition-all ${activeTab === 'personal'
                            ? 'bg-[#4ce68a] text-dark border-2 border-dark shadow-md'
                            : 'text-dark/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5'
                            }`}
                    >
                        My Impact
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'leaderboard' ? (
                        <motion.div
                            key="header-leaderboard"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h1 className="text-black dark:text-white text-[40px] leading-[1.1] font-extrabold tracking-tight uppercase">Student<br />Ranking</h1>
                            <p className="text-[#111714]/80 dark:text-gray-400 text-lg font-bold mt-1">Top sustainability champions</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="header-personal"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h1 className="text-black dark:text-white text-[40px] leading-[1.1] font-extrabold tracking-tight uppercase">Your<br />Impact</h1>
                            <p className="text-[#111714]/80 dark:text-gray-400 text-lg font-bold mt-1">Making a real difference</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Scrollable Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                <AnimatePresence mode="wait">
                    {activeTab === 'leaderboard' ? (
                        <motion.div
                            key="leaderboard"
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            variants={containerVariants}
                            className="flex flex-col"
                        >
                            {/* Podium Section */}
                            <div className="w-full px-4 pt-6 pb-8">
                                <div className="flex justify-center items-end gap-2 w-full max-w-md mx-auto h-[260px]">
                                    {/* 2nd Place (Left) */}
                                    <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 z-10">
                                        <div className="relative mb-2 group">
                                            <div className="w-16 h-16 rounded-full border-2 border-black bg-white overflow-hidden shadow-brutal z-10 relative">
                                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/unnati.png')" }}></div>
                                            </div>
                                            <div className="absolute -top-3 -right-2 bg-[#C0C0C0] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#2</div>
                                        </div>
                                        <div className="text-center mb-1">
                                            <p className="font-bold text-sm leading-tight text-dark dark:text-white">Unnati</p>
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">42k Saved</p>
                                        </div>
                                        <div className="w-full h-[80px] bg-[#C0C0C0] border-2 border-black rounded-t-xl shadow-brutal flex items-end justify-center pb-2 relative overflow-hidden">
                                            <div className="opacity-20 absolute inset-0 bg-white"></div>
                                            <span className="text-2xl font-black opacity-30 text-black">2</span>
                                        </div>
                                    </motion.div>

                                    {/* 1st Place (Center) */}
                                    <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 z-20 -mx-2 mb-0">
                                        <div className="relative mb-2">
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                                            <div className="w-20 h-20 rounded-full border-2 border-black bg-white overflow-hidden shadow-brutal z-10 relative ring-4 ring-yellow-400/30">
                                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/ankush.png')" }}></div>
                                            </div>
                                            <div className="absolute -top-3 -right-2 bg-[#FFD700] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#1</div>
                                        </div>
                                        <div className="text-center mb-1">
                                            <p className="font-bold text-base leading-tight text-dark dark:text-white">Ankush</p>
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">50k Saved</p>
                                        </div>
                                        <div className="w-full h-[110px] bg-[#FFD700] border-2 border-black rounded-t-xl shadow-brutal-lg flex items-end justify-center pb-2 relative overflow-hidden">
                                            <div className="opacity-20 absolute inset-0 bg-white"></div>
                                            <span className="text-3xl font-black opacity-30 text-black">1</span>
                                        </div>
                                    </motion.div>

                                    {/* 3rd Place (Right) */}
                                    <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 z-10">
                                        <div className="relative mb-2">
                                            <div className="w-16 h-16 rounded-full border-2 border-black bg-white overflow-hidden shadow-brutal z-10 relative">
                                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/uransh.png')" }}></div>
                                            </div>
                                            <div className="absolute -top-3 -right-2 bg-[#CD7F32] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#3</div>
                                        </div>
                                        <div className="text-center mb-1">
                                            <p className="font-bold text-sm leading-tight text-dark dark:text-white">Uransh</p>
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">38k Saved</p>
                                        </div>
                                        <div className="w-full h-[60px] bg-[#CD7F32] border-2 border-black rounded-t-xl shadow-brutal flex items-end justify-center pb-2 relative overflow-hidden">
                                            <div className="opacity-20 absolute inset-0 bg-white"></div>
                                            <span className="text-2xl font-black opacity-30 text-black">3</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* List Section */}
                            <div className="flex flex-col gap-4 px-4">
                                {/* List Item 4 */}
                                <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black dark:border-gray-600 bg-white dark:bg-dark-surface p-3 shadow-brutal transition-transform active:scale-[0.98]">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-xl font-bold text-black/40 dark:text-white/40 w-8 text-center shrink-0">04</span>
                                        <div className="size-12 rounded-full border border-black dark:border-gray-600 bg-gray-100 dark:bg-dark-bg shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/rudraksh.png')" }}></div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-base font-bold text-black dark:text-white truncate pr-2">Rudraksh</p>
                                                <p className="text-xs font-bold text-black dark:text-white shrink-0">35k kg</p>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 dark:bg-dark-bg rounded-full border border-black dark:border-gray-600 overflow-hidden relative">
                                                <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                {/* List Item 5 */}
                                <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black dark:border-gray-600 bg-white dark:bg-dark-surface p-3 shadow-brutal transition-transform active:scale-[0.98]">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-xl font-bold text-black/40 dark:text-white/40 w-8 text-center shrink-0">05</span>
                                        <div className="size-12 rounded-full border border-black dark:border-gray-600 bg-gray-100 dark:bg-dark-bg shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Jamie+Doe&background=random')" }}></div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-base font-bold text-black dark:text-white truncate pr-2">Jamie Doe</p>
                                                <p className="text-xs font-bold text-black dark:text-white shrink-0">31k kg</p>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 dark:bg-dark-bg rounded-full border border-black dark:border-gray-600 overflow-hidden relative">
                                                <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '78%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="personal"
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: 20 }}
                            variants={containerVariants}
                            className="flex flex-col gap-4 px-4 pt-4"
                        >
                            {/* Main Stats Card */}
                            <motion.div variants={itemVariants} className="bg-[#4ce68a] rounded-[32px] border-3 border-dark p-6 shadow-brutal relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <span className="material-symbols-outlined text-9xl text-black">eco</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-sm font-black uppercase tracking-wider text-dark/70 mb-2">Total CO₂ Saved</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black text-dark tracking-tighter">{user.co2Saved}</span>
                                        <span className="text-xl font-bold text-dark/70">kg</span>
                                    </div>
                                    <div className="mt-4 inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-dark/10">
                                        <span className="material-symbols-outlined text-dark text-sm">trending_up</span>
                                        <span className="text-xs font-bold text-dark">Top 5% of campus!</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Detailed Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 p-4 shadow-brutal-sm">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-2xl border-2 border-dark">🚯</div>
                                    <p className="text-3xl font-black text-dark dark:text-white">{user.itemsTraded}</p>
                                    <p className="text-xs font-bold text-dark/50 dark:text-gray-400 uppercase">Items Rescued</p>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 p-4 shadow-brutal-sm">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-3 text-2xl border-2 border-dark">🪙</div>
                                    <p className="text-3xl font-black text-dark dark:text-white">{user.coins}</p>
                                    <p className="text-xs font-bold text-dark/50 dark:text-gray-400 uppercase">Coins Earned</p>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 p-4 shadow-brutal-sm">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 text-2xl border-2 border-dark">🤝</div>
                                    <p className="text-3xl font-black text-dark dark:text-white">12</p>
                                    <p className="text-xs font-bold text-dark/50 dark:text-gray-400 uppercase">Community Trades</p>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 p-4 shadow-brutal-sm">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-3 text-2xl border-2 border-dark">💖</div>
                                    <p className="text-3xl font-black text-dark dark:text-white">5</p>
                                    <p className="text-xs font-bold text-dark/50 dark:text-gray-400 uppercase">Donations Made</p>
                                </motion.div>
                            </div>

                            {/* Impact Quote */}
                            <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl border-2 border-dark p-6 text-center shadow-brutal text-white">
                                <p className="font-serif italic text-lg opacity-90">"Small actions, multiplied by millions of people, can transform the world."</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sticky User Footer (Only on Leaderboard) */}
            <AnimatePresence>
                {activeTab === 'leaderboard' && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="fixed bottom-0 left-0 w-full p-4 z-50 mb-[5px]"
                    >
                        <div className="relative w-full rounded-[28px] border-2 border-black bg-[#10b981] p-4 shadow-brutal-lg overflow-hidden">
                            {/* Background pattern for texture */}
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                            <div className="relative flex items-center gap-3 z-10">
                                <div className="flex flex-col items-center justify-center bg-black rounded-xl h-12 w-12 shrink-0 border border-white/20">
                                    <span className="text-white text-xs font-medium uppercase">Rank</span>
                                    <span className="text-white text-lg font-bold leading-none">12</span>
                                </div>
                                <div className="flex flex-col flex-1 min-w-0 gap-1">
                                    <div className="flex justify-between items-center text-white">
                                        <span className="font-bold text-base">Your Impact</span>
                                        <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{user.co2Saved} kg</span>
                                    </div>
                                    <div className="w-full h-4 bg-black/20 rounded-full border border-black/10 overflow-hidden">
                                        <div className="h-full bg-white rounded-full relative" style={{ width: '35%' }}>
                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:10px_10px]"></div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleTabChange('personal')}
                                    className="bg-white text-black size-10 rounded-full border-2 border-black flex items-center justify-center shadow-sm shrink-0 active:scale-95 transition-transform"
                                >
                                    <span className="material-symbols-outlined font-bold">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ImpactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <ImpactContent />
        </Suspense>
    );
}
