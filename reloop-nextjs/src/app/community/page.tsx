'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import VideoModal from '@/components/ui/VideoModal';

const trendingCreators = [
    { id: '1', username: '@RUDRAKSH', image: 'https://ui-avatars.com/api/?name=Rudraksh&background=random', border: 'border-[#29664c]' },
    { id: '2', username: '@UNNATI', image: '/images/unnati.png', border: 'border-[#006946]' },
    { id: '3', username: '@URANSH', image: '/images/uransh.png', border: 'border-[#29664c]' },
    { id: '4', username: '@RUDRAKSH', image: '/images/rudraksh.png', border: 'border-[#006946]' },
];

const projects = [
    {
        id: 'new-pista',
        title: 'DIY BOTTLE PAINTING',
        author: '@RUDRAKSH',
        authorImage: 'https://ui-avatars.com/api/?name=Rudraksh&background=random',
        image: '/videos/thumb-pista.png',
        time: 'Just now',
        videoId: 'pista-tulip',
        videoSrc: '/videos/pista-shell-tulip.mp4'
    },
    {
        id: '4',
        title: 'CARDBOARD BANGLE BOX',
        author: '@RUDRAKSH',
        authorImage: 'https://ui-avatars.com/api/?name=Rudraksh&background=random',
        image: '/videos/thumb-2.png',
        time: '#Tulip',
        videoId: 'DTc9Um6EUJO',
        videoSrc: '/videos/tutorial-2.mp4'
    },
    {
        id: '2',
        title: 'PAPER STRIP LAMP',
        author: '@URANSH',
        authorImage: '/images/uransh.png',
        image: '/videos/thumb-2.png',
        time: '2h ago',
        videoId: 'DLwADuaRPq4',
        videoSrc: '/videos/tutorial-2.mp4'
    },
    {
        id: '3',
        title: 'PLASTIC CAP MOSAIC',
        author: '@RUDRAKSH',
        authorImage: '/images/rudraksh.png',
        image: '/videos/thumb-1.png',
        time: '#Plastic',
        videoId: 'DSxN0sOgRNd',
        videoSrc: '/videos/tutorial-1.mp4'
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

import { PageHeader } from '@/components/ui/PageHeader';

export default function CommunityPage() {
    const [selectedVideo, setSelectedVideo] = useState<{ videoId?: string; videoSrc?: string } | null>(null);

    return (
        <div className="min-h-screen bg-[#f1f8f6] text-[#29302f] pb-32">
            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoId={selectedVideo?.videoId}
                videoSrc={selectedVideo?.videoSrc}
            />

            {/* Header */}
            <PageHeader title="COMMUNITY" />

            <main className="px-6 pt-6 space-y-10">
                {/* Hero: Scan to DIY */}
                <Link href="/scanner">
                    <section className="relative overflow-hidden rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-[0_40px_64px_-10px_rgba(41,48,47,0.12)] bg-[#29664c] cursor-pointer active:scale-[0.98] transition-transform">
                        <div className="z-10 space-y-4 text-center md:text-left">
                            <div>
                                <h2 className="text-4xl font-extrabold tracking-tighter uppercase text-white">SCAN TO DIY!</h2>
                                <p className="font-medium text-lg text-white/90">Get instant upcycling ideas for your waste.</p>
                            </div>
                            <button className="bg-[#b9f9d6] text-[#246147] px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto md:mx-0 active:scale-95 transition-transform">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                                SCAN NOW
                            </button>
                        </div>
                    </section>
                </Link>

                {/* Trending Creators */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#29302f]/60">Trending Creators</h3>
                        <span className="text-[#29664c] font-bold text-sm cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {trendingCreators.map((creator) => (
                            <div key={creator.id} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
                                <div className={`w-20 h-20 rounded-full p-1 border-2 ${creator.border} group-hover:scale-105 transition-transform`}>
                                    <img
                                        src={creator.image}
                                        alt={creator.username}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{creator.username}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Fresh Projects Grid */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#29302f]/60">Fresh Projects</h3>
                        <Link href="/tutorials" className="text-[#29664c] font-bold text-sm hover:underline">View All</Link>
                    </div>
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {projects.map((project) => (
                            <motion.article
                                key={project.id}
                                variants={itemVariants}
                                className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm group cursor-pointer"
                                onClick={() => {
                                    if (project.videoSrc || project.videoId) {
                                        setSelectedVideo({ videoId: project.videoId, videoSrc: project.videoSrc });
                                    }
                                }}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter text-[#29664c]">
                                        {project.time}
                                    </span>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-sm leading-tight">{project.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={project.authorImage}
                                                alt={project.author}
                                                className="w-5 h-5 rounded-full object-cover"
                                            />
                                            <span className="text-[10px] font-bold text-[#29302f]/70">{project.author}</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full bg-[#e1eae8] py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#29664c] active:bg-[#b9f9d6] transition-colors">
                                        <span className="material-symbols-outlined text-sm">play_circle</span>
                                        View Tutorial
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
