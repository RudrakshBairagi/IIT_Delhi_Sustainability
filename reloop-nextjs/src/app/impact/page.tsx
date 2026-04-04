'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ImpactPage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background pb-24">
            <PageHeader title="Your Impact" backHref="/profile" />

            <div className="px-5 space-y-4">
                {/* Hero Stats */}
                <div className="bg-card-green rounded-2xl border-2 border-dark shadow-brutal p-6 text-center">
                    <h1 className="text-5xl font-black text-dark mb-2">{user.co2Saved}</h1>
                    <p className="text-sm font-bold text-dark/60 uppercase tracking-wider">kg CO₂ Saved</p>
                </div>

                {/* Gamification Hub */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card-yellow rounded-xl border-2 border-dark shadow-brutal-sm p-4 text-center cursor-pointer hover:-translate-y-1 transition-transform">
                        <span className="text-3xl mb-1 block">🏆</span>
                        <h3 className="font-bold text-dark">Leaderboard</h3>
                        <p className="text-[10px] uppercase font-bold text-dark/60">Rank #42</p>
                    </div>
                    <div className="bg-card-pink rounded-xl border-2 border-dark shadow-brutal-sm p-4 text-center cursor-pointer hover:-translate-y-1 transition-transform">
                        <span className="text-3xl mb-1 block">🎁</span>
                        <h3 className="font-bold text-dark">Eco Wrapped</h3>
                        <p className="text-[10px] uppercase font-bold text-dark/60">Your 2024</p>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white dark:bg-dark-surface rounded-xl border-2 border-dark shadow-brutal-sm p-5">
                    <h3 className="font-exrabold text-dark dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">military_tech</span>
                        Recent Achievements
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-xl">
                                🌿
                            </div>
                            <div>
                                <p className="text-sm font-bold text-dark dark:text-white">Eco Warrior</p>
                                <p className="text-xs text-gray-500">Saved 10kg CO2</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xl">
                                🔒
                            </div>
                            <div>
                                <p className="text-sm font-bold text-dark dark:text-white">Super Trader</p>
                                <p className="text-xs text-gray-500">Trade 5 items (3/5)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="bg-card-blue/20 rounded-xl border-2 border-dark shadow-brutal-sm p-5">
                    <p className="text-dark dark:text-white font-medium leading-relaxed text-sm">
                        Every trade on ReLoop helps reduce waste and carbon emissions. You're making a real difference!
                        <br /><br />
                        Keep trading to level up your impact score and unlock the "Eco Warrior" badge.
                    </p>
                </div>

                {/* CTA */}
                <div className="pt-4">
                    <div className="bg-card-blue rounded-xl border-2 border-dark shadow-brutal-sm p-5 flex items-center gap-4">
                        <span className="text-3xl">🌿</span>
                        <div>
                            <h3 className="font-bold text-dark text-lg">Did you know?</h3>
                            <p className="text-xs text-dark/70 font-medium">1kg of CO₂ is equivalent to driving a car for ~4km.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
