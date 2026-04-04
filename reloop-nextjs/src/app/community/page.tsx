'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Trending creators data with Indian names
const trendingCreators = [
    {
        id: '1',
        username: '@PRIYA_DIY',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        featured: true,
    },
    {
        id: '2',
        username: '@RAHUL_M',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        featured: false,
    },
    {
        id: '3',
        username: '@SNEHA_K',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
        featured: false,
    },
    {
        id: '4',
        username: '@VIKRAM_A',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
        featured: false,
    },
    {
        id: '5',
        username: '@ANANYA_P',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        featured: false,
    },
];

// DIY Projects feed
const projects = [
    {
        id: '1',
        title: 'Boho Lamp From Bottles',
        author: '@EcoWarrior_22',
        authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        time: '2h ago',
        tags: [{ name: '#Glass', color: 'bg-purple-100' }, { name: '#Lighting', color: 'bg-blue-100' }],
        description: 'Turned these old glass bottles into a sick desk lamp! Wiring was easier than I thought. 💡✨',
    },
    {
        id: '2',
        title: 'Vintage Kurta Revival',
        author: '@DesignStudent99',
        authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop',
        time: '5h ago',
        tags: [{ name: '#Fashion', color: 'bg-pink-100' }, { name: '#Sewing', color: 'bg-indigo-100' }],
        description: 'Found this old kurta at a thrift shop. Added some block prints and it looks brand new! 🎨🧵',
    },
    {
        id: '3',
        title: 'Pallet Coffee Table',
        author: '@WoodWork_Wiz',
        authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
        time: '1d ago',
        tags: [{ name: '#Wood', color: 'bg-orange-100' }, { name: '#Eco', color: 'bg-green-100' }],
        description: 'Sanded down a pallet I found behind the store. Total cost: ₹200 for screws. 🔨🪵',
    },
];

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

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg pb-32 relative">
            {/* Dot Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="flex items-center justify-center w-10 h-10 bg-[#fde047] border-2 border-dark rounded-lg shadow-brutal-sm active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                            >
                                <span className="material-symbols-outlined text-dark">arrow_back</span>
                            </Link>
                            <h1 className="text-2xl font-extrabold tracking-tight text-dark dark:text-white italic">DIY HUB</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center justify-center w-10 h-10 bg-white dark:bg-dark-surface border-2 border-dark dark:border-gray-600 rounded-full shadow-brutal-sm active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all relative">
                                <span className="material-symbols-outlined text-dark dark:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                                <span className="absolute top-0 right-0 w-3 h-3 bg-primary border border-dark rounded-full" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Collaborate CTA - At Top */}
                <div className="px-4 pt-4">
                    <div className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] rounded-2xl border-2 border-dark shadow-brutal p-4">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">🤝</div>
                            <div className="flex-1">
                                <h3 className="font-black text-white uppercase text-sm mb-0.5">Find Collab Partners</h3>
                                <p className="text-white/80 text-xs">Team up to create upcycled projects!</p>
                            </div>
                            <button className="bg-white text-dark font-bold text-xs uppercase px-4 py-2 rounded-full border-2 border-dark shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0">
                                Browse
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trending Creators */}
                <section className="mt-6 pl-4">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-dark dark:text-white">local_fire_department</span>
                        <h2 className="text-lg font-extrabold uppercase tracking-wide text-dark dark:text-white">Trending Creators</h2>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-4 pr-4 no-scrollbar">
                        {trendingCreators.map((creator) => (
                            <div key={creator.id} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
                                <div className="w-16 h-16 rounded-full border-2 border-dark overflow-hidden bg-white shadow-brutal-sm group-active:shadow-none group-active:translate-y-[2px] group-active:translate-x-[2px] transition-all">
                                    <img
                                        src={creator.image}
                                        alt={creator.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className={`text-[10px] font-bold uppercase text-center px-2 py-0.5 rounded-md ${creator.featured
                                    ? 'bg-dark text-white'
                                    : 'border border-dark bg-white text-dark dark:bg-dark-surface dark:text-white dark:border-gray-600'
                                    }`}>
                                    {creator.username}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main Feed */}
                <motion.main
                    className="flex flex-col gap-8 px-4 mt-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase text-dark dark:text-white">Fresh Projects</h1>
                        <button className="text-sm font-bold underline decoration-2 decoration-primary underline-offset-4 text-dark dark:text-white">View All</button>
                    </div>

                    {/* Project Cards - 2 Column Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {projects.map((project) => (
                            <motion.article
                                key={project.id}
                                variants={itemVariants}
                                className="bg-white dark:bg-dark-surface border-2 border-dark dark:border-gray-600 rounded-2xl shadow-brutal overflow-hidden flex flex-col group"
                            >
                                {/* Image */}
                                <div className="relative aspect-square w-full border-b-2 border-dark dark:border-gray-600 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 right-2 bg-white border border-dark px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {project.time}
                                    </div>
                                    {/* Tags overlay */}
                                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                                        {project.tags.slice(0, 1).map((tag) => (
                                            <span key={tag.name} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tag.color} text-dark border border-dark`}>
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-3 flex flex-col gap-2">
                                    <h3 className="text-sm font-extrabold uppercase leading-tight tracking-tight text-dark dark:text-white line-clamp-2">
                                        {project.title}
                                    </h3>

                                    {/* User */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full border border-dark overflow-hidden bg-gray-200">
                                            <img src={project.authorImage} alt={project.author} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{project.author}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-1">
                                        <button className="flex-1 flex items-center justify-center gap-1 h-8 bg-[#fde047] text-dark font-bold text-xs border-2 border-dark rounded-lg shadow-brutal-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all">
                                            <span className="material-symbols-outlined text-[16px]">bookmark</span>
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-1 h-8 bg-primary text-dark font-bold text-xs border-2 border-dark rounded-lg shadow-brutal-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all">
                                            <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                </motion.main>
            </div>

            {/* Floating Add Button */}
            <button className="fixed bottom-24 right-4 w-16 h-16 bg-[#fde047] neo-border rounded-full shadow-brutal flex items-center justify-center z-40 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                <span className="material-symbols-outlined text-dark text-4xl">add</span>
            </button>
        </div>
    );
}
