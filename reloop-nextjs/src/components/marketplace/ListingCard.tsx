'use client';

import Link from 'next/link';
import { Listing } from '@/types';

interface ListingCardProps {
    listing: Listing;
    isOwner?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function ListingCard({ listing, isOwner, onEdit, onDelete }: ListingCardProps) {
    // Format price as Indian Rupees
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link href={`/marketplace/${listing.id}`} className="block h-full">
            <div className="bg-white rounded-[2rem] border-[3px] border-[#111714] p-4 flex flex-col items-center relative shadow-brutal hover:-translate-y-1 hover:shadow-brutal-hover transition-all duration-300 h-full group">
                {/* Heart/Action Button */}
                <div className="absolute top-3 right-3 z-10 transition-opacity">
                    {isOwner ? (
                        <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
                            <button
                                onClick={() => onEdit?.(listing.id)}
                                className="bg-white/80 backdrop-blur-sm border-2 border-black rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg text-black">edit</span>
                            </button>
                            <button
                                onClick={() => onDelete?.(listing.id)}
                                className="bg-white/80 backdrop-blur-sm border-2 border-black rounded-full p-1.5 hover:bg-rose-100 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg text-rose-500">delete</span>
                            </button>
                        </div>
                    ) : (
                        <button className="bg-white/80 backdrop-blur-sm border-2 border-black rounded-full p-1.5 hover:bg-rose-100 transition-colors" onClick={(e) => e.preventDefault()}>
                            <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-rose-400 transition-colors">favorite</span>
                        </button>
                    )}
                </div>

                {/* New Badge */}
                {Date.now() - new Date(listing.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                    <div className="absolute top-0 left-0 bg-[#a7f3d0] text-[10px] font-black uppercase px-2 py-1 border-b-2 border-r-2 border-[#111714] rounded-br-xl z-20">New</div>
                )}

                {/* Image Container */}
                <div className="w-24 h-24 rounded-full border-[3px] border-[#111714] overflow-hidden mb-3 bg-gray-100 shrink-0">
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-center text-[#111714] leading-tight mb-2 line-clamp-2" title={listing.title}>
                    {listing.title}
                </h3>

                {/* Price Pill */}
                <div className="mt-auto bg-primary border-2 border-[#111714] rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                    <span className="font-black text-sm text-[#111714]">{formatPrice(listing.price)}</span>
                    <span className="text-xs">🪙</span>
                </div>
            </div>
        </Link>
    );
}

