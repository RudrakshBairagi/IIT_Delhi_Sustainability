'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ScannerService from '@/lib/scanner-service';
import { ScanResult } from '@/types';

interface Video {
    id: string;
    title: string;
    channel: string;
    views: string;
    thumbnail?: string;
}

interface Pin {
    id: string;
    title: string;
    image: string;
    saves: string;
    link?: string;
}

export default function ReuseIdeasPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [activeTab, setActiveTab] = useState<'videos' | 'pins'>('videos');
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [pins, setPins] = useState<Pin[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);
    const [isLoadingPins, setIsLoadingPins] = useState(false);

    useEffect(() => {
        const storedResult = ScannerService.getStoredResult();
        if (!storedResult) {
            router.push('/scanner');
            return;
        }
        setResult(storedResult);

        const query = storedResult.item.objectName + ' upcycle diy';

        // Fetch videos
        const fetchVideos = async () => {
            setIsLoadingVideos(true);
            try {
                const response = await fetch(`/api/youtube?query=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data.videos) {
                    setVideos(data.videos);
                }
            } catch (error) {
                console.error('Failed to fetch videos', error);
            } finally {
                setIsLoadingVideos(false);
            }
        };

        // Fetch pins
        const fetchPins = async () => {
            setIsLoadingPins(true);
            try {
                const response = await fetch(`/api/pins?query=${encodeURIComponent(storedResult.item.objectName)}`);
                const data = await response.json();
                if (data.pins) {
                    setPins(data.pins);
                }
            } catch (error) {
                console.error('Failed to fetch pins', error);
            } finally {
                setIsLoadingPins(false);
            }
        };

        fetchVideos();
        fetchPins();
    }, [router]);

    if (!result) {
        return (
            <div className="min-h-screen bg-[#f1f8f6] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { item } = result;

    return (
        <div className="bg-[#f1f8f6] font-body text-[#29302f] antialiased min-h-screen pb-32">
            {/* TopAppBar */}
            <header className="flex items-center justify-between px-6 py-4 w-full fixed top-0 z-50 bg-[#f1f8f6]/80 backdrop-blur-3xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] max-w-md left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-[#29664c] hover:opacity-80 transition-opacity active:scale-95 duration-200">
                        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>arrow_back</span>
                    </button>
                    <div className="flex flex-col">
                        <h1 className="font-headline text-lg font-extrabold tracking-tight text-[#29664c]">Reuse Ideas</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#29302f]/60 truncate max-w-[150px]">
                            For your {item.objectName}
                        </p>
                    </div>
                </div>
                <div className="text-2xl font-extrabold text-[#29664c] tracking-tighter uppercase">RELOOP</div>
            </header>

            <main className="pt-24 px-6 space-y-8 max-w-2xl mx-auto">
                {/* Toggle Buttons */}
                <div className="flex p-1.5 bg-[#eaf2f0] rounded-full w-full">
                    <button 
                        onClick={() => setActiveTab('videos')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold transition-all duration-300 ${activeTab === 'videos' ? 'bg-[#29664c] text-[#c8ffe0]' : 'text-[#565d5c] hover:bg-[#dbe5e2]'}`}
                    >
                        <span className="material-symbols-outlined text-xl">play_circle</span>
                        <span className="text-sm font-label tracking-widest uppercase">Videos</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('pins')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold transition-all duration-300 ${activeTab === 'pins' ? 'bg-[#29664c] text-[#c8ffe0]' : 'text-[#565d5c] hover:bg-[#dbe5e2]'}`}
                    >
                        <span className="material-symbols-outlined text-xl">keep</span>
                        <span className="text-sm font-label tracking-widest uppercase">Pins</span>
                    </button>
                </div>

                {/* Can't do DIY? Card */}
                <motion.section 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ffffff] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-white/20"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-[#b9f9d6] p-3 rounded-full text-[#246147]">
                            <span className="material-symbols-outlined text-2xl">help_outline</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight text-[#29302f]">Can&apos;t do DIY?</h2>
                            <p className="text-[#565d5c] text-sm mt-1 leading-relaxed">
                                Don&apos;t let your old {item.objectName.toLowerCase()}s go to waste. Trade them for credits or learn from our community experts.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => router.push(`/marketplace/create?mode=trade&item=${encodeURIComponent(item.objectName)}`)}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-[#eaf2f0] hover:bg-[#dbe5e2] transition-colors group"
                        >
                            <span className="material-symbols-outlined text-[#29664c] text-3xl group-hover:scale-110 transition-transform">currency_exchange</span>
                            <span className="text-xs font-label font-extrabold tracking-widest uppercase text-[#29302f]">Trade It</span>
                        </button>
                        <button 
                            onClick={() => router.push(`/community?search=${encodeURIComponent(item.objectName)}`)}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-[#eaf2f0] hover:bg-[#dbe5e2] transition-colors group"
                        >
                            <span className="material-symbols-outlined text-[#29664c] text-3xl group-hover:scale-110 transition-transform">school</span>
                            <span className="text-xs font-label font-extrabold tracking-widest uppercase text-[#29302f]">Get Help</span>
                        </button>
                    </div>
                </motion.section>

                {/* Content based on active tab */}
                {activeTab === 'videos' ? (
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        key="videos"
                        className="space-y-6"
                    >
                        <h3 className="text-sm font-label font-extrabold tracking-widest uppercase text-[#565d5c] px-1">Top Community Tutorials</h3>
                        
                        {isLoadingVideos ? (
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white/50 rounded-xl h-48 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {videos.map((video) => (
                                    <div 
                                        key={video.id} 
                                        className="bg-[#ffffff] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
                                    >
                                        <div 
                                            className="relative aspect-[4/3] overflow-hidden"
                                            onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                                        >
                                            {playingVideo === video.id ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                                    title={video.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <>
                                                    <img 
                                                        src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                                                            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                                            <h4 className="font-extrabold text-[#29302f] leading-tight text-xs line-clamp-2">{video.title}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[9px] text-[#565d5c] font-medium truncate">{video.channel} • {video.views}</span>
                                                <span className="material-symbols-outlined text-[#29664c] text-base cursor-pointer hover:scale-110 transition-transform">favorite</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Search More on YouTube */}
                        <button
                            onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item.objectName + ' upcycle DIY')}`, '_blank')}
                            className="w-full py-4 bg-[#29664c] text-[#c8ffe0] rounded-xl font-extrabold uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-sm hover:bg-[#1b5a40]"
                        >
                            ▶ More on YouTube
                        </button>
                    </motion.section>
                ) : (
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        key="pins"
                        className="space-y-6"
                    >
                        <h3 className="text-sm font-label font-extrabold tracking-widest uppercase text-[#565d5c] px-1">Pinterest Inspiration</h3>

                        {isLoadingPins ? (
                            <div className="columns-2 gap-4 space-y-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="break-inside-avoid bg-white/50 rounded-xl h-48 animate-pulse mb-4" />
                                ))}
                            </div>
                        ) : (
                            <div className="columns-2 gap-4 space-y-4">
                                {pins.map((pin) => (
                                    <div
                                        key={pin.id}
                                        className="break-inside-avoid bg-[#ffffff] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group mb-4"
                                        onClick={() => window.open(pin.link || `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(pin.title)}`, '_blank')}
                                    >
                                        <div className="overflow-hidden">
                                            <img src={pin.image} alt={pin.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ minHeight: '100px' }} />
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-extrabold text-[#29302f] text-xs leading-tight line-clamp-2">{pin.title}</h4>
                                            <p className="text-[10px] text-[#29664c] mt-1 font-bold">📌 {pin.saves} saves</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Search More on Pinterest */}
                        <button
                            onClick={() => window.open(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(item.objectName + ' upcycle DIY')}`, '_blank')}
                            className="w-full py-4 bg-[#29664c] text-[#c8ffe0] rounded-xl font-extrabold uppercase tracking-widest text-xs transition-all active:scale-[0.98] shadow-sm hover:bg-[#1b5a40]"
                        >
                            📌 More on Pinterest
                        </button>
                    </motion.section>
                )}
            </main>
        </div>
    );
}
