'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';

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
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

export default function ImpactPage() {
    const { user } = useAuth();

    return (
        <div className="relative flex min-h-screen flex-col w-full bg-gradient-to-b from-sky-200 via-sky-50 to-white dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg overflow-hidden pb-32">
            {/* Header */}
            <header className="flex items-center justify-between pt-8 pb-2 px-6 w-full z-10">
                <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <span className="material-symbols-outlined text-3xl font-bold group-hover:-translate-x-1 transition-transform dark:text-white">arrow_back</span>
                </Link>
                <Link href="/settings" className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-45 transition-transform dark:text-white">settings</span>
                </Link>
            </header>

            {/* Main Content */}
            <motion.main
                className="flex-1 flex flex-col items-center px-6 pt-2 pb-8 w-full z-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Profile Section */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-10 relative w-full">
                    <div className="relative mb-4 group cursor-pointer">
                        <div className="w-32 h-32 rounded-full neo-border overflow-hidden shadow-brutal bg-white transition-transform group-hover:scale-105 group-active:scale-95">
                            <Image
                                src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary neo-border rounded-full px-4 py-1.5 shadow-brutal-sm flex items-center gap-1.5 min-w-max z-20">
                            <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                            <span className="text-xs font-black uppercase tracking-wider text-dark">Eco-Warrior</span>
                        </div>
                    </div>
                    <h1 className="text-[42px] leading-[0.9] font-black uppercase text-center mt-5 tracking-tight dark:text-white">
                        Your<br />Impact
                    </h1>
                </motion.div>

                <div className="w-full flex flex-col gap-5">
                    {/* CO2 Card - Hero */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full bg-white dark:bg-dark-surface rounded-[2rem] neo-border shadow-brutal p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px] group hover:shadow-brutal-lg transition-all duration-300"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-2xl text-gray-400" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_off</span>
                                <span className="font-extrabold text-sm tracking-widest uppercase text-dark/60 dark:text-white/60">CO2 Saved</span>
                            </div>
                            <div className="text-[64px] font-black leading-none tracking-tighter dark:text-white">
                                {user?.co2Saved || 45}
                                <span className="text-3xl text-dark/40 dark:text-white/40 font-bold ml-1">kg</span>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.8rem]">
                            <svg className="absolute bottom-0 left-0 w-[150%] h-auto text-[#f0fdf4] dark:text-dark-bg -ml-8" fill="currentColor" viewBox="0 0 1440 320">
                                <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,160C960,139,1056,149,1152,160C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fillOpacity="1" />
                            </svg>
                            <div className="absolute bottom-[-10px] right-[-20px] text-[120px] leading-none opacity-30 grayscale contrast-200">🌲</div>
                            <div className="absolute bottom-[20px] right-[50px] text-[80px] leading-none opacity-50 grayscale contrast-200">🌲</div>
                            <div className="absolute bottom-[40px] right-[100px] text-[50px] leading-none opacity-80 grayscale contrast-200">🌳</div>
                            <span className="material-symbols-outlined absolute top-6 right-6 text-5xl text-sky-100 dark:text-dark-bg animate-bounce" style={{ animationDuration: '3s', fontVariationSettings: "'FILL' 1" }}>cloud</span>
                        </div>

                        <div className="relative z-10 mt-auto pt-6">
                            <div className="bg-primary/20 backdrop-blur-sm neo-border inline-flex items-center gap-2 px-3 py-1.5 rounded-xl">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wide dark:text-white">Top 10% on campus!</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Trees Planted */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#a7f3d0] rounded-[2rem] neo-border shadow-brutal p-5 flex flex-col justify-between aspect-square relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="absolute -right-6 -top-6 bg-white/40 w-24 h-24 rounded-full transition-transform group-hover:scale-150 duration-500" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="text-4xl">🌳</div>
                                <div>
                                    <div className="text-3xl font-black mb-1 text-dark">12</div>
                                    <div className="text-[11px] font-extrabold uppercase tracking-wide leading-tight text-dark/80">Trees<br />Planted</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Coins Earned */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#fde047] rounded-[2rem] neo-border shadow-brutal p-5 flex flex-col justify-between aspect-square relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="absolute -right-6 -top-6 bg-white/40 w-24 h-24 rounded-full transition-transform group-hover:scale-150 duration-500" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="text-4xl">🪙</div>
                                <div>
                                    <div className="text-3xl font-black mb-1 text-dark">{user?.coins || 450}</div>
                                    <div className="text-[11px] font-extrabold uppercase tracking-wide leading-tight text-dark/80">Coins<br />Earned</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Community Rank Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-dark-surface rounded-[2rem] neo-border shadow-brutal p-5 flex items-center justify-between mt-2 group hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 neo-border flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                                <span className="material-symbols-outlined text-2xl text-dark dark:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-extrabold uppercase text-gray-500 dark:text-gray-400 tracking-wider mb-0.5">Community Rank</span>
                                <span className="text-xl font-black dark:text-white">#42 Overall</span>
                            </div>
                        </div>
                        <div className="text-3xl group-hover:scale-125 transition-transform">🎉</div>
                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
}
