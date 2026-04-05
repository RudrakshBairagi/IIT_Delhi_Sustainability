'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { BadgeRevealModal } from '@/components/ui/BadgeRevealModal';
import { useAuth } from '@/lib/contexts/AuthContext';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { formatRupeeValue } from '@/lib/eco-coins';

const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const BADGE_META: Record<string, { name: string; description: string; icon: string; color: string }> = {
    'early-adopter': { name: 'Early Adopter', description: 'Joined ReLoop in the early days!', icon: '🌟', color: '#4ce68a' },
    'eco-warrior': { name: 'Eco Warrior', description: 'Saved over 10kg of CO2', icon: '🌿', color: '#dcfce7' },
    'first-trade': { name: 'First Trade', description: 'Completed your first successful trade', icon: '🤝', color: '#fde047' },
    'streak-7': { name: 'On Fire', description: 'Logged in 7 days in a row', icon: '🔥', color: '#fb923c' }
};

export default function ProfilePage() {
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const [showBadgeReveal, setShowBadgeReveal] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [toast, setToast] = useState('');

    if (!user) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleSaveProfile = async (data: any) => {
        await updateProfile(data);
        setToast('Profile Updated!');
        setTimeout(() => setToast(''), 2000);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen pb-32 font-['Plus_Jakarta_Sans']">
            {/* TopAppBar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#f1f8f6]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="material-symbols-outlined text-[#29664c] hover:bg-[#eaf2f0] p-2 -ml-2 rounded-full transition-colors active:scale-95 duration-200"
                    >
                        arrow_back
                    </button>
                    <h1 className="font-extrabold tracking-tight text-xl text-[#29664c]">Impact Profile</h1>
                </div>
                <Link href="/settings" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer transition-transform hover:scale-105 active:scale-95">
                    <img alt={user.name} className="w-full h-full object-cover" src={user.avatar} />
                </Link>
            </header>

            <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
                {/* Header Card Section */}
                <motion.section 
                    initial="hidden" animate="visible" variants={itemVariants}
                    className="bg-surface-container-lowest rounded-lg p-8 shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] relative overflow-hidden border-2 border-primary/10" 
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")" }}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-6 items-center">
                            <div className="relative">
                                <div className="w-24 h-24 bg-primary-container border-4 border-primary rounded-lg flex items-center justify-center text-on-primary-container text-3xl font-black shadow-[8px_8px_0px_0px_rgba(41,97,71,0.2)]">
                                    {getInitials(user.name)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary text-white px-3 py-1 rounded-full text-xs font-black shadow-lg border-2 border-surface-container-lowest">
                                    LVL {user.level}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{user.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
                                    <span className="text-xs font-black text-primary uppercase tracking-[0.15em] bg-primary/10 px-2 py-0.5 rounded-full">{user.levelTitle}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-black uppercase tracking-widest text-on-surface">{500 - (user.xp % 500)} XP to Level {user.level + 1}</span>
                            <span className="text-xs font-black text-primary bg-primary-container px-2 py-0.5 rounded-full">{Math.round(((user.xp % 500) / 500) * 100)}%</span>
                        </div>
                        <div className="h-6 w-full bg-surface-container border-2 border-on-surface rounded-full overflow-hidden p-1">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(user.xp % 500) / 5}%` }}></div>
                        </div>
                    </div>
                </motion.section>

                {/* Statistics Grid */}
                <motion.section initial="hidden" animate="visible" variants={itemVariants} className="grid grid-cols-3 gap-4">
                    <Link href="/impact" className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center text-center transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                        <span className="text-xl font-extrabold text-primary">{user.co2Saved} kg</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">CO2 Saved</span>
                    </Link>
                    <Link href="/trade-history" className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center text-center transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                        <span className="text-xl font-extrabold text-primary">{user.itemsTraded}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Items</span>
                    </Link>
                    <Link href="/rewards" className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center text-center transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-primary">{user.coins}</span>
                            <span className="text-sm font-bold text-secondary-dim">{formatRupeeValue(user.coins)}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">Earned</span>
                    </Link>
                </motion.section>

                {/* Badges Section */}
                <motion.section initial="hidden" animate="visible" variants={itemVariants} className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Badges Earned</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {user.badges.map((badgeId) => {
                            const meta = BADGE_META[badgeId] || { name: badgeId, icon: '🏆', color: '#e5e7eb', description: 'Badge' };
                            return (
                                <button
                                    key={badgeId}
                                    onClick={() => { setSelectedBadge({ id: badgeId, ...meta }); setShowBadgeReveal(true); }}
                                    className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                    style={{ backgroundColor: meta.color }}
                                >
                                    <span className="text-3xl">{meta.icon}</span>
                                </button>
                            );
                        })}

                        {/* Locked Badges */}
                        <button
                            onClick={() => {
                                setSelectedBadge({
                                    name: "Locked Badge",
                                    description: "Keep trading and saving CO₂ to unlock this mystery badge! 🚀",
                                    icon: "🔒",
                                    color: "#f3f4f6"
                                });
                                setShowBadgeReveal(true);
                            }}
                            className="flex-shrink-0 w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center border-4 border-dashed border-outline-variant/30 hover:scale-105 transition-transform"
                        >
                            <span className="material-symbols-outlined text-outline-variant text-2xl">question_mark</span>
                        </button>
                        <button
                            onClick={() => {
                                setSelectedBadge({
                                    name: "Locked Badge",
                                    description: "Complete daily missions to reveal this badge!",
                                    icon: "🔒",
                                    color: "#f3f4f6"
                                });
                                setShowBadgeReveal(true);
                            }}
                            className="flex-shrink-0 w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center border-4 border-dashed border-outline-variant/30 hover:scale-105 transition-transform"
                        >
                            <span className="material-symbols-outlined text-outline-variant text-2xl">question_mark</span>
                        </button>
                    </div>
                </motion.section>

                {/* Quick Links */}
                <motion.section initial="hidden" animate="visible" variants={itemVariants} className="space-y-6">
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Quick Links</h3>
                    <div className="grid grid-cols-4 gap-6">
                        <Link href="/trade-history" className="flex flex-col items-center gap-3 group">
                            <button className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all active:scale-90">
                                <span className="material-symbols-outlined text-2xl">swap_horiz</span>
                            </button>
                            <span className="text-[10px] font-black tracking-widest uppercase text-on-surface text-center">Trades</span>
                        </Link>
                        <Link href="/messages" className="flex flex-col items-center gap-3 group">
                            <button className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all active:scale-90">
                                <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                            </button>
                            <span className="text-[10px] font-black tracking-widest uppercase text-on-surface text-center">Chat</span>
                        </Link>
                        <Link href="/rewards" className="flex flex-col items-center gap-3 group">
                            <button className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all active:scale-90">
                                <span className="material-symbols-outlined text-2xl">redeem</span>
                            </button>
                            <span className="text-[10px] font-black tracking-widest uppercase text-on-surface text-center">Rewards</span>
                        </Link>
                        <Link href="/impact" className="flex flex-col items-center gap-3 group">
                            <button className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all active:scale-90">
                                <span className="material-symbols-outlined text-2xl">monitoring</span>
                            </button>
                            <span className="text-[10px] font-black tracking-widest uppercase text-on-surface text-center">Impact</span>
                        </Link>
                    </div>
                </motion.section>

                {/* Action Buttons */}
                <motion.section initial="hidden" animate="visible" variants={itemVariants} className="flex gap-4 pt-4">
                    <button 
                        onClick={() => setShowEditModal(true)}
                        className="flex-1 bg-primary text-on-primary py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                        Edit Profile
                    </button>
                    <button 
                        onClick={() => {
                            const text = `I've saved ${user.co2Saved}kg CO₂ on ReLoop! 🌱`;
                            navigator.clipboard.writeText(text);
                            setToast('Copied!');
                            setTimeout(() => setToast(''), 2000);
                        }}
                        className="flex-1 bg-surface-container-highest text-on-surface py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-xl">share</span>
                        Share
                    </button>
                </motion.section>
            </main>

            {/* Modals and Toasts */}
            {selectedBadge && (
                <BadgeRevealModal
                    isOpen={showBadgeReveal}
                    onClose={() => setShowBadgeReveal(false)}
                    badge={selectedBadge}
                />
            )}

            <AnimatePresence>
                {showEditModal && (
                    <EditProfileModal
                        user={user}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleSaveProfile}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50 whitespace-nowrap"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
