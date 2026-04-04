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
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-sky-100 to-white dark:from-dark-bg dark:to-dark-surface text-[#111714] dark:text-white">
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
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">42 kg Saved</p>
                                            <p className="text-[9px] font-medium text-dark/50 dark:text-white/50">≈ 8 trees planted</p>
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
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">50 kg Saved</p>
                                            <p className="text-[9px] font-medium text-dark/50 dark:text-white/50">≈ 10 trees planted</p>
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
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">38 kg Saved</p>
                                            <p className="text-[9px] font-medium text-dark/50 dark:text-white/50">≈ 7 trees planted</p>
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
                                                <p className="text-xs font-bold text-black dark:text-white shrink-0">35 kg</p>
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
                                                <p className="text-xs font-bold text-black dark:text-white shrink-0">31 kg</p>
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
                            <motion.div variants={itemVariants} className="bg-[#4ce68a] rounded-[32px] border-4 border-dark p-6 shadow-brutal relative overflow-hidden h-64">
                                {/* Grid Pattern Background */}
                                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.1) 2px, transparent 2px)',
                                    backgroundSize: '24px 24px'
                                }}></div>

                                {/* Wave SVG at bottom */}
                                <svg className="absolute bottom-0 left-0 w-full h-32 text-black opacity-10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 320">
                                    <path d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,234.7C672,256,768,288,864,272C960,256,1056,192,1152,176C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="currentColor" fillOpacity="1"></path>
                                </svg>

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-black text-sm uppercase tracking-wider bg-white border-2 border-black px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000]">Total CO₂ Saved</h3>
                                        <span className="material-symbols-outlined text-black text-3xl">cloud_done</span>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-7xl font-black text-dark tracking-tighter drop-shadow-sm">{user.co2Saved}</span>
                                            <span className="text-2xl font-bold text-dark">kg</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            <span className="material-symbols-outlined text-lg text-dark">trending_up</span>
                                            <span className="text-xs font-bold text-dark uppercase tracking-wide">Top 5% of campus</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Activity Chart */}
                            <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-dark dark:border-gray-600 shadow-brutal p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-xl uppercase tracking-wider text-dark dark:text-white">Activity</h3>
                                    <div className="bg-accent-yellow border-2 border-dark rounded-lg px-3 py-1.5 text-[10px] font-bold shadow-[2px_2px_0px_0px_#000] uppercase">Last 5 Months</div>
                                </div>
                                <div className="flex items-end justify-between h-40 gap-3 w-full">
                                    {[
                                        { month: 'Jan', height: '40%' },
                                        { month: 'Feb', height: '65%' },
                                        { month: 'Mar', height: '35%' },
                                        { month: 'Apr', height: '85%' },
                                        { month: 'May', height: '60%', highlight: true }
                                    ].map((bar, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-end w-full h-full gap-2">
                                            <div
                                                className={`w-full ${bar.highlight ? 'bg-accent-yellow' : 'bg-primary'} border-2 border-dark shadow-[2px_2px_0px_0px_#000] rounded-t-sm transition-all hover:opacity-90`}
                                                style={{ height: bar.height }}
                                            ></div>
                                            <span className="text-xs font-bold uppercase text-dark dark:text-white">{bar.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Detailed Grid - Enhanced Stat Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-dark dark:border-gray-600 p-4 shadow-brutal flex flex-col h-44 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-auto">
                                        <div className="w-12 h-12 rounded-xl bg-green-100 border-2 border-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                            <span className="material-symbols-outlined text-dark text-2xl">recycling</span>
                                        </div>
                                        <div className="bg-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-dark">+3</div>
                                    </div>
                                    <div>
                                        <span className="block text-4xl font-black text-dark dark:text-white mb-1">{user.itemsTraded}</span>
                                        <span className="text-xs font-bold text-dark/60 dark:text-gray-400 uppercase leading-tight block">Items<br />Rescued</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-dark dark:border-gray-600 p-4 shadow-brutal flex flex-col h-44 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-auto">
                                        <div className="w-12 h-12 rounded-full bg-yellow-100 border-2 border-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                            <span className="material-symbols-outlined text-dark text-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>eco</span>
                                        </div>
                                        <div className="bg-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-dark">+50</div>
                                    </div>
                                    <div>
                                        <span className="block text-4xl font-black text-dark dark:text-white mb-1">{user.coins}</span>
                                        <span className="text-xs font-bold text-dark/60 dark:text-gray-400 uppercase leading-tight block">Eco Coins<br />Earned</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-dark dark:border-gray-600 p-4 shadow-brutal flex flex-col h-44 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-auto">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 border-2 border-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                            <span className="material-symbols-outlined text-dark text-2xl">handshake</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-4xl font-black text-dark dark:text-white mb-1">5</span>
                                        <span className="text-xs font-bold text-dark/60 dark:text-gray-400 uppercase leading-tight block">Community<br />Trades</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="bg-white dark:bg-dark-surface rounded-2xl border-4 border-dark dark:border-gray-600 p-4 shadow-brutal flex flex-col h-44 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-auto">
                                        <div className="w-12 h-12 rounded-xl bg-pink-100 border-2 border-dark flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                            <span className="material-symbols-outlined text-dark text-2xl">redeem</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-4xl font-black text-dark dark:text-white mb-1">2</span>
                                        <span className="text-xs font-bold text-dark/60 dark:text-gray-400 uppercase leading-tight block">Donations<br />Made</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Impact Quote - Enhanced with Pattern */}
                            <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-500 to-purple-600 relative rounded-2xl border-4 border-dark p-6 text-center shadow-brutal overflow-hidden">
                                {/* Dot Pattern Background */}
                                <div className="absolute inset-0 opacity-30" style={{
                                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 2px, transparent 2px)',
                                    backgroundSize: '20px 20px'
                                }}></div>
                                {/* Decorative Elements */}
                                <div className="absolute top-2 right-2 w-4 h-4 bg-accent-yellow border-2 border-dark rounded-full"></div>
                                <div className="absolute bottom-2 left-2 w-4 h-4 bg-primary border-2 border-dark transform rotate-45"></div>

                                <p className="text-white font-bold italic text-lg leading-relaxed relative z-10 drop-shadow-md">"Small actions, multiplied by millions of people, can transform the world."</p>
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
