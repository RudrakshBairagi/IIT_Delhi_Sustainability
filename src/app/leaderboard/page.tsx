'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';
import DemoManager from '@/lib/demo-manager';

interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar: string;
    xp: number;
    co2Saved: number;
}

const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd display positions

export default function LeaderboardPage() {
    const { user, isDemo, isLoading: authLoading } = useAuth();
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'impact'>('leaderboard');

    useEffect(() => {
        if (authLoading) return;
        const load = async () => {
            setIsLoading(true);
            try {
                if (isDemo) {
                    const mock = DemoManager.getLeaderboard();
                    setLeaders(mock);
                } else {
                    const fb = await DBService.getLeaderboard(20);
                    setLeaders(fb.length > 0 ? fb : DemoManager.getLeaderboard());
                }
            } catch {
                setLeaders(DemoManager.getLeaderboard());
            }
            setIsLoading(false);
        };
        load();
    }, [authLoading, isDemo, user]);

    const top3 = leaders.slice(0, 3);
    const rest = leaders.slice(3);
    const maxCo2 = leaders[0]?.co2Saved || 1;

    const podiumHeights = ['h-32', 'h-44', 'h-24'];
    const podiumBg = ['bg-[#dbe5e2]', 'bg-[#b9f9d6]', 'bg-[#dbe5e2]'];
    const avatarBorder = ['border-[#dbe5e2]', 'border-[#29664c]', 'border-[#dbe5e2]'];
    const avatarSize = ['w-16 h-16', 'w-20 h-20', 'w-16 h-16'];
    const avatarScale = ['', 'scale-110', ''];
    const rankLabel = ['2nd', '1st', '3rd'];
    const rankBg = ['bg-[#dbe5e2] text-[#29302f]', 'bg-[#29664c] text-white', 'bg-[#dbe5e2] text-[#29302f]'];
    const marginBottom = ['mb-4', 'mb-6', 'mb-4'];

    return (
        <div className="min-h-screen text-[#29302f] pb-32" style={{ backgroundColor: '#f1f8f6' }}>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 backdrop-blur-xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] flex justify-between items-center px-6 h-16" style={{ backgroundColor: 'rgba(241,248,246,0.8)' }}>
                <div className="flex items-center gap-4">
                    <Link href="/" className="material-symbols-outlined text-[#29664c] cursor-pointer">menu</Link>
                    <h1 className="font-extrabold tracking-tighter text-2xl text-[#29302f]">Campus Leaderboard</h1>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#b9f9d6]">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'You'}&background=29664c&color=fff`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>

            <main className="pt-24 px-6 max-w-2xl mx-auto">

                {/* Segment Control */}
                <div className="flex bg-[#dbe5e2] p-1 rounded-xl mb-10">
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs tracking-widest uppercase transition-all ${activeTab === 'leaderboard' ? 'bg-white text-[#29664c] shadow-sm' : 'text-[#565d5c] hover:bg-[#eaf2f0]'}`}
                    >
                        LEADERBOARD
                    </button>
                    <button
                        onClick={() => setActiveTab('impact')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs tracking-widest uppercase transition-all ${activeTab === 'impact' ? 'bg-white text-[#29664c] shadow-sm' : 'text-[#565d5c] hover:bg-[#eaf2f0]'}`}
                    >
                        MY IMPACT
                    </button>
                </div>

                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tighter text-[#29302f] leading-none mb-2">STUDENT RANKING</h2>
                    <p className="text-[#565d5c] text-lg font-medium opacity-80">Top sustainability champions</p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Podium */}
                        <div className="flex items-end justify-center gap-4 mb-16 px-2">
                            {podiumOrder.map((leaderIdx, displayIdx) => {
                                const leader = top3[leaderIdx];
                                if (!leader) return null;
                                return (
                                    <div key={leader.rank} className="flex flex-col items-center flex-1">
                                        {/* Avatar */}
                                        <div className={`relative ${marginBottom[displayIdx]}`}>
                                            {displayIdx === 1 && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                                                    <span className="material-symbols-outlined text-yellow-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                                                </div>
                                            )}
                                            <div className={`${avatarSize[displayIdx]} rounded-full border-4 ${avatarBorder[displayIdx]} overflow-hidden shadow-lg ${avatarScale[displayIdx]}`}>
                                                <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`absolute -bottom-2 -right-2 ${rankBg[displayIdx]} text-[10px] font-bold px-2 py-0.5 rounded-full border border-white`}>
                                                {rankLabel[displayIdx]}
                                            </div>
                                        </div>

                                        {/* Podium Block */}
                                        <div className={`${podiumBg[displayIdx]} w-full ${podiumHeights[displayIdx]} rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] ${displayIdx === 1 ? 'border-t-4 border-[#29664c]/20' : ''}`}>
                                            <span className="font-bold text-[#29302f] text-sm">{leader.name}</span>
                                            <span className="text-[#29664c] font-extrabold text-xs">{leader.co2Saved} kg</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* List Rankings */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.06 }}
                        >
                            {rest.map((leader, i) => {
                                const isCurrentUser = user?.name === leader.name;
                                const widthPct = Math.round((leader.co2Saved / maxCo2) * 100);
                                return (
                                    <motion.div
                                        key={leader.rank}
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`p-5 rounded-2xl flex items-center gap-4 transition-all ${isCurrentUser
                                            ? 'bg-[#b9f9d6]/30 border-2 border-[#29664c]/10 shadow-sm'
                                            : 'bg-white hover:bg-[#eaf2f0]'
                                            }`}
                                    >
                                        <span className={`font-extrabold w-4 ${isCurrentUser ? 'text-[#29664c]' : 'text-[#565d5c]'}`}>
                                            {leader.rank}
                                        </span>
                                        <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${isCurrentUser ? 'border-2 border-[#29664c]' : ''}`}>
                                            <img src={leader.avatar} alt={leader.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className={`font-bold truncate ${isCurrentUser ? 'text-[#246147]' : 'text-[#29302f]'}`}>
                                                    {isCurrentUser ? `You (${leader.name})` : leader.name}
                                                </h4>
                                                <span className="text-xs font-extrabold text-[#29664c]">{leader.co2Saved} kg</span>
                                            </div>
                                            <div className="w-full h-2 bg-[#dbe5e2] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isCurrentUser ? 'bg-[#29664c]' : 'bg-gradient-to-r from-[#29664c] to-[#006946]'}`}
                                                    style={{ width: `${widthPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* CTA Card */}
                        <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-[#29664c] to-[#1b5a40] text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Want to climb higher?</h3>
                                <p className="text-white/80 mb-6 text-sm font-medium">Complete more missions this week to earn bonus sustainability points.</p>
                                <Link href="/missions">
                                    <button className="bg-white text-[#29664c] px-6 py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all">
                                        START MISSIONS
                                    </button>
                                </Link>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-[120px] pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
