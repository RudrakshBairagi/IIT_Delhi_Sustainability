'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DBService } from '@/lib/firebase/db';
import DemoManager from '@/lib/demo-manager';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Listing } from '@/types';
import { ListingCard } from '@/components/marketplace/ListingCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
];

export default function MarketplacePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isLoading, setIsLoading] = useState(true);

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
            const unsubscribe = DemoManager.subscribe(() => {
                setListings([...DemoManager.getMockListings()]);
            });
            return unsubscribe;
        }
    }, [isDemo]);

    // Filter and sort listings
    const filteredListings = listings
        .filter(l => {
            const matchesCategory = selectedCategory === 'All' || l.category.toLowerCase().includes(selectedCategory.toLowerCase());
            const matchesSearch = !searchQuery ||
                l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'newest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
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

                {/* Categories + Sort */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-1">
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
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="shrink-0 text-xs font-bold bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
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
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different category or search term</p>
                        <Link
                            href="/sell"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-dark font-bold rounded-xl border-2 border-dark shadow-brutal-sm hover:scale-105 active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            List an item
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {filteredListings.map((listing) => (
                            <motion.div key={listing.id} variants={itemVariants}>
                                <ListingCard listing={listing} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
