'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/firebase/auth';
import { DBService } from '@/lib/firebase/db';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update Auth Profile
            await updateProfile(result.user, {
                displayName: name,
                photoURL: `https://api.dicebear.com/7.x/micah/svg?seed=${name}` // Default avatar
            });

            // Create Firestore Profile
            await DBService.createUserProfile({
                uid: result.user.uid,
                name: name,
                email: email,
                avatar: result.user.photoURL || '',
                level: 1,
                coins: 100, // Sign up bonus
                xp: 0,
                levelTitle: 'Seedling',
                itemsTraded: 0,
                co2Saved: 0,
                badges: ['newcomer']
            });

            router.push('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email already registered');
            } else {
                setError('Failed to create account');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await AuthService.signInWithGoogle();
            router.push('/');
        } catch (err) {
            console.error(err);
            setError('Google sign in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-brutal p-8 border-2 border-dark dark:border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-[900] text-dark dark:text-white mb-2">Join ReLoop</h1>
                    <p className="text-gray-500 dark:text-gray-400">Start your sustainable trading journey.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary outline-none transition-colors"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary outline-none transition-colors"
                            placeholder="hello@reloop.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-brutal active:scale-95 disabled:opacity-50 transition-all"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-0.5 flex-1 bg-gray-100 dark:bg-gray-800" />
                    <span className="text-sm text-gray-400 font-bold">OR</span>
                    <div className="h-0.5 flex-1 bg-gray-100 dark:bg-gray-800" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors flex items-center justify-center gap-2"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Sign up with Google
                </button>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-primary hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
