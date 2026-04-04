'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoManager from '@/lib/demo-manager';
import { Story } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function StoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [goals, setGoals] = useState<{ id: string; title: string; target: number; current: number; reward: string; icon: string }[]>([]);
    const [filter, setFilter] = useState<'all' | 'charity' | 'art' | 'recycling'>('all');
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [storyTitle, setStoryTitle] = useState('');
    const [storyText, setStoryText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setStories(DemoManager.getSuccessStories());
        setGoals(DemoManager.getCommunityGoals());
    }, []);

    const filteredStories = filter === 'all' ? stories : stories.filter(s => s.category === filter);

    const filterTabs = [
        { key: 'all', label: 'All' },
        { key: 'charity', label: 'Charity' },
        { key: 'art', label: 'Art' },
        { key: 'recycling', label: 'Recycle' },
    ];

    const handleSubmitStory = async () => {
        if (!storyTitle.trim() || !storyText.trim()) return;
        setIsSubmitting(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setShowContributeModal(false);
        setStoryTitle('');
        setStoryText('');
        // In a real app, we would post to backend here
        // For now just show success animation or toast if we had one
    };

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Giving Back"
                subtitle="Community impact stories"
                backHref="/"
            />

            <motion.div
                className="px-5 pb-28 space-y-4"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Community Goals - Compact */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-dark dark:text-white text-sm">🎯 Community Goals</p>
                        <button
                            onClick={() => setShowContributeModal(true)}
                            className="bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full border border-dark shadow-sm active:scale-95 transition-transform"
                        >
                            + Contribute
                        </button>
                    </div>
                    <div className="space-y-2">
                        {goals.map((goal) => {
                            const progress = Math.round((goal.current / goal.target) * 100);
                            return (
                                <div
                                    key={goal.id}
                                    className="bg-white dark:bg-dark-surface rounded-xl border-2 border-dark shadow-brutal-sm p-3"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{goal.icon}</span>
                                        <p className="font-bold text-dark dark:text-white text-sm flex-1">{goal.title}</p>
                                        <span className="text-xs font-bold text-dark/60 dark:text-white/60">
                                            {goal.current}/{goal.target}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full border border-dark overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto no-scrollbar">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as typeof filter)}
                            className={filter === tab.key ? 'tab-pill-active' : 'tab-pill-inactive'}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Stories Feed */}
                <motion.div variants={containerVariants} className="space-y-3">
                    {filteredStories.map((story) => (
                        <motion.div
                            key={story.id}
                            variants={itemVariants}
                            className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark shadow-brutal-sm overflow-hidden"
                        >
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <img
                                        src={story.authorAvatar}
                                        alt={story.author}
                                        className="w-7 h-7 rounded-full border border-dark"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-dark dark:text-white text-sm">{story.author}</p>
                                        <p className="text-[10px] text-dark/50 dark:text-white/50">{story.campus}</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${story.category === 'charity' ? 'bg-purple-100 text-purple-800' :
                                        story.category === 'art' ? 'bg-pink-100 text-pink-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {story.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-dark dark:text-white text-sm">{story.title}</h3>
                                <p className="text-xs text-dark/60 dark:text-white/60 mt-1 line-clamp-2">{story.excerpt}</p>

                                <div className="flex gap-2 mt-2">
                                    <span className="bg-card-green px-2 py-0.5 rounded border border-dark text-[10px] font-bold">
                                        {story.co2Saved}kg CO₂
                                    </span>
                                    {story.itemsTraded > 1 && (
                                        <span className="bg-card-blue px-2 py-0.5 rounded border border-dark text-[10px] font-bold">
                                            {story.itemsTraded} items
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Contribute Modal */}
            <AnimatePresence>
                {showContributeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-dark/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-2xl border-2 border-dark shadow-brutal p-5"
                        >
                            <h2 className="text-xl font-black text-dark dark:text-white mb-4">Share Your Story</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-dark/50 dark:text-white/50 mb-1 block">Title</label>
                                    <input
                                        type="text"
                                        value={storyTitle}
                                        onChange={(e) => setStoryTitle(e.target.value)}
                                        placeholder="e.g. My first upcycling project"
                                        className="w-full h-11 rounded-xl bg-gray-50 dark:bg-dark-bg border-2 border-dark px-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-dark/50 dark:text-white/50 mb-1 block">Story</label>
                                    <textarea
                                        value={storyText}
                                        onChange={(e) => setStoryText(e.target.value)}
                                        placeholder="Tell us what you did..."
                                        className="w-full h-32 rounded-xl bg-gray-50 dark:bg-dark-bg border-2 border-dark p-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setShowContributeModal(false)}
                                        className="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-dark-bg font-bold text-dark dark:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitStory}
                                        disabled={isSubmitting || !storyTitle.trim() || !storyText.trim()}
                                        className="flex-1 h-12 rounded-xl bg-primary border-2 border-dark shadow-brutal-sm font-bold text-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Story'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
