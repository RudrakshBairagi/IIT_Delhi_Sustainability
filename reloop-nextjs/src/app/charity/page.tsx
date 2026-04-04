'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';

const charities = DemoManager.getCharityPartners();

export default function CharityPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="px-5 pt-6 pb-4 flex items-center gap-3">
                <Link href="/" className="w-10 h-10 bg-white dark:bg-dark-surface rounded-full border-2 border-dark dark:border-gray-600 flex items-center justify-center shadow-brutal-sm active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-[900] text-dark dark:text-white uppercase tracking-tight">Donate Coins</h1>
            </div>

            <div className="px-5 space-y-4">
                <div className="bg-card-yellow rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4">
                    <h2 className="font-[900] text-xl text-dark mb-1">Make an Impact</h2>
                    <p className="text-sm font-bold text-dark/70">Use your ReCoins to support real-world causes. 100% of donations go directly to partners.</p>
                </div>

                <div className="grid gap-4">
                    {charities.map((charity) => (
                        <motion.div
                            key={charity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm p-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-4xl border-2 border-dark/10">
                                    {charity.logo}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-[900] text-lg text-dark dark:text-white leading-tight mb-1">{charity.name}</h3>
                                    <p className="text-xs font-bold text-gray-500 mb-2">{charity.description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-1 rounded-md">
                                            {charity.impact}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-4 bg-dark dark:bg-white text-white dark:text-dark font-bold py-3 rounded-xl uppercase tracking-wide active:scale-95 transition-transform">
                                Donate {charity.minDonation} Coins
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
