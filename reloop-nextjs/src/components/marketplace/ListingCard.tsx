'use client';

import Link from 'next/link';
import { Listing } from '@/types';

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link href={`/marketplace/${listing.id}`} className="block h-full">
            <div className="bg-white dark:bg-dark-surface rounded-2xl border-2 border-dark dark:border-gray-700 shadow-brutal-sm overflow-hidden hover:-translate-y-1 hover:shadow-brutal transition-all duration-300 h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-square bg-gray-100 dark:bg-dark-bg relative overflow-hidden">
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />

                    {/* Price Badge */}
                    <span className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-lg text-xs font-black text-dark dark:text-white flex items-center gap-1 border-2 border-dark dark:border-gray-600 shadow-sm">
                        🪙 {listing.price}
                    </span>

                    {/* Impact Badge */}
                    {listing.isTopImpact && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-primary text-dark rounded-lg text-xs font-bold flex items-center gap-1 border-2 border-dark shadow-sm">
                            <span className="material-symbols-outlined material-symbols-filled text-[14px]">eco</span>
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-dark dark:text-white truncate" title={listing.title}>
                        {listing.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 mb-2">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            {listing.category}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">
                            {listing.condition}
                        </span>
                    </div>

                    <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 shrink-0">
                            <img
                                src={listing.seller.avatar}
                                alt={listing.seller.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {listing.seller.name}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
