'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ScannerService from '@/lib/scanner-service';
import { ScanResult } from '@/types';

export default function ReuseIdeasPage() {
    const router = useRouter();
    const [result, setResult] = useState<ScanResult | null>(null);
    const [activeTab, setActiveTab] = useState<'videos' | 'pins'>('videos');

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
            <div className="min-h-screen bg-[#f1f8f6] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#29664c] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { item } = result;

    const dummyVideos = [
        {
            title: 'How To Make A Shower Pouf From An Old Towel',
            author: 'EcoCrafter',
            duration: '12:45',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCMepOhj-7gO614m0ovfW9ye2SwEXOPNcl3t4cj30MXSaoTsJ0pTQed0QHbxFgNoPyjYipmuKdwU2MN0E4NQrK1wQ82AdHdooPukUHnvUGIRXcPcocpSZ7ZA92QDLX9nt6EY_k67A7e-FYYYN7kJSpxiQAWIMtKMSQkiNgDqTZFtT-LyPUX6uzLQi071yO3nUrUf33EoxQ5t69iRmgrCaBbfesA5vawVtYDw3SPlvTcFXNgAA13nlmxkuPsM37PRQunQrIKwR0O9A'
        },
        {
            title: 'DIY Recycled Towel Bathmat',
            author: 'SustainableLiving',
            duration: '08:20',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZlkee_rOqPhevKo_auP8Y7OwWG0MznsI5HFvKAeVg7Eu6VMTodOpAIrG18Gh7GZT05Br18AOVWGFdrx6WpDPYBtKHSsuxd5L_QdwkVvp0LWWeqIIvWPscWSyE-xSjUhyHys5CIZa8mMJc48EGueHkfimbvsMBZd_UlxtvpsV9MymAu3fG2V1w23HiFWMAvnUV9vFX4s3kjMASFf4dhIruQD_0kNhPYrJqowcLYA4MxcthztdqxeCOPXC8-FPID4BBPO_C42Oxe4U'
        },
        {
            title: 'Mini Towel Tote Bag Tutorial',
            author: 'UpcycleStudio',
            duration: '05:15',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEYu6F-CRpPYlyQXJbGImJjwurygjox46LorKjs0ap_sUKQahOxEUQQK8sHRvjmu_DLk_4EsvJLizKcenKcogM6xApIC5ivPCVF_RsMf6uxkrxRfkeKPO_PtdzvBZLXO3H347Dx7o_kLNe1K-o8fmso-qwIzNbQhviobZRdx80Q0Pf99GvvxKA0PTKPzQx2gwuDkX7wpYmbDojnpiBn6n4W_2LH2YY3kWhtBYvHPNTtqEdupk7DaFPeGRD3Fx-S4eoqpZx_29CyHc'
        },
        {
            title: '#upcycle of my old towel to #mat',
            author: 'ReUseIt',
            duration: '15:30',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANSBoeZoUfJcOP9vLYFPCIq91qrdrRT8JDKI2rHE4Lsod_0jB59LRNpCxc9PhrRB567zEopvovNhCxquyz5oxQeTcCu-lOb_Y6XA0FVzIGa69YhYZASeG-xDtM0PoyXy66aVnNC5gfzdRYd0sNAZZhwT2sCJdL56mV4IXLKUhTG3jURoDRQKdxrv0RfiqSTIFCOfPuqh87a0tf1ckGPdSKVC_PEX1Wy1cDIccbiRUgKVkjLuP3Babjc5v5WfJfj5y-BkcoiuWwEA4'
        }
    ];

    return (
        <div className="bg-[#f1f8f6] font-body text-[#29302f] antialiased min-h-screen pb-32">
            {/* TopAppBar */}
            <header className="flex items-center justify-between px-6 py-4 w-full fixed top-0 z-50 bg-[#f1f8f6]/80 backdrop-blur-3xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]">
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
                <div className="text-2xl font-extrabold text-[#29664c] tracking-tighter uppercase line-clamp-1 truncate max-w-[100px]">RELOOP</div>
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
                    className="bg-[#ffffff] rounded-xl p-6 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] border border-white/20"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-[#b9f9d6] p-3 rounded-full text-[#246147]">
                            <span className="material-symbols-outlined text-2xl">help_outline</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight text-[#29302f]">Can't do DIY?</h2>
                            <p className="text-[#565d5c] text-sm mt-1 leading-relaxed">
                                Don't let your old {item.objectName.toLowerCase()}s go to waste. Trade them for credits or learn from our community experts.
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

                {/* Project Grid */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <h3 className="text-sm font-label font-extrabold tracking-widest uppercase text-[#565d5c] px-1">Top Community Tutorials</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {dummyVideos.map((video, idx) => (
                            <div key={idx} className="bg-[#ffffff] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-pointer" onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item.objectName + ' upcycle')}`, '_blank')}>
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={video.img} 
                                        alt={video.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                                            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                        {video.duration}
                                    </div>
                                </div>
                                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                                    <h4 className="font-extrabold text-[#29302f] leading-tight text-xs line-clamp-2">{video.title}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[9px] text-[#565d5c] font-medium truncate">{video.author}</span>
                                        <span className="material-symbols-outlined text-[#29664c] text-base cursor-pointer hover:scale-110 transition-transform">favorite</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
