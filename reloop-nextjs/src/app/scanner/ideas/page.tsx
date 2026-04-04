'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ScannerService from '@/lib/scanner-service';
import { ScanResult, UpcycleIdea } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const DIFFICULTY_COLORS: Record<string, string> = {
    Easy: 'bg-card-green',
    Medium: 'bg-card-yellow',
    Hard: 'bg-card-pink',
};

const TIME_BY_DIFFICULTY: Record<string, string> = {
    Easy: '15 min',
    Medium: '30 min',
    Hard: '45 min',
};

export default function UpcycleIdeasPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);

    useEffect(() => {
        const storedResult = ScannerService.getStoredResult();
        if (!storedResult) {
            router.push('/scanner');
            return;
        }
        setResult(storedResult);
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { item } = result;
    const ideas = item.upcycleIdeas || [];

    const openYouTubeSearch = (title: string) => {
        const query = encodeURIComponent(`${title} DIY tutorial`);
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    };

    const openPinterestSearch = (title: string) => {
        const query = encodeURIComponent(`${title} DIY`);
        window.open(`https://www.pinterest.com/search/pins/?q=${query}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Reuse Ideas"
                subtitle={`For your ${item.objectName}`}
                backHref="/scanner/result"
            />

            <motion.div
                className="px-5 pb-28 space-y-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {ideas.map((idea, index) => {
                    const thumbnail = idea.thumbnail || `https://source.unsplash.com/200x200/?${encodeURIComponent(idea.title + ' DIY')}`;
                    const bgColor = DIFFICULTY_COLORS[idea.difficulty] || 'bg-card-green';
                    const isYouTube = idea.source === 'youtube';
                    const timeEstimate = TIME_BY_DIFFICULTY[idea.difficulty] || '30 min';

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            onClick={() => openYouTubeSearch(idea.title)}
                            className={`${bgColor} rounded-2xl border-2 border-dark shadow-brutal-sm p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform`}
                        >
                            {/* Thumbnail */}
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-xl border-2 border-dark overflow-hidden bg-white">
                                    <img
                                        src={thumbnail}
                                        alt={idea.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.title)}&background=22c358&color=fff&size=200`;
                                        }}
                                    />
                                </div>
                                {/* Source badge */}
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${isYouTube ? 'bg-red-500' : 'bg-[#E60023]'} rounded-full border-2 border-dark flex items-center justify-center`}>
                                    <span className="text-white text-[10px] font-bold">{isYouTube ? '▶' : '📌'}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-dark text-sm truncate">{idea.title}</h3>
                                <p className="text-xs text-dark/50 truncate mb-1">{idea.description}</p>
                                <div className="flex gap-1">
                                    <span className="inline-flex items-center px-2 py-0.5 bg-white rounded-lg border border-dark text-[10px] font-bold text-dark">
                                        ⏱ {timeEstimate}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 bg-white rounded-lg border border-dark text-[10px] font-bold text-dark">
                                        {idea.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <span className="material-symbols-outlined text-dark/40 text-lg shrink-0">chevron_right</span>
                        </motion.div>
                    );
                })}

                {/* Find More */}
                <motion.div variants={itemVariants} className="pt-2 space-y-2">
                    <p className="text-xs font-bold text-dark/40 text-center">Find More Ideas</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => openYouTubeSearch(item.objectName + ' upcycle')}
                            className="bg-white py-3 rounded-xl border-2 border-dark shadow-brutal-sm font-bold text-dark text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            <span className="text-red-500">▶</span>
                            YouTube
                        </button>
                        <button
                            onClick={() => openPinterestSearch(item.objectName + ' upcycle')}
                            className="bg-white py-3 rounded-xl border-2 border-dark shadow-brutal-sm font-bold text-dark text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            <span className="text-[#E60023]">📌</span>
                            Pinterest
                        </button>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={() => router.push('/scanner/result')}
                        className="w-full bg-dark text-white py-4 rounded-2xl font-black shadow-brutal active:translate-y-1 active:shadow-none transition-all"
                    >
                        Back to Result
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
