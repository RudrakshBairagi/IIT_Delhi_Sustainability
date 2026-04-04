'use client';

import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';
import DemoManager from '@/lib/demo-manager';

interface LeaderboardUser {
    rank: number;
    uid?: string;
    name: string;
    avatar: string;
    co2Saved: number;
    xp: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const barData = [
    { month: 'Jan', height: '40%', active: false },
    { month: 'Feb', height: '65%', active: false },
    { month: 'Mar', height: '85%', active: true },
    { month: 'Apr', height: '55%', active: false },
    { month: 'May', height: '70%', active: false },
];

function ImpactContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isDemo } = useAuth();
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'personal'>('personal');
    const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
    const [userRankData, setUserRankData] = useState<{ rank: number; percentile: number } | null>(null);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (isDemo) {
                setLeaderboardUsers(DemoManager.getLeaderboard());
                setUserRankData({ rank: 6, percentile: 75 });
                setIsLoadingLeaderboard(false);
                return;
            }
            try {
                const data = await DBService.getLeaderboard(20);
                setLeaderboardUsers(data);
                if (user?.uid) {
                    const rankData = await DBService.getUserRank(user.uid);
                    setUserRankData(rankData);
                }
            } catch {
                setLeaderboardUsers(DemoManager.getLeaderboard());
            } finally {
                setIsLoadingLeaderboard(false);
            }
        };
        fetchLeaderboard();
    }, [user?.uid, isDemo]);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'personal' || tab === 'leaderboard') setActiveTab(tab);
    }, [searchParams]);

    const handleTabChange = (tab: 'leaderboard' | 'personal') => {
        setActiveTab(tab);
        router.replace(`/impact?tab=${tab}`, { scroll: false });
    };

    if (!user) return null;

    const co2Total = user.co2Saved || 25.5;
    const topPct = userRankData?.percentile ?? 75;

    return (
        <div className="min-h-screen text-[#29302f] pb-32" style={{ backgroundColor: '#f1f8f6' }}>

            {/* Header */}
            <header className="flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 backdrop-blur-xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]" style={{ backgroundColor: 'rgba(241,248,246,0.8)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#d4dfdd]">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=29664c&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-[#29664c]">RELOOP</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#b9f9d6] rounded-full hover:bg-[#eaf2f0] transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-[#29664c] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <span className="text-[#246147] font-bold text-xs">{user.coins ?? 240} Coins</span>
                </div>
            </header>

            <main className="px-6 pt-6 space-y-8 max-w-2xl mx-auto">

                {/* Segment Toggle */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#dbe5e2] p-1.5 rounded-xl flex w-full">
                        <button
                            onClick={() => handleTabChange('leaderboard')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === 'leaderboard' ? 'bg-white text-[#29664c] shadow-sm' : 'text-[#565d5c] hover:bg-[#eaf2f0]'}`}
                        >
                            Leaderboard
                        </button>
                        <button
                            onClick={() => handleTabChange('personal')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all rounded-lg ${activeTab === 'personal' ? 'bg-white text-[#29664c] shadow-sm' : 'text-[#565d5c] hover:bg-[#eaf2f0]'}`}
                        >
                            My Impact
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-[#29302f] uppercase">
                            {activeTab === 'personal' ? 'Your Impact' : 'Student Ranking'}
                        </h1>
                        <p className="text-[#565d5c] text-lg leading-relaxed">
                            {activeTab === 'personal' ? 'Tracking your contribution to a circular world.' : 'Top sustainability champions'}
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'personal' ? (
                        <motion.div key="personal" initial="hidden" animate="visible" exit={{ opacity: 0, x: 20 }} variants={containerVariants} className="space-y-8">

                            {/* Hero Card */}
                            <motion.section variants={itemVariants} className="rounded-xl p-8 text-white shadow-[8px_8px_0px_0px_#b9f9d6] border-2 border-[#29664c] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #29664c 0%, #1b5a40 100%)' }}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Total CO2 Saved</p>
                                        <h2 className="text-6xl font-black tracking-tighter">{co2Total} kg</h2>
                                    </div>
                                    <div className="bg-[#92f7c3] text-[#005e3e] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                                        Top {topPct}% of Campus
                                    </div>
                                </div>
                                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(27,90,64,0.3)' }}>
                                    <div className="h-full bg-[#83e8b5] rounded-full" style={{ width: `${topPct}%` }} />
                                </div>
                            </motion.section>

                            {/* Activity Bar Chart */}
                            <motion.section variants={itemVariants} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#565d5c]">Activity</h3>
                                    <span className="text-[10px] font-bold text-[#29664c] bg-[#b9f9d6] px-2 py-1 rounded">LAST 5 MONTHS</span>
                                </div>
                                <div className="bg-[#eaf2f0] rounded-xl p-6 h-48 flex items-end justify-between gap-2">
                                    {barData.map((bar) => (
                                        <div key={bar.month} className="flex flex-col items-center gap-2 w-full">
                                            <div
                                                className={`w-full rounded-t-lg transition-all ${bar.active ? 'bg-[#29664c] hover:bg-[#1b5a40]' : 'bg-[#29664c]/10 hover:bg-[#29664c]/30'}`}
                                                style={{ height: bar.height }}
                                            />
                                            <span className={`text-[10px] font-bold uppercase ${bar.active ? 'text-[#29664c]' : 'text-[#565d5c]'}`}>{bar.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Stats Grid */}
                            <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: 'recycling', value: user.itemsTraded ?? 12, label: 'Items Rescued', faded: false },
                                    { icon: 'currency_exchange', value: user.coins ?? 1450, label: 'Eco Coins Earned', faded: false },
                                    { icon: 'groups', value: user.tradesCompleted ?? 0, label: 'Community Trades', faded: true },
                                    { icon: 'volunteer_activism', value: user.donationsMade ?? 0, label: 'Donations Made', faded: true },
                                ].map((stat) => (
                                    <div key={stat.label} className={`bg-white p-6 rounded-xl border-2 border-[#29302f] flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(41,48,47,0.1)] ${stat.faded ? 'opacity-60' : ''}`}>
                                        <span className={`material-symbols-outlined text-3xl ${stat.faded ? 'text-[#565d5c]' : 'text-[#29664c]'}`}>{stat.icon}</span>
                                        <div>
                                            <p className="text-2xl font-black text-[#29302f]">{stat.value}</p>
                                            <p className="text-[10px] font-bold text-[#565d5c] uppercase tracking-wider leading-tight">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.section>

                            {/* Quote Banner */}
                            <motion.section variants={itemVariants} className="relative overflow-hidden rounded-xl bg-[#6750a4] p-8 text-white">
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#d0bcff]/20 rounded-full blur-2xl" />
                                <div className="relative z-10 max-w-[80%]">
                                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50 block">format_quote</span>
                                    <p className="text-xl font-bold leading-snug italic">
                                        "Small actions, multiplied by millions of people, can transform the world."
                                    </p>
                                </div>
                            </motion.section>
                        </motion.div>

                    ) : (
                        <motion.div key="leaderboard" initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }} variants={containerVariants} className="space-y-6">
                            {isLoadingLeaderboard ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {/* Podium */}
                                    <div className="flex items-end justify-center gap-4 px-2">
                                        {[1, 0, 2].map((idx, displayIdx) => {
                                            const leader = leaderboardUsers[idx];
                                            if (!leader) return null;
                                            const heights = ['h-32', 'h-44', 'h-24'];
                                            const podiumBg = ['bg-[#dbe5e2]', 'bg-[#b9f9d6]', 'bg-[#dbe5e2]'];
                                            const ringColor = ['border-[#dbe5e2]', 'border-[#29664c]', 'border-[#dbe5e2]'];
                                            const size = ['w-16 h-16', 'w-20 h-20', 'w-16 h-16'];
                                            const labels = ['2nd', '1st', '3rd'];
                                            const rankBg = ['bg-[#dbe5e2] text-[#29302f]', 'bg-[#29664c] text-white', 'bg-[#dbe5e2] text-[#29302f]'];
                                            return (
                                                <motion.div key={leader.rank} variants={itemVariants} className="flex flex-col items-center flex-1">
                                                    <div className={`relative ${displayIdx === 1 ? 'mb-6' : 'mb-4'}`}>
                                                        {displayIdx === 1 && (
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                                                                <span className="material-symbols-outlined text-yellow-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                                            </div>
                                                        )}
                                                        <div className={`${size[displayIdx]} rounded-full border-4 ${ringColor[displayIdx]} overflow-hidden shadow-lg ${displayIdx === 1 ? 'scale-110' : ''}`}>
                                                            <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className={`absolute -bottom-2 -right-2 ${rankBg[displayIdx]} text-[10px] font-bold px-2 py-0.5 rounded-full border border-white`}>
                                                            {labels[displayIdx]}
                                                        </div>
                                                    </div>
                                                    <div className={`${podiumBg[displayIdx]} w-full ${heights[displayIdx]} rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] ${displayIdx === 1 ? 'border-t-4 border-[#29664c]/20' : ''}`}>
                                                        <span className="font-bold text-[#29302f] text-sm">{leader.name}</span>
                                                        <span className="text-[#29664c] font-extrabold text-xs">{leader.co2Saved} kg</span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* List */}
                                    <div className="space-y-4">
                                        {leaderboardUsers.slice(3).map((leader, i) => {
                                            const isMe = user?.name === leader.name;
                                            const maxCo2 = leaderboardUsers[0]?.co2Saved || 1;
                                            const pct = Math.round((leader.co2Saved / maxCo2) * 100);
                                            return (
                                                <motion.div key={leader.rank} variants={itemVariants}
                                                    className={`p-5 rounded-2xl flex items-center gap-4 transition-all ${isMe ? 'bg-[#b9f9d6]/30 border-2 border-[#29664c]/10 shadow-sm' : 'bg-white hover:bg-[#eaf2f0]'}`}
                                                >
                                                    <span className={`font-extrabold w-4 ${isMe ? 'text-[#29664c]' : 'text-[#565d5c]'}`}>{leader.rank}</span>
                                                    <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${isMe ? 'border-2 border-[#29664c]' : ''}`}>
                                                        <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h4 className={`font-bold truncate ${isMe ? 'text-[#246147]' : 'text-[#29302f]'}`}>
                                                                {isMe ? `You (${leader.name})` : leader.name}
                                                            </h4>
                                                            <span className="text-xs font-extrabold text-[#29664c]">{leader.co2Saved} kg</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-[#dbe5e2] rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${isMe ? 'bg-[#29664c]' : 'bg-gradient-to-r from-[#29664c] to-[#006946]'}`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default function ImpactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f1f8f6] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29664c]" /></div>}>
            <ImpactContent />
        </Suspense>
    );
}
