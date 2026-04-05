'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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

import { PageHeader } from '@/components/ui/PageHeader';

export default function HomePage() {
  const { user, isLoading, isDemo } = useAuth();
  const router = useRouter();
  const [userRank, setUserRank] = useState(12); // Default fallback
  const [percentile, setPercentile] = useState(5); // Default top 5%

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchRank = async () => {
      if (isDemo || !user?.uid) {
        setUserRank(12);
        setPercentile(5);
        return;
      }

      try {
        const rankData = await DBService.getUserRank(user.uid);
        if (rankData) {
          setUserRank(rankData.rank);
          setPercentile(100 - rankData.percentile); // Top X%
        }
      } catch (error) {
        console.error('Error fetching user rank:', error);
      }
    };

    fetchRank();
  }, [user?.uid, isDemo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div 
      className="bg-surface text-on-surface min-h-screen pb-32 font-['Plus_Jakarta_Sans']"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <PageHeader showBackButton={false} />
      </motion.div>

      <main className="px-6 pt-2 pb-8 space-y-10">
        {/* Stories Section */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight uppercase text-primary">COMMUNITY STORIES</h2>
            <span className="text-xs font-bold text-outline uppercase tracking-widest">View All</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
              <div className="p-1 rounded-full border-2 border-terracotta">
                <img alt="Your profile" className="w-16 h-16 rounded-full object-cover" src={user.avatar || ("https://ui-avatars.com/api/?name=" + (user.name || 'User'))} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Your Story</span>
            </div>
            {/* Mock Stories */}
            {[
              { name: 'Shaolin', img: '/images/stories/shaolin.jpg' },
              { name: 'Rudraksh', img: '/images/stories/rudraksh.jpg' },
              { name: 'Mihir', img: '/images/stories/mihir.jpg' },
              { name: 'Arjun', img: '/images/stories/arjun.jpg' },
              { name: 'Charu', img: '/images/stories/charu.jpg' }
            ].map((story, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 opacity-80 cursor-pointer">
                <div className="p-1 rounded-full border-2 border-primary/30">
                  <img alt={`${story.name} profile`} className="w-16 h-16 rounded-full object-cover" src={story.img} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{story.name}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Featured Tile: Recycle Bags */}
        <motion.section variants={itemVariants}>
          <Link href="/smart-bags" className="block">
            <div className="bg-terracotta rounded-xl p-8 text-on-terracotta relative overflow-hidden group transition-transform duration-300 active:scale-[0.98]">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 p-3 rounded-full">
                    <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
                  </div>
                  <span className="bg-on-terracotta text-terracotta px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">New Batch</span>
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold leading-none mb-2">RECYCLE BAGS</h2>
                  <p className="text-on-terracotta/80 text-sm font-medium max-w-[200px]">Scan your smart bags to log your impact and earn coins.</p>
                </div>
                <button className="bg-on-terracotta text-terracotta py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 w-full text-center">
                  Start Scanning
                </button>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Quick Actions (Replacing Daily Actions, moved up) */}
        <motion.section variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-on-surface">Quick Actions</h2>
            <Link href="/actions" className="text-[10px] font-bold text-primary tracking-widest uppercase">View All</Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Link href="/pickups" className="flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-surface-container-low rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
              </div>
              <span className="text-[10px] font-bold text-center leading-tight uppercase">Pickups</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-surface-container-low rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
              </div>
              <span className="text-[10px] font-bold text-center leading-tight uppercase">History</span>
            </Link>
            <Link href="/charity" className="flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-surface-container-low rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
              </div>
              <span className="text-[10px] font-bold text-center leading-tight uppercase">Donate</span>
            </Link>
            <Link href="/drop-off" className="flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-surface-container-low rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary">map</span>
              </div>
              <span className="text-[10px] font-bold text-center leading-tight uppercase">Drop-off</span>
            </Link>
          </div>
        </motion.section>

        {/* Stats Bento Grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
          <Link href="/leaderboard" className="block">
            <div className="bg-surface-container-low p-6 rounded-xl space-y-4 h-full">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-lg">leaderboard</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Campus Ranking</span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-on-surface tracking-tighter">#{userRank}</p>
                <p className="text-[10px] font-bold text-outline uppercase tracking-tight">Top {percentile}% Student</p>
              </div>
            </div>
          </Link>
          <Link href="/impact?tab=personal" className="block">
            <div className="bg-primary-container p-6 rounded-xl space-y-4 h-full">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-lg">eco</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">CO2 Impact</span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-primary tracking-tighter">{user.co2Saved}<span className="text-sm">kg</span></p>
                <p className="text-[10px] font-bold text-primary-dim uppercase tracking-tight">Offset this month</p>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Action Grid */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-xl font-extrabold tracking-tight uppercase text-primary">DAILY ACTIONS</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/missions" className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4 group cursor-pointer transition-shadow hover:shadow-md block">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-primary">task_alt</span>
              </div>
              <p className="font-extrabold text-lg leading-tight uppercase tracking-tighter">Missions</p>
            </Link>
            <Link href="/rewards" className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4 group cursor-pointer transition-shadow hover:shadow-md block">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-primary">redeem</span>
              </div>
              <p className="font-extrabold text-lg leading-tight uppercase tracking-tighter">My<br/>Rewards</p>
            </Link>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4 group cursor-pointer transition-shadow hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-primary">electric_bike</span>
              </div>
              <p className="font-extrabold text-lg leading-tight uppercase tracking-tighter">Green<br/>Travel</p>
            </div>
            <Link href="/charity" className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4 group cursor-pointer transition-shadow hover:shadow-md block">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
              </div>
              <p className="font-extrabold text-lg leading-tight uppercase tracking-tighter">Donated<br/>Items</p>
            </Link>
          </div>
        </motion.section>

        {/* Editorial Banner */}
        <motion.section variants={itemVariants} className="bg-surface-container-highest rounded-xl p-8 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <h3 className="text-3xl font-extrabold tracking-tighter leading-none text-on-surface">GREEN<br/>GUIDE 2024</h3>
            <p className="text-sm font-medium text-outline">The ultimate circular living guide.</p>
            <Link href="/guide" className="inline-block mt-4 text-xs font-bold border-b-2 border-primary text-primary py-1 uppercase tracking-widest">
              Read More
            </Link>
          </div>
          <div className="w-32 h-32 opacity-20 absolute -right-4 -bottom-4">
            <span className="material-symbols-outlined text-9xl text-primary">menu_book</span>
          </div>
        </motion.section>
      </main>

    </motion.div>
  );
}
