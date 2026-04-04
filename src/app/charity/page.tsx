'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import DemoManager from '@/lib/demo-manager';

export default function GiveBackPage() {
    const { user } = useAuth();
    const userCoins = user?.coins ?? 2450;

    const causes = [
        {
            title: 'Trees for Future',
            icon: 'park',
            color: 'bg-[#29664c]',
            textClass: 'text-[#29664c]',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPE63V8HmMuyWxhdPK1ykGoM7wRG9_jot7ImsOoY3siLjdnf7lR0Hz89qr5Ccn25tgfE99GUsnTmH7sSTF9RhVUmAmbw7kGOka0_tGTGxx0EGsmMNWQsOz3mmjWxzOj2Q8-qpUGBGnefav22gShNXzi1CaIYD6GOjXOBkbeS6eG6qSPMp1bMY-PIwr44zvT95JQRL_iHIgw9Y2i5wW2WZ1vF-kCR3TpJgxsmosLkBaUXyjelDqsazYLtQzrtXrmLt5FyOd6I8v4gE',
            desc: 'Reforesting the Amazon biome through community-led nurseries and land stewardship.',
            goalTotal: '500 Trees',
            goalCurrent: '342 Planted',
            progress: '68%',
            donors: '1.2k',
            min: '50',
            value: 'High'
        },
        {
            title: 'Ocean Cleanup',
            icon: 'waves',
            color: 'bg-[#006946]',
            textClass: 'text-[#006946]',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqQ7BtLRtrHSqpFB2g7smN_2jfz3gaJQm0ePLykJf2BRRYWzPfmScuQ9efhwmcrpQ_mQhMDIzb_pso9NOaR4PCI9tEYH4TQBtb61Hu4yzqAZGXFAOkhZPzch7mp2wvhJ5YRz0yyTolXzWSH484TWibYRrBzpvgh0Qj9P7Kb-pTQrR0tle4Sy-gBj5eBWozUsCPEzWSC1zzELVqP3m_PsLVUiJbKYgmg2di1Je_ehniWVDw4Sw5L-vIpjUXNNyUy7YdZiNtG90WYxI',
            desc: 'Deploying interception technology in rivers to prevent plastic from entering our oceans.',
            goalTotal: '2.5k KG',
            goalCurrent: '1.8k KG',
            progress: '72%',
            donors: '2.4k',
            min: '100',
            value: 'V. High'
        },
        {
            title: 'Local Food Bank',
            icon: 'ios',
            color: 'bg-[#3c6351]',
            textClass: 'text-[#3c6351]',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2-1t8V5j9_u_DC9LqFM72FT7nAxpf-DUrpMQViA1jtcaUxlPQrjOGOwQ5y5-IQpHxWPMT9wdo4HxYZwngMkVW3XSkjy7lXJZc_MeCb2Ini0QTwU9rACEogVZAiW308hilcq91lXZWf7iOcz2OPoq69uo2C71drXtqZJaoUITACj6uB2QiaoDHIH6LOiOKAsRGk0ScwIQXotRFG01uQ8tYaK0lqlpPbrOlepZRxhZbsUdt-YQGRwp5RQLZll5nB-jd5Q9dUsw1XPk',
            desc: 'Redirecting perfectly good surplus food from local businesses to families in need.',
            goalTotal: '10k Meals',
            goalCurrent: '4.2k Meals',
            progress: '42%',
            donors: '840',
            min: '25',
            value: 'Critical'
        }
    ];

    const donorsInfo = [
        { name: 'Marcus', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz5DYluYphU2reMaO1C3CRBQJ_NeIrQpCNSohTTwdXr8i069DpcQ8UEk0mHTNF7alR4FdzwBw3m6DL9XiCahF53YcQMWZzT1ou2-dCkM9iHO-CMJRbSbS2KBiMdbU_mh4QiT_Dnvo1XymLsDzok99GjraeWWxfwvMZMdOAGVRU3OWGohPCOKLeQPJ_Z3Oy4K6XfTCR6McSEaXjKYBMz1UX5rvDE69G3tLXBXdHj30WAqyMYzapgCJLqwY1WL2-zAF70unzNkuoq2s' },
        { name: 'Elena', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0xxcLRKZYKTNHAJCj8h1Vd6Dr8xbo0_ViWapOoI7blops1fIrZOPJ8VMzpR6Pao4sn44vdKmYB5PQMdJLiXP0Uoo4KZvEfuMk73NvnNOW9nzDKJLnA8HXE1jSnUbVYvjPBr_YeJ778bHo85kKv9sRmtJFQYD6pMGrLUi46Qs0l993khhCFOjXdDcwYg7SkMxrXpw2A5AEU2jXzMqREUL3Osal7j9w-ZnndpiKeiRi9YHQMhUk03ymeDN1sStDTE5S0xm3Ftqwb9M' },
        { name: 'Julian', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByrq3ohleMlxfh5nRoZ5YIgfII9tFNkSGnBnxdvu9ElMxLuH95aHhXDMM06G6RF1t6edArml82cV7Iv_a8T_motjeAzj-6YsSRtCnDP2cwFKlGfbOr8nJxhrygXGfgb9eZtLFL7xli6bzzKnyOlR0neFwshXHGhgoPfth_uRRpHkU1bp2wJPQuw6hevNavunk75Z9JDFjHAjk7LrnyAHufWfcTBCuomr-cR10fYUAq6rpwzGii7ToOq1HtaqwUhlzTnfLRZk8MdrU' },
        { name: 'Sarah', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3UV59x-_NmHpagin9kesP70B54zBL9c00JXzaOM3gZ9BZE31PkWw3IASilcmr4JWPiPy0dwL5LQ1Y_poXJpQQaahSu2snU6gmI_cDlLVym9xdcof-EZ9Xy3Jnz5oJq-eLg2TAF_k0no7ZYjJe0AjUzdQqrURu690iEe7Z6nE2O8bLZUlpJOYkathMWp2lDbsrFpesUZMHxWqxLo82OkI1Ho0Lq_OQ2cwnqxlbDuw0dz-Dg88m_aw7OU6X8HyJv8atOW6GmmNzrtc' },
        { name: 'David', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtpj9DZsg-l4uyIeK_PdazW8khNBC4z7wh6JmmQr5_thfC9YUqzrolT0pBbQovks9GWab_QSDVtPd4iR6CZ48cLJI6CeQ5yGpoUEi0MUcUzhlTVOWsmO168YSReTHNdvYjgE1RkiI1uOBPhZn2gltWtH73wfegt5dW5AjbBPbdFIC6brglB9J4tip225xo39A9Yqua8ZpOQx3NJlgPFm3mFWvaytLGBFAXm6fH4doOaonohPWA5naYyP0rgLsB5wbTjOF95Tdrm7s' }
    ];

    return (
        <div className="min-h-screen text-[#29302f] bg-[#f1f8f6] pb-32">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-xl shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)]" style={{ backgroundColor: 'rgba(241,248,246,0.8)' }}>
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-10 h-10 rounded-full overflow-hidden bg-[#d4dfdd] block active:scale-95 transition-transform">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNcJOvFUS0GWf5vbUdZjHLdDzC7HznpjR4IEIC6Umc2rwvLcN1127cSaUggCTjEl1k9RWeYz688zXytmn8rXhCIHEXRU4hnWXdYp6VkSjRdvf-jgy8kux75y5MH_BYULzHmVyaI4Wwrt5-4rrF-YzMTMnT4K42WpmXB_fwj1XcyYRUBXPFMGzfoDrD3-fEDiSINGeWQRhgQsJ4WrOyr4zPVGDtR-MCGUraEwTVRJmVSOuCKMZ5GLDH3fOHGzz3osMVWmlm_ZV1vLk" alt="Profile" />
                    </Link>
                    <span className="text-2xl font-black text-[#29664c] tracking-tighter uppercase">RELOOP</span>
                </div>
                <div className="bg-[#b9f9d6] px-4 py-2 rounded-full flex items-center gap-2 transition-transform active:scale-95 duration-150 cursor-pointer">
                    <span className="material-symbols-outlined text-[#246147] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#246147]">{userCoins} COINS</span>
                </div>
            </header>

            <main className="pt-24 px-6 max-w-2xl mx-auto">
                {/* Community Impact Header */}
                <section className="mb-10">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#29664c] mb-2 block">Global Ecosystem</label>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#29302f] leading-tight mb-4">Community Impact</h1>
                    <p className="text-[#565d5c] leading-relaxed opacity-80">Your sustainable actions fuel these global initiatives. Every coin earned from recycling is a seed for change.</p>
                </section>

                {/* Impact Grid (Bento Style) */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-2 p-8 rounded-xl flex flex-col justify-between min-h-[160px] text-[#c8ffe0] relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #29664c 0%, #1b5a40 100%)' }}
                    >
                        <div className="relative z-10">
                            <span className="material-symbols-outlined text-4xl mb-4 block">forest</span>
                            <h3 className="text-5xl font-extrabold tracking-tighter">12,482</h3>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mt-1">Trees Planted</p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-10">
                            <span className="material-symbols-outlined text-[160px]">park</span>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#eaf2f0] p-6 rounded-xl flex flex-col gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#92f7c3] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#005e3e]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold tracking-tight">8,920</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#565d5c]">Meals Given</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#eaf2f0] p-6 rounded-xl flex flex-col gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#d1fee5] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#3c6451]" style={{ fontVariationSettings: "'FILL' 1" }}>recycling</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold tracking-tight">5,204</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#565d5c]">KG Plastic</p>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Updates (Donors) */}
                <section className="mb-12">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-extrabold tracking-tight">Recent Donors</h2>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#29664c] cursor-pointer hover:underline">View Feed</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {donorsInfo.map((donor, idx) => (
                            <motion.div
                                key={donor.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full p-1 border-2 border-[#29664c] group-hover:scale-105 transition-transform">
                                    <img className="w-full h-full rounded-full object-cover" src={donor.img} alt={donor.name} />
                                </div>
                                <span className="text-[10px] font-bold uppercase">{donor.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Choose a Cause Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-6">Choose a Cause</h2>
                    <div className="space-y-6">
                        {causes.map((cause, idx) => (
                            <motion.div
                                key={cause.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                className="bg-[#ffffff] rounded-xl overflow-hidden shadow-[0_40px_64px_-10px_rgba(41,48,47,0.06)] group"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={cause.image} alt={cause.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#29302f]/40 to-transparent" />
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                        <div className={`w-10 h-10 ${cause.color} rounded-full flex items-center justify-center text-white shadow-sm`}>
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{cause.icon}</span>
                                        </div>
                                        <span className="text-white font-extrabold tracking-tight text-lg">{cause.title}</span>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <p className="text-[#565d5c] text-sm leading-relaxed mb-6">{cause.desc}</p>
                                    
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#565d5c]">Goal: {cause.goalTotal}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${cause.textClass}`}>{cause.goalCurrent}</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#e1eae8] rounded-full overflow-hidden">
                                            <div className={`h-full ${cause.color} rounded-full transition-all duration-1000`} style={{ width: cause.progress }} />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-[#e1eae8]">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[#565d5c] uppercase tracking-widest mb-1">Donors</p>
                                            <p className="font-extrabold">{cause.donors}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[#565d5c] uppercase tracking-widest mb-1">Min</p>
                                            <p className={`font-extrabold ${cause.textClass}`}>{cause.min}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[#565d5c] uppercase tracking-widest mb-1">Value</p>
                                            <p className="font-extrabold">{cause.value}</p>
                                        </div>
                                    </div>
                                    
                                    <button className={`w-full ${cause.color} text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] mt-4 shadow-sm hover:brightness-110`}>
                                        Donate Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
