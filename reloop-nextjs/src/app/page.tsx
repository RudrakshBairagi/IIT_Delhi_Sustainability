'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/contexts/AuthContext';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { StoriesBar } from '@/components/ui/StoriesBar';
import { User } from '@/types';
import DemoManager from '@/lib/demo-manager';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [streak, setStreak] = useState(1);


  useEffect(() => {
    setStreak(user?.badges?.length || 1); // Mock streak from badges count for now
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Extended leaderboard for rank calculation (simulates campus users)
  const allCampusUsers = [
    { uid: '1', name: 'EcoChampion', xp: 8450 },
    { uid: '2', name: 'GreenWarrior', xp: 7200 },
    { uid: '3', name: 'SustainableX', xp: 6100 },
    { uid: '4', name: 'RecycleKing', xp: 5800 },
    { uid: '5', name: 'PlanetHero', xp: 5200 },
    { uid: '6', name: 'EcoNinja', xp: 4900 },
    { uid: '7', name: 'GreenThumb', xp: 4500 },
    { uid: '8', name: 'TradeQueen', xp: 4100 },
    { uid: '9', name: 'ReLooper', xp: 3800 },
    { uid: '10', name: 'CircularEco', xp: 3500 },
    { uid: '11', name: 'ZeroWaste', xp: 3200 },
    { uid: 'current', name: user?.name || 'You', xp: user?.xp || 2800 }, // Current user
    { uid: '12', name: 'CarbonCutter', xp: 2600 },
    { uid: '13', name: 'ReusePro', xp: 2200 },
    { uid: '14', name: 'EcoStarter', xp: 1800 },
    { uid: '15', name: 'GreenNewbie', xp: 1200 },
  ].sort((a, b) => b.xp - a.xp); // Sort by XP descending

  // Calculate user's rank
  const userRank = allCampusUsers.findIndex(u => u.uid === 'current') + 1;
  const totalUsers = allCampusUsers.length;
  const percentile = Math.round(((totalUsers - userRank) / totalUsers) * 100);
  const usersAhead = userRank - 1;
  const usersBehind = totalUsers - userRank;

  // Get previous rank from localStorage for "up/down" indicator
  const [rankChange, setRankChange] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prevRank = localStorage.getItem('reloop_prev_rank');
      if (prevRank) {
        const change = parseInt(prevRank) - userRank;
        setRankChange(change);
      }
      localStorage.setItem('reloop_prev_rank', userRank.toString());
    }
  }, [userRank]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-sky-200 to-white dark:from-dark-bg dark:to-dark-surface pb-28"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header - Compact */}
      <motion.header className="sticky top-0 z-40 bg-sky-200/95 dark:bg-dark-bg/95 backdrop-blur-md px-5 py-3 border-b-2 border-transparent" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-dark dark:text-white">ReLoop</h1>
            <div className="flex items-center gap-2 bg-white dark:bg-dark-surface neo-border rounded-full px-3 py-1 shadow-brutal-sm">
              <StreakBadge streak={streak} />
              <div className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
              <span className="text-xs font-black text-primary">⚡ {user.xp}</span>
            </div>
          </div>
          <Link href="/profile" className="relative group">
            <div className="w-11 h-11 rounded-full neo-border overflow-hidden shadow-brutal-sm bg-gray-200 dark:bg-gray-700 group-hover:scale-105 transition-transform relative">
              <Image
                src={user.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-dark flex items-center justify-center z-10">
              <span className="text-[8px] font-black text-dark">{user.level}</span>
            </div>
          </Link>
        </div>
      </motion.header>

      <div className="px-5 pb-20 space-y-4">
        {/* Success Stories Bar - Compact */}
        <motion.div variants={itemVariants}>
          <p className="font-extrabold text-dark dark:text-white text-xs mb-1 ml-1">Community Stories</p>
          <StoriesBar />
        </motion.div>

        {/* Scan Hero - Bigger Banner */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-dark rounded-[2rem] translate-x-1 translate-y-1"></div>
          <div className="relative bg-gradient-to-br from-primary via-green-400 to-emerald-500 rounded-[2rem] border-3 border-dark dark:border-gray-600 p-6 overflow-hidden flex items-center justify-between min-h-[150px]">
            {/* Background Decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none rotate-12">
              <span className="material-symbols-outlined text-[120px]">photo_camera</span>
            </div>

            <div className="relative z-10 flex-1">
              <h2 className="text-3xl font-[900] text-dark uppercase tracking-tight mb-2 leading-none">Scan &<br />Earn!</h2>
              <p className="text-dark/70 font-bold text-sm max-w-[160px] leading-tight">
                Reveal upcycling ideas & earn coins.
              </p>
            </div>
            <Link href="/scanner"
              className="relative z-10 flex flex-col items-center justify-center gap-1.5 bg-dark text-white w-24 h-24 rounded-2xl shadow-brutal hover:translate-y-1 active:scale-95 transition-all group-hover:shadow-brutal-sm"
            >
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
              <span className="text-xs font-black uppercase tracking-wide">Scan</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards - Beautified */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {/* Rank Card */}
          <Link href="/impact" className="relative group">
            <div className="absolute inset-0 bg-dark rounded-2xl translate-x-0.5 translate-y-0.5"></div>
            <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl border-2 border-dark dark:border-gray-600 p-4 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-white">leaderboard</span>
                </div>
                <div>
                  <p className="text-2xl font-[900] text-dark dark:text-white leading-none">#{userRank}</p>
                  <p className="text-[10px] text-dark/50 dark:text-gray-400 font-bold">Campus Rank</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400">Top {100 - percentile}%</span>
                <span className="material-symbols-outlined text-sm text-dark/40 dark:text-gray-500">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* CO2 Card */}
          <Link href="/impact" className="relative group">
            <div className="absolute inset-0 bg-dark rounded-2xl translate-x-0.5 translate-y-0.5"></div>
            <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-dark dark:border-gray-600 p-4 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl text-white">eco</span>
                </div>
                <div>
                  <p className="text-2xl font-[900] text-dark dark:text-white leading-none">{user.co2Saved}</p>
                  <p className="text-[10px] text-dark/50 dark:text-gray-400 font-bold">kg CO₂ Saved</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-green-600 dark:text-green-400">Your Impact</span>
                <span className="material-symbols-outlined text-sm text-dark/40 dark:text-gray-500">arrow_forward</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Quick Actions - Compact Grid */}
        <motion.div variants={itemVariants}>
          <p className="font-black text-dark dark:text-white text-sm uppercase tracking-tight mb-2 ml-1">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/marketplace" className="relative h-20 rounded-xl bg-[#F4A261] neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer overflow-hidden group">
              <div className="relative h-full flex items-center gap-3 px-3 z-10">
                <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-white border-2 border-white shrink-0">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                </div>
                <p className="text-dark text-sm font-black uppercase leading-tight tracking-tight">Shop<br />Items</p>
              </div>
            </Link>
            <Link href="/rewards" className="relative h-20 rounded-xl bg-[#2A9D8F] neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer overflow-hidden group">
              <div className="relative h-full flex items-center gap-3 px-3 z-10">
                <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-white border-2 border-white shrink-0">
                  <span className="material-symbols-outlined text-lg">redeem</span>
                </div>
                <p className="text-white text-sm font-black uppercase leading-tight tracking-tight">Redeem<br />Rewards</p>
              </div>
            </Link>
            <Link href="/community" className="relative h-20 rounded-xl bg-[#9B5DE5] neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer overflow-hidden group">
              <div className="relative h-full flex items-center gap-3 px-3 z-10">
                <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-white border-2 border-white shrink-0">
                  <span className="material-symbols-outlined text-lg">palette</span>
                </div>
                <p className="text-white text-sm font-black uppercase leading-tight tracking-tight">DIY<br />Community</p>
              </div>
            </Link>
            <Link href="/charity" className="relative h-20 rounded-xl bg-[#E76F51] neo-border shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer overflow-hidden group">
              <div className="relative h-full flex items-center gap-3 px-3 z-10">
                <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center text-white border-2 border-white shrink-0">
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                </div>
                <p className="text-white text-sm font-black uppercase leading-tight tracking-tight">Give<br />Back</p>
              </div>
            </Link>
          </div>
        </motion.div>


      </div>
    </motion.div>
  );
}
