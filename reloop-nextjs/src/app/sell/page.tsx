'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { DBService } from '@/lib/firebase/db';
import { StorageService } from '@/lib/firebase/storage';
import Image from 'next/image';

const CATEGORIES = [
    { id: 'electronics', label: 'Electronics', icon: 'devices' },
    { id: 'furniture', label: 'Furniture', icon: 'chair' },
    { id: 'clothing', label: 'Clothing', icon: 'apparel' },
    { id: 'books', label: 'Books', icon: 'menu_book' },
    { id: 'sports', label: 'Sports', icon: 'sports_soccer' },
    { id: 'other', label: 'Other', icon: 'more_horiz' },
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function SellPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        condition: '',
        price: '',
        location: '',
        images: [] as File[]
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Auth Guard
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login?redirect=/sell');
        }
    }, [isLoading, user, router]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));

            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!user) return;
        if (!formData.title || !formData.price || !formData.category) return;

        setIsSubmitting(true);
        try {
            // Validate Logic (Simple)
            if (formData.title.length < 5) {
                alert("Title must be at least 5 characters");
                setIsSubmitting(false);
                return;
            }

            // 1. Create Listing Doc first to get ID (or let DBService handle it)
            // Ideally we create a draft or get an ID, but for simplicity:
            // Upload images first? No, we need an ID for the path usually.
            // Let's create the listing with empty images first to get ID, then update.
            // OR simple path: `listings/${Date.now()}_${file.name}`

            // let's use a simpler path strategy for now to avoid 2-step write
            const tempId = `${Date.now()}-${user.uid.slice(0, 5)}`;

            // Upload Images
            let imageUrls: string[] = [];
            if (formData.images.length > 0) {
                imageUrls = await StorageService.uploadListingImages(formData.images, tempId);
            }

            // Create Listing in Firestore
            await DBService.createListing({
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                condition: formData.condition || 'Good',
                category: formData.category,
                location: formData.location || 'Campus',
                images: imageUrls,
                status: 'available',
                seller: {
                    id: user.uid,
                    name: user.name,
                    avatar: user.avatar,
                    itemsTraded: user.itemsTraded || 0,
                    co2Saved: user.co2Saved || 0,
                    responseTime: '1 hour' // Default for now
                }
            });

            router.push('/marketplace');
        } catch (error) {
            console.error("Failed to create listing", error);
            alert("Failed to create listing. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => step === 1 ? router.back() : handleBack()} className="p-2 -ml-2">
                    <span className="material-symbols-outlined text-dark dark:text-white">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-dark dark:text-white">
                        {step === 1 ? 'Select Category' :
                            step === 2 ? 'Item Details' :
                                step === 3 ? 'Upload Photos' : 'Set Price'}
                    </h1>
                    <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto">
                {/* Step 1: Category */}
                {step === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, category: cat.id }));
                                    handleNext();
                                }}
                                className="p-6 bg-white dark:bg-dark-surface rounded-2xl border-2 border-transparent hover:border-primary shadow-sm flex flex-col items-center gap-3 transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                </div>
                                <span className="font-bold text-dark dark:text-white">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                placeholder="What are you selling?"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Condition</label>
                            <div className="flex flex-wrap gap-2">
                                {CONDITIONS.map(cond => (
                                    <button
                                        key={cond}
                                        onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${formData.condition === cond
                                            ? 'bg-primary border-primary text-white'
                                            : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}
                                    >
                                        {cond}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea
                                rows={5}
                                placeholder="Describe your item..."
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface focus:border-primary outline-none transition-colors resize-none"
                            />
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={!formData.title || !formData.condition}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-brutal active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 3: Photos */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="aspect-square relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                    <Image src={src} alt="Preview" fill className="object-cover" />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md active:scale-90"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl text-gray-400">add_a_photo</span>
                                <span className="text-sm font-bold text-gray-500">Add Photo</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-brutal active:scale-95 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 4: Price & Finish */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (ReCoins)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">RC</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface focus:border-primary outline-none transition-colors text-2xl font-bold"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                placeholder="Where can buyers pickup?"
                                value={formData.location}
                                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface focus:border-primary outline-none transition-colors"
                            />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 text-blue-600 dark:text-blue-400 text-sm">
                            <span className="material-symbols-outlined">info</span>
                            <p>Listing will be reviewed by our AI safety system before appearing in the marketplace.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.price || isSubmitting}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-brutal active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Post Listing'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
