'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DBService } from '@/lib/firebase/db';
import DemoManager from '@/lib/demo-manager';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Listing } from '@/types';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const CATEGORIES = ['ALL ITEMS', 'FURNITURE', 'CLOTHING', 'ELECTRONICS'];

export default function MarketplacePage() {
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL ITEMS');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { user, isDemo } = useAuth();
    const currentUserId = isDemo ? 'demo-user-123' : user?.uid;

    useEffect(() => {
        let mounted = true;

        // Load static demo listings
        setIsLoading(true);
        if (mounted) {
            setListings([...DemoManager.getMockListings()]);
            setIsLoading(false);
        }

        // Subscribe to demo manager changes (e.g. if an item is bought during demo)
        const unsubscribe = DemoManager.subscribe(() => {
            if (mounted) {
                setListings([...DemoManager.getMockListings()]);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const getFilteredListings = () => {
        if (!listings || !Array.isArray(listings)) return [];
        
        let filtered = listings.filter(l => l && l.seller?.id !== currentUserId);

        filtered = filtered.filter(l => {
            const catStr = l.category ? String(l.category).toUpperCase() : '';
            const matchesCategory = selectedCategory === 'ALL ITEMS' || catStr.includes(selectedCategory);
            
            const titleStr = l.title ? String(l.title).toLowerCase() : '';
            const descStr = l.description ? String(l.description).toLowerCase() : '';
            const searchStr = searchQuery ? searchQuery.toLowerCase() : '';
            
            const matchesSearch = !searchQuery ||
                titleStr.includes(searchStr) ||
                descStr.includes(searchStr);
                
            return matchesCategory && matchesSearch;
        });

        // Default sort by newest, safely handling missing dates
        filtered = filtered.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return (timeB || 0) - (timeA || 0);
        });

        return filtered;
    };

    const filteredListings = getFilteredListings();

    return (
        <div className="bg-warm-sand text-on-surface min-h-screen pb-32 font-['Plus_Jakarta_Sans']">
            {/* TopAppBar */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-warm-sand/80 dark:bg-[#1a1c1b]/80 backdrop-blur-3xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#29664c] dark:text-[#b9f9d6] cursor-pointer active:scale-95 transition-transform" onClick={() => router.push('/')}>arrow_back</span>
                    <h1 className="font-extrabold tracking-tight text-2xl text-[#29664c] dark:text-[#b9f9d6] tracking-[-2%]">RELOOP</h1>
                </div>
                <div className="flex items-center gap-2 bg-primary-container px-4 py-2 rounded-lg active:scale-95 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                    <span className="font-bold text-sm text-on-primary-container">{user?.coins || 0} Coins</span>
                </div>
            </header>

            <main className="pt-24 px-6 max-w-5xl mx-auto">
                {/* Marketplace Hero / Search Section */}
                <section className="mt-4 mb-6">
                    <div className="flex flex-col mb-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">MARKET HUB</h2>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-outline">search</span>
                        </div>
                        <input 
                            className="w-full h-16 pl-14 pr-6 bg-surface-container-high border-none rounded-xl font-bold text-sm tracking-wide focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline/60" 
                            placeholder="SEARCH ECO ITEMS..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Category Chips */}
                <section className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[5%] active:scale-95 transition-all ${selectedCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </section>

                {/* Fresh Picks Grid */}
                <section className="mt-6">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-2xl font-extrabold tracking-tight text-on-surface uppercase">FRESH PICKS</h3>
                            <div className="h-1.5 w-12 bg-primary mt-1 rounded-full"></div>
                        </div>
                        <Link href="/my-listings" className="text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline">
                            My Items
                        </Link>
                    </div>

                        <motion.div 
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredListings.length === 0 ? (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                                    <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
                                    <h3 className="font-extrabold text-lg">No Items Found</h3>
                                    <p className="text-sm font-medium text-on-surface-variant">Try adjusting your filters or search query</p>
                                </div>
                            ) : (
                                filteredListings.map(listing => (
                                    <motion.div key={listing.id} variants={itemVariants} className="flex">
                                        <Link href={`/marketplace/${listing.id}`} className="flex flex-col group cursor-pointer bg-white p-3 rounded-xl border border-outline-variant/10 shadow-sm transition-all hover:shadow-md w-full h-full">
                                            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-surface-container shadow-sm group-hover:shadow-md transition-all duration-500">
                                                <img 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                    alt={listing.title} 
                                                    src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&fit=crop'}
                                                />
                                                {listing.condition && (
                                                    <div className="absolute top-2 left-2">
                                                        <span className="bg-surface/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-extrabold text-primary uppercase tracking-tighter">
                                                            {listing.condition}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-1 flex flex-col justify-between flex-grow">
                                                <h4 className="font-extrabold text-sm text-on-surface leading-tight uppercase line-clamp-2">{listing.title}</h4>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                                                        <span className="font-bold text-secondary text-xs">{listing.price > 0 ? `${listing.price} Coins` : 'FREE'}</span>
                                                    </div>
                                                    <div className="bg-surface-container-high px-2 py-1 rounded-md">
                                                        <span className="font-bold text-on-surface-variant text-[10px]">₹{Math.round((listing.price * 1.6) || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                </section>

                {/* Asymmetric Promotion Card */}
                <section className="mt-16 mb-12">
                    <div className="bg-primary-container p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
                        <div className="z-10 flex-1">
                            <span className="font-extrabold text-[10px] uppercase tracking-[15%] text-on-primary-container/70 mb-4 block">SELLER SPOTLIGHT</span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-on-primary-container leading-none tracking-tight mb-6">TURN YOUR TRASH TO TREASURE</h2>
                            <p className="text-on-primary-container/80 text-lg mb-8 max-w-md">List your pre-loved items and earn Coins instantly. It's time to close the loop.</p>
                            <Link href="/sell" className="inline-block bg-primary text-on-primary px-10 py-4 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-transform uppercase tracking-widest">
                                START SELLING
                            </Link>
                        </div>
                        <div className="relative w-full md:w-1/3 aspect-square rounded-xl overflow-hidden rotate-3 shadow-2xl z-10">
                            <img className="w-full h-full object-cover" alt="Recycling Promotion" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBythMf-wza9iVV5KX_De6_RHvfsb6pW06mfz9P8eVTfZWEV8qzQhyXYKe_OV0MNJE89xmFraYgZUUO0bacQm24IGBtnv-HGT-EfKKE6UZkoG0Hkfq1DRP0QImVBFV-n5vYpNYEHhxB4dnMiOm5DW6LBu35jR0tOZaXJOG5HMgrzGnZXKocCMY6KeH6Ut-TY4WgAssb-41qMnJwy0_7bF345uP9f8euBw2cXMwWQlYaXfBL76NoCkF5QSk1pZXXu1NrPhKQR_6sQzw"/>
                        </div>
                        {/* Decorative background text */}
                        <div className="absolute -bottom-10 -right-20 text-[180px] font-extrabold text-primary/5 select-none pointer-events-none">LIST</div>
                    </div>
                </section>
            </main>
        </div>
    );
}
