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

  // Mock leaderboard for display
  const leaderboard = [
    { uid: '1', name: 'Alex Johnson', level: 8, xp: 8450, avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson' },
    { uid: '2', name: 'Sarah Chen', level: 7, xp: 7200, avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen' },
    { uid: '3', name: 'Mike Smith', level: 6, xp: 6100, avatar: 'https://ui-avatars.com/api/?name=Mike+Smith' }
  ];

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

        {/* Scan Hero - Compact Banner */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-dark rounded-[2rem] translate-x-1 translate-y-1"></div>
          <div className="relative bg-primary rounded-[2rem] border-3 border-dark dark:border-gray-600 p-5 overflow-hidden flex items-center justify-between min-h-[120px]">
            {/* Background Decoration */}
            <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 pointer-events-none rotate-12">
              <span className="material-symbols-outlined text-[100px]">photo_camera</span>
            </div>

            <div className="relative z-10 flex-1">
              <h2 className="text-2xl font-[900] text-dark dark:text-white uppercase tracking-tight mb-1 leading-none">Scan &<br />Earn!</h2>
              <p className="text-dark/80 dark:text-white/80 font-bold text-xs mb-3 max-w-[150px] leading-tight">
                Reveal upcycling ideas & coins.
              </p>
            </div>
            <Link href="/scanner"
              className="relative z-10 flex flex-col items-center justify-center gap-1 bg-dark text-white w-20 h-20 rounded-2xl shadow-brutal-sm hover:translate-y-1 active:scale-95 transition-all group-hover:shadow-none"
            >
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
              <span className="text-[10px] font-bold uppercase">Scan</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards - Compact Padding */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {/* Coins Card */}
          <div className="bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-card-yellow rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-dark">monetization_on</span>
              </div>
              <div>
                <p className="text-xl font-[900] text-dark dark:text-white leading-none">{user.coins}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold">ReCoins</p>
              </div>
            </div>
            <Link href="/rewards" className="text-[10px] font-bold text-primary flex items-center gap-1">
              Redeem <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
            </Link>
          </div>

          {/* CO2 Card */}
          <div className="bg-white dark:bg-dark-surface rounded-xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-card-green rounded-lg border-2 border-dark dark:border-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-dark">eco</span>
              </div>
              <div>
                <p className="text-xl font-[900] text-dark dark:text-white leading-none">{user.co2Saved}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold">kg CO₂ Saved</p>
              </div>
            </div>
            <Link href="/impact" className="text-[10px] font-bold text-primary flex items-center gap-1">
              Impact <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
            </Link>
          </div>
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

        {/* Personalized Leaderboard - Compact My Rank */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="font-extrabold text-dark dark:text-white text-sm">Your Rank</p>
            <Link href="/impact" className="text-xs font-bold text-primary flex items-center gap-1">
              View All <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
          <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-card-blue border-2 border-dark flex items-center justify-center flex-col shrink-0">
              <span className="text-[8px] font-bold uppercase text-dark">Rank</span>
              <span className="text-lg font-black text-dark">#42</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark dark:text-white text-sm">Top 15%</p>
              <p className="text-[10px] text-dark/60 dark:text-white/60 font-medium">Ahead of 841 students!</p>
            </div>
            <div className="text-right">
              <span className="block font-[900] text-primary text-lg">
                <span className="text-[10px] text-dark dark:text-white mr-1">up</span>
                3
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
