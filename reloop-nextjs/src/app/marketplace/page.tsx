'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DBService } from '@/lib/firebase/db';
import DemoManager from '@/lib/demo-manager';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Listing } from '@/types';
import { useRouter } from 'next/navigation';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home'];

export default function MarketplacePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const { isDemo } = useAuth();

    const loadListings = async () => {
        setIsLoading(true);
        try {
            if (isDemo) {
                setListings(DemoManager.getMockListings());
            } else {
                const data = await DBService.getListings();
                setListings(data);
            }
        } catch (error) {
            console.error("Failed to load listings", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadListings();

        if (isDemo) {
            // Subscribe to DemoManager for real-time updates
            const unsubscribe = DemoManager.subscribe(() => {
                setListings([...DemoManager.getMockListings()]);
            });
            return unsubscribe;
        }
    }, [isDemo]);

    // Filter by category first, then by search query
    const filteredListings = listings.filter(l => {
        const matchesCategory = selectedCategory === 'All' || l.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch = !searchQuery ||
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <motion.header
                className="px-5 pt-6 pb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-[900] text-dark dark:text-white">Marketplace</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Trade sustainably</p>
                    </div>
                    <Link
                        href="/sell"
                        className="w-12 h-12 bg-primary rounded-full border-2 border-dark flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-2xl text-dark">add</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-search"
                    />
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 22 }}>
                        search
                    </span>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={selectedCategory === cat ? 'tab-pill-active' : 'tab-pill-inactive'}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.header>

            <div className="px-5 pb-28">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredListings.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-gray-700 mx-auto flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No items found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different category</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 gap-3"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {filteredListings.map((listing) => (
                            <motion.div key={listing.id} variants={itemVariants}>
                                <Link href={`/marketplace/${listing.id}`}>
                                    <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-600 shadow-brutal-sm overflow-hidden hover:-translate-y-1 transition-transform">
                                        <div className="aspect-square bg-gray-100 dark:bg-dark-bg relative">
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Price Badge */}
                                            <span className="absolute top-2 right-2 px-2 py-1 bg-primary rounded-lg text-xs font-bold text-dark flex items-center gap-1 border border-dark">
                                                🪙 {listing.price}
                                            </span>
                                            {/* Top Impact Badge */}
                                            {listing.isTopImpact && (
                                                <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-dark flex items-center gap-1 border border-dark">
                                                    <span className="material-symbols-outlined material-symbols-filled text-primary" style={{ fontSize: 12 }}>eco</span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm text-dark dark:text-white truncate">{listing.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{listing.condition}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100">
                                                    <img
                                                        src={listing.seller.avatar}
                                                        alt={listing.seller.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{listing.seller.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
