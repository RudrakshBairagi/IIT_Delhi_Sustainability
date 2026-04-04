'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SmartBag, User } from '@/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

type TabType = 'active' | 'history' | 'stats';

export default function SmartBagsPage() {
    const { user, isDemo, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [bags, setBags] = useState<SmartBag[]>([]);
    const [totalCoins, setTotalCoins] = useState(0);
    const [userProfile, setUserProfile] = useState<User | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (!user) return;

        // Fetch user profile for accurate stats
        DBService.getUserProfile(user.uid).then(profile => {
            if (profile) setUserProfile(profile);
        });

        if (isDemo) {
            // Demo mode - use mock data
            const DemoManager = require('@/lib/demo-manager').default;
            const userBags = DemoManager.getSmartBags();
            setBags(userBags);
            setTotalCoins(userBags.reduce((sum: number, bag: SmartBag) => sum + (bag.coinsAwarded || 0), 0));
            return;
        }

        // Real Firebase subscription
        const unsubscribe = DBService.subscribeToUserSmartBags(user.uid, (fetchedBags) => {
            setBags(fetchedBags as SmartBag[]);
            const coins = fetchedBags.reduce((sum: number, bag: any) => sum + (bag.coinsAwarded || 0), 0);
            setTotalCoins(coins);
        });

        return () => unsubscribe();
    }, [user, isDemo]);

    if (!user) return null;

    const activeBags = bags.filter(b => b.status !== 'processed');
    const historyBags = bags.filter(b => b.status === 'processed');
    const totalWeight = bags.reduce((sum, bag) => sum + (bag.estimatedWeight || 0), 0);
    const co2Saved = userProfile?.co2Saved?.toFixed(1) || (totalWeight * 2.5).toFixed(1);

    // Format timestamp for display
    const formatDate = (timestamp?: any) => {
        if (!timestamp) return 'Recent';
        const date = new Date(timestamp.toMillis ? timestamp.toMillis() : timestamp);
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(date);
    };

    return (
        <div className="text-on-surface min-h-screen pb-32 bg-surface font-['Plus_Jakarta_Sans']">
            {/* TopAppBar Shell */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] bg-[#f9f6f1]/80">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
                        <img 
                            alt="User Profile" 
                            className="w-full h-full object-cover"
                            src={user.avatar || ("https://ui-avatars.com/api/?name=" + (user.name || 'User'))} 
                        />
                    </div>
                    <span className="font-extrabold tracking-tighter text-2xl text-[#29664c]">RELOOP</span>
                </Link>
                <div className="flex items-center gap-2 bg-primary-container px-4 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                    <span className="font-bold text-on-primary-container text-sm">{user.coins || 0}</span>
                </div>
            </header>

            <main className="pt-28 px-6 max-w-2xl mx-auto">
                {/* Title & Tabs */}
                <section className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-6">SMART BAGS</h1>
                    <div className="flex gap-2 p-1 rounded-full bg-primary/5">
                        <button 
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all rounded-full ${activeTab === 'active' ? 'text-primary shadow-sm bg-white' : 'text-outline hover:text-on-surface'}`}
                        >
                            ACTIVE
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all rounded-full ${activeTab === 'history' ? 'text-primary shadow-sm bg-white' : 'text-outline hover:text-on-surface'}`}
                        >
                            HISTORY
                        </button>
                        <button 
                            onClick={() => setActiveTab('stats')}
                            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all rounded-full ${activeTab === 'stats' ? 'text-primary shadow-sm bg-white' : 'text-outline hover:text-on-surface'}`}
                        >
                            STATS
                        </button>
                    </div>
                </section>

                {/* Hero Card: Bag Deposit */}
                <motion.section 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative overflow-hidden mb-8 rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-primary-container/10 bg-white group transition-transform duration-300"
                >
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-12">
                            <div>
                                <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-1">Current Status</span>
                                <h2 className="text-2xl font-extrabold tracking-tight uppercase">Recycling Bag Deposit</h2>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-tertiary">inventory_2</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-surface-container-low p-4 rounded-[2rem] flex flex-col items-center justify-center aspect-square">
                                <span className="text-2xl font-extrabold text-primary">{activeBags.length}</span>
                                <span className="text-[10px] font-bold text-outline tracking-wider uppercase mt-1">Active</span>
                            </div>
                            <div className="bg-surface-container-low p-4 rounded-[2rem] flex flex-col items-center justify-center aspect-square">
                                <span className="text-2xl font-extrabold text-primary">{historyBags.length}</span>
                                <span className="text-[10px] font-bold text-outline tracking-wider uppercase mt-1">Done</span>
                            </div>
                            <div className="bg-primary p-4 rounded-[2rem] flex flex-col items-center justify-center aspect-square">
                                <span className="text-2xl font-extrabold text-on-primary">{totalCoins}</span>
                                <span className="text-[10px] font-bold text-on-primary/70 tracking-wider uppercase mt-1">Coins</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/30 transition-all duration-500"></div>
                </motion.section>

                {/* Action Button */}
                <motion.section variants={itemVariants} initial="hidden" animate="visible" className="mb-12">
                    <Link href="/smart-bags/scan" className="w-full group relative flex items-center justify-between p-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full transition-transform active:scale-95 duration-200 shadow-[0_20px_40px_-10px_rgba(41,48,47,0.3)]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-on-primary/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                            </div>
                            <div className="text-left">
                                <span className="block text-lg font-extrabold tracking-tight uppercase">Register New Bag</span>
                                <span className="text-xs font-medium text-on-primary/80">Scan the tag to start tracking</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </motion.section>

                {/* Content Section based on Tab */}
                <AnimatePresence mode="wait">
                    <motion.section 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {activeTab === 'active' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Active Bags</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {activeBags.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <span className="material-symbols-outlined text-5xl text-outline mb-4 opacity-50">shopping_bag</span>
                                            <p className="text-outline text-sm font-bold">No active bags currently tracked.</p>
                                        </div>
                                    ) : (
                                        activeBags.map(bag => (
                                            <Link key={bag.id} href={`/smart-bags/${bag.id}`} className="flex items-center justify-between bg-white border border-outline-variant/10 p-5 rounded-[2rem] hover:bg-surface-container-low transition-colors cursor-pointer group shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-surface-container text-primary flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-xl">inventory_2</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-sm tracking-tight text-on-surface uppercase">Bag #{bag.qrCode}</p>
                                                        <p className="text-[10px] font-bold text-outline tracking-wider uppercase mt-1">
                                                            {bag.status === 'registered' ? 'Ready' : bag.status === 'filled' ? 'Awaiting Pickup' : 'In Transit'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'history' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Recent History</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {historyBags.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <span className="material-symbols-outlined text-5xl text-outline mb-4 opacity-50">history</span>
                                            <p className="text-outline text-sm font-bold">No history available yet.</p>
                                        </div>
                                    ) : (
                                        historyBags.map(bag => (
                                            <Link key={bag.id} href={`/smart-bags/${bag.id}`} className="flex items-center justify-between bg-surface-container-low p-5 rounded-[2rem] hover:bg-surface-container transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-sm tracking-tight text-on-surface uppercase">Bag #{bag.qrCode}</p>
                                                        <p className="text-[10px] font-bold text-outline tracking-wider uppercase mt-1">
                                                            {formatDate(bag.createdAt)} • {bag.coinsAwarded || 0} Coins Earned
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'stats' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Your Impact</h3>
                                </div>
                                <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-10px_rgba(41,48,47,0.06)] border border-outline-variant/10 space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b-2 border-dashed border-surface-container">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">scale</span>
                                            <span className="font-bold text-sm text-on-surface-variant">Total Weight Recycled</span>
                                        </div>
                                        <span className="font-extrabold text-xl text-on-surface">{totalWeight.toFixed(1)} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b-2 border-dashed border-surface-container">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-full">eco</span>
                                            <span className="font-bold text-sm text-on-surface-variant">CO₂ Saved</span>
                                        </div>
                                        <span className="font-extrabold text-xl text-secondary">{co2Saved} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-terracotta bg-terracotta/10 p-2 rounded-full">monetization_on</span>
                                            <span className="font-bold text-sm text-on-surface-variant">Lifetime Coins Earned</span>
                                        </div>
                                        <span className="font-extrabold text-xl text-terracotta">{totalCoins}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.section>
                </AnimatePresence>
            </main>
        </div>
    );
}
