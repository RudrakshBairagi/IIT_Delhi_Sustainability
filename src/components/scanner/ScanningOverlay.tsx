'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface ScanningOverlayProps {
    onCancel?: () => void;
    imageUrl?: string;
}

export const ScanningOverlay = ({ onCancel, imageUrl }: ScanningOverlayProps) => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // ~3s total

        return () => clearInterval(timer);
    }, []);

    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#fcf9f2] flex flex-col overflow-x-hidden font-body text-[#29302f]">
            <style jsx>{`
                .striped-progress {
                    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
                    background-size: 1rem 1rem;
                    animation: stripeMode 1s linear infinite;
                }
                @keyframes stripeMode {
                    0% { background-position: 1rem 0; }
                    100% { background-position: 0 0; }
                }
                .dotted-circle {
                    border: 2px dashed #29664c;
                    animation: rotate 20s linear infinite;
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Top Bar Component */}
            <header className="w-full sticky top-0 z-50 bg-[#fcf9f2]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]">
                <button 
                    onClick={handleBack}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#eaf2f0] hover:bg-[#dbe5e2] transition-colors text-[#29664c] active:scale-95"
                >
                    <span className="material-symbols-outlined whitespace-nowrap align-middle">arrow_back</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#29664c]/60">System Status</span>
                    <div className="px-4 py-1 bg-[#29302f] text-[#fcf9f2] rounded-full text-[11px] font-extrabold tracking-tighter border-2 border-[#29302f]">
                        ATOMIC ANALYSIS V2
                    </div>
                </div>
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#eaf2f0] hover:bg-[#dbe5e2] transition-colors text-[#29664c] active:scale-95">
                    <span className="material-symbols-outlined whitespace-nowrap align-middle">help</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center px-6 pt-8 pb-32 max-w-lg mx-auto w-full">
                {/* Headline */}
                <h1 className="font-headline font-extrabold text-4xl text-center tracking-tight leading-tight mb-12 text-[#29302f]">
                    JUST A MOMENT,<br/>
                    <span className="text-[#29664c] italic">I'M THINKING!</span>
                </h1>

                {/* Main Visual: Circular Portal */}
                <div className="relative w-72 h-72 flex items-center justify-center">
                    {/* Rotating Dotted Path */}
                    <div className="absolute inset-0 rounded-full dotted-circle opacity-30"></div>
                    
                    {/* Central Portal */}
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-[8px] border-[#29302f] shadow-2xl">
                        <img 
                            className="w-full h-full object-cover mix-blend-multiply contrast-125 brightness-110" 
                            src={imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQf3sIlOKPKNN3JFLxXhctciF-zFR7f3rK36ZJ9eUUlWMdZRPGByA-SiHQN3wTvSiQ7vjPdN6wJtSfReYoFcz4S0zE-zbqo8N-osVJBwFdulw98lQXmOYbqg4xnmvMC4a1KBTsfHIs32ih4LxVd9LCxEl7QscAG6yWgK4h6IWpnSyY3Soco4cC5AnASbAbzaBEyvguiMjTZdy--qbJQohzyVq4hvrzDWZBMQyj5esHfZ2HCqPlI_3c7kwXA1it7B69UuXBIDn2cM"} 
                            alt="Analyzing"
                        />
                        {/* Scanning Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#29664c]/20 to-[#29664c]/40"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#29664c] shadow-[0_0_15px_#29664c] animate-[bounce_3s_infinite]"></div>
                    </div>

                    {/* Analyzing Badge */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -top-4 -right-2 bg-[#29664c] text-[#c8ffe0] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform rotate-12 border-2 border-[#29302f]"
                    >
                        <span className="material-symbols-outlined text-sm animate-spin whitespace-nowrap align-middle">sync</span>
                        <span className="font-bold text-xs uppercase tracking-widest leading-none">ANALYZING...</span>
                    </motion.div>

                    {/* Pixels Tasted Counter */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute -bottom-2 -right-6 bg-[#ffffff] px-4 py-2 rounded-xl shadow-lg border-2 border-[#29302f] flex flex-col items-center"
                    >
                        <div className="text-[10px] font-bold uppercase text-[#29664c]/60 tracking-wider">Pixels Tasted</div>
                        <div className="text-xl font-extrabold text-[#29302f] leading-none">1,024</div>
                    </motion.div>

                    {/* Detected Pill */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 }}
                        className="absolute top-1/2 -left-12 -translate-y-1/2 bg-[#b9f9d6] text-[#29664c] px-4 py-2 rounded-full border-2 border-[#29302f] shadow-lg transform -rotate-90 flex items-center"
                    >
                        <span className="font-extrabold text-xs leading-none whitespace-nowrap">DETECTED 98% SOLID</span>
                    </motion.div>
                </div>

                {/* Tip Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 w-full bg-[#ffffff] p-6 rounded-xl border-2 border-[#29302f] shadow-[8px_8px_0px_#29302f] relative"
                >
                    <div className="absolute -top-5 left-6 bg-[#006946] text-[#c9ffdf] w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#29302f]">
                        <span className="material-symbols-outlined whitespace-nowrap align-middle">lightbulb</span>
                    </div>
                    <p className="font-medium text-[#29302f] leading-relaxed pt-2">
                        Did you know this item can save <span className="font-extrabold text-[#006946] underline decoration-2 underline-offset-4">5 fish?</span> 🐟
                    </p>
                </motion.div>
            </main>

            {/* Bottom Bar Component (Fixed Progress) */}
            <footer className="fixed bottom-0 left-0 w-full bg-[#fcf9f2] p-8 z-50">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-col">
                            <span className="font-label text-[10px] font-extrabold text-[#29664c] uppercase tracking-[0.2em]">Current Task</span>
                            <span className="font-extrabold text-lg text-[#29302f] tracking-tighter">SCANNING...</span>
                        </div>
                        <span className="font-extrabold text-[#29664c] text-xl transition-all duration-300">{progress}%</span>
                    </div>
                    {/* Neo-Brutalist Progress Bar */}
                    <div className="w-full h-8 bg-[#dbe5e2] rounded-full border-2 border-[#29302f] overflow-hidden p-1">
                        <motion.div 
                            className="h-full bg-[#29664c] rounded-full striped-progress relative text-transparent"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                        </motion.div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
