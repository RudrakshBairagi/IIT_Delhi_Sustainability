'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

export default function ImpactPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-sky-100 to-white text-[#111714] font-sans">
            {/* Header */}
            <header className="flex flex-col gap-1 p-4 pt-8 pb-2 shrink-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/" className="flex size-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-brutal active:translate-y-[2px] active:shadow-none transition-all">
                        <span className="material-symbols-outlined text-black">arrow_back</span>
                    </Link>
                    <button className="flex size-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-brutal active:translate-y-[2px] active:shadow-none transition-all">
                        <span className="material-symbols-outlined text-black">info</span>
                    </button>
                </div>
                <h1 className="text-black text-[40px] leading-[1.1] font-extrabold tracking-tight uppercase">Global<br />Ranking</h1>
                <p className="text-[#111714]/80 text-lg font-bold mt-1">Which campus is the greenest?</p>
            </header>

            {/* Main Scrollable Area */}
            <motion.div
                className="flex-1 overflow-y-auto no-scrollbar pb-32"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Podium Section */}
                <div className="w-full px-4 pt-6 pb-8">
                    <div className="flex justify-center items-end gap-2 w-full max-w-md mx-auto h-[260px]">
                        {/* 2nd Place (Left) */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 z-10">
                            <div className="relative mb-2 group">
                                <div className="w-16 h-16 rounded-full border-2 border-black bg-white overflow-hidden shadow-brutal z-10 relative">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnKD4FFmX2fAjhRWkUhZxYT5R40r1l3lg-bTx7daZQ6lP2yciZwIEKhABRG4-iTnEF5H5XrLILS0gMjdY8ODAqtxPqI1ITMRIqk33BGknNWXIVjCZ4jydZ7sVvBBODggOgg5JHldRK7OIBN9DKU9w7fMHqsoWpWkNd8h6LInX6sYoZPVX_vQYv9WKBCTdY5FVRBs9Z5CW8XpNc7NvMUVuC9oJXbdCJNbz66VgDtGLIDZd8xsK2awbgi6Q2enDBjLwgXiTSCtCEFac')" }}></div>
                                </div>
                                <div className="absolute -top-3 -right-2 bg-[#C0C0C0] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#2</div>
                            </div>
                            <div className="text-center mb-1">
                                <p className="font-bold text-sm leading-tight text-dark">Stanford</p>
                                <p className="text-xs font-semibold text-emerald-700">42k Saved</p>
                            </div>
                            <div className="w-full h-[80px] bg-[#C0C0C0] border-2 border-black rounded-t-xl shadow-brutal flex items-end justify-center pb-2 relative overflow-hidden">
                                <div className="opacity-20 absolute inset-0 bg-white"></div>
                                <span className="text-2xl font-black opacity-30 text-black">2</span>
                            </div>
                        </motion.div>

                        {/* 1st Place (Center) */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 z-20 -mx-2 mb-0">
                            <div className="relative mb-2">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</div>
                                <div className="w-20 h-20 rounded-full border-2 border-black bg-white overflow-hidden shadow-brutal z-10 relative ring-4 ring-yellow-400/30">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPbFPeeOnsX5pRibedk_mBKjwvbuyppJ4smMMyV9ISZ_BP9oP3RV4R-pXgKpQsPbJPB-dZxlgDTPKooPafW1rGm9lFIfs9Exx2aNesWvbKQ9joxQi-bChRXp_2DaYjjK2qqXoMW28JIFVSTjzhvfIl8Ix5JzQu4damhdUxPSYNOPcdJPHt-4r1gOhmDKG-oSW75FtsF3_1GUQRkOz6jR8H8WIVLqJg4-NJswALZ7N2YA3joBKxtxqsQW1Q0o_2TXxldn_vFJJNrqE')" }}></div>
                                </div>
                                <div className="absolute -top-3 -right-2 bg-[#FFD700] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#1</div>
                            </div>
                            <div className="text-center mb-1">
                                <p className="font-bold text-base leading-tight text-dark">Yale</p>
                                <p className="text-xs font-semibold text-emerald-700">50k Saved</p>
                            </div>
                            <div className="w-full h-[110px] bg-[#FFD700] border-2 border-black rounded-t-xl shadow-brutal-lg flex items-end justify-center pb-2 relative overflow-hidden">
                                <div className="opacity-20 absolute inset-0 bg-white"></div>
                                <span className="text-3xl font-black opacity-30 text-black">1</span>
                            </div>
                        </motion.div>

                        {/* 3rd Place (Right) */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 z-10">
                            <div className="relative mb-2">
                                <div className="w-16 h-16 rounded-full border-2 border-black bg-white overflow-hidden shadow-brutal z-10 relative">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFHOdgn1TXD1Wr70gwKxsWDpjJFdjvh4xIoRlGtdN85CFhRrbpDVYwGVfe0uSusIm6ubk0mZ4ar4tJTWv1Tbv9pbxRhTm_TxHW9NaQcIqaeWaWAq2JR_fjquRufwunY-NewaAeYVZDzpKKnHedqoBxxikOycDYheaHBWRvNtrS-weReF5pjJ1WdGA4QPG6PpXbPgooeM610YKtms3PHyYv6O2vkahNnDQXYSNKxv6Z945qC_va4GlVJvdI_Blk0XNXQgPNQ5NUgZ0')" }}></div>
                                </div>
                                <div className="absolute -top-3 -right-2 bg-[#CD7F32] text-black border-2 border-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm z-20">#3</div>
                            </div>
                            <div className="text-center mb-1">
                                <p className="font-bold text-sm leading-tight text-dark">Oxford</p>
                                <p className="text-xs font-semibold text-emerald-700">38k Saved</p>
                            </div>
                            <div className="w-full h-[60px] bg-[#CD7F32] border-2 border-black rounded-t-xl shadow-brutal flex items-end justify-center pb-2 relative overflow-hidden">
                                <div className="opacity-20 absolute inset-0 bg-white"></div>
                                <span className="text-2xl font-black opacity-30 text-black">3</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* List Section */}
                <div className="flex flex-col gap-4 px-4">
                    {/* List Item 4 */}
                    <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black bg-white p-3 shadow-brutal transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl font-bold text-black/40 w-8 text-center shrink-0">04</span>
                            <div className="size-12 rounded-full border border-black bg-gray-100 shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUS3Zdw3rKayx6uI2NnaFFyzx1O-v8zZpQF86EUqTqufKGxtcbA67wW8hWeTQ2faKBuSAgXSUuX8pFuCModOCxamcOFzUt-4jMEa09dwrFjfLKlKhLbERs_5yeQYxhchqcjrTw3vq9Txic5V4vsurFjymHM5M6eR9_sLKMWylEbw0DUj3JYXEht_YcWG5WmMS_dLkIdY7jABFTik0bBYNtkKshOJiZfx6SfDa34OwItzLpYl_VT3X65QuDnMYSKVg0dcAc1xZ-ksw')" }}></div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-base font-bold text-black truncate pr-2">UC Berkeley</p>
                                    <p className="text-xs font-bold text-black shrink-0">35k kg</p>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-gray-100 rounded-full border border-black overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '85%' }}></div>
                                    <div className="absolute top-0 right-0 h-full w-full opacity-10 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:4px_4px]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* List Item 5 */}
                    <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black bg-white p-3 shadow-brutal transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl font-bold text-black/40 w-8 text-center shrink-0">05</span>
                            <div className="size-12 rounded-full border border-black bg-gray-100 shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGXi5zq9cxu8jP6wKmYFlrfOHEOPdwYwgo2N8IEH98FQuCTAuFEkJ4BcTbCy4PHvNnbvfR1XsKaEipneURU4XMmbX9U9rlzSqXIXsXpPqk84utIMF4W-HISRNu4YwfOuu0hSHjuiHBtdpXKi4celSY257DNl9m5IJF6YUc1T9Sj14_Es-kmjeAPeTMNl7uY3kWCzk-fgLAt_M8WUjHfxYOVZi7SmqaMSBSqaJ9HBgSK_m0vs1mJEf6v75fEv2DQaNRc0b-YU3QAeY')" }}></div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-base font-bold text-black truncate pr-2">MIT</p>
                                    <p className="text-xs font-bold text-black shrink-0">31k kg</p>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full border border-black overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* List Item 6 */}
                    <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black bg-white p-3 shadow-brutal transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl font-bold text-black/40 w-8 text-center shrink-0">06</span>
                            <div className="size-12 rounded-full border border-black bg-gray-100 shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuChOHBP4fj5VOL1sLW8RJFz2U6RMZoA5soMn--VGdXYJWuPqya1bAiPaPC7WtImBRSsqcAVp5wNKcuj8eIF7_s8ZkMXcbu0HHRMeIMaJ1IxdcV7wmUJghk8jLACgpIV1xymZgIbCFEDBFxFqcMEVOtp4AvNsqvHhQQkEFiw8-z4HuuZDQjpV8lKBLHUdi_sHQspCKamKNDdhIub8Tk2UZrD8i6_iNwbmGpntwKQUCd4v5xLY3GcxrB3J8icCw1a5AWeugladExjLyQ')" }}></div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-base font-bold text-black truncate pr-2">USC</p>
                                    <p className="text-xs font-bold text-black shrink-0">28k kg</p>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full border border-black overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* List Item 7 */}
                    <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black bg-white p-3 shadow-brutal transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl font-bold text-black/40 w-8 text-center shrink-0">07</span>
                            <div className="size-12 rounded-full border border-black bg-gray-100 shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCS8JUixwvXLOJ1_hYGdLlq4oagt4PUwPY3I5G2SF4-LzhvfhUzFkAwsrgrNM-UZ7eUtAzVmRjpRKQZMx9ncHnLge0uJPtniUZwvAXUAgGamIvVzkQvDJUEdYR7zHlNfpHduXKjK-xvemj-7Dh2wgf-m0c97pKojfcVYedewBoRNR6yUWZPSy3aqT4dwl4Y4u2dKJ_lhHdVUSIOkVbhpzlvNlanuze8CvUpWRlfM9ybODq20sYupw-lO4fMDdBk9b9xcQ1UtWAmJ7o')" }}></div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-base font-bold text-black truncate pr-2">Cornell</p>
                                    <p className="text-xs font-bold text-black shrink-0">22k kg</p>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full border border-black overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* List Item 8 */}
                    <motion.div variants={itemVariants} className="group relative flex items-center justify-between gap-3 rounded-[24px] border-2 border-black bg-white p-3 shadow-brutal transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-xl font-bold text-black/40 w-8 text-center shrink-0">08</span>
                            <div className="size-12 rounded-full border border-black bg-gray-100 shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCOTE7-785ZoOznzNffDG3kOS1JHQhLvDxPdHMTA3mbsc8iwRRkx8HozN9_y2SzGsqMJkxy7JfaaNMphn7U83-HRmAi6sQziP4yIpydiVCy5-t_EohiNV_uCutyFHi55bWQTG-RVZxEUs4SCtbS-orzKzWbfaKJ0f9iq1x5qBc2ApnzNq-6FhWukykTxsPnC9m2N7736881gx4I8ek2iy5jKWZmuMDn9w84FeABkPV1q7eOrC1KDsTcw9mvW4eBk3EEb-XJ-eBceWU')" }}></div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-base font-bold text-black truncate pr-2">Northwestern</p>
                                    <p className="text-xs font-bold text-black shrink-0">19k kg</p>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full border border-black overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-[#4ce68a]" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Sticky User Footer */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-0 left-0 w-full p-4 z-50 mb-[5px]"
            >
                <div className="relative w-full rounded-[28px] border-2 border-black bg-[#10b981] p-4 shadow-brutal-lg overflow-hidden">
                    {/* Background pattern for texture */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                    <div className="relative flex items-center gap-3 z-10">
                        <div className="flex flex-col items-center justify-center bg-black rounded-xl h-12 w-12 shrink-0 border border-white/20">
                            <span className="text-white text-xs font-medium uppercase">Rank</span>
                            <span className="text-white text-lg font-bold leading-none">12</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                            <div className="flex justify-between items-center text-white">
                                <span className="font-bold text-base">Your Campus</span>
                                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">15,400 kg</span>
                            </div>
                            <div className="w-full h-4 bg-black/20 rounded-full border border-black/10 overflow-hidden">
                                <div className="h-full bg-white rounded-full relative" style={{ width: '35%' }}>
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:10px_10px]"></div>
                                </div>
                            </div>
                        </div>
                        <button className="bg-white text-black size-10 rounded-full border-2 border-black flex items-center justify-center shadow-sm shrink-0 active:scale-95 transition-transform">
                            <span className="material-symbols-outlined font-bold">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
