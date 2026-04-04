'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/lib/firebase/auth';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { enableDemoMode } = useAuth();
    const redirectUrl = searchParams ? searchParams.get('redirect') || '/' : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push(redirectUrl);
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await AuthService.signInWithGoogle();
            router.push(redirectUrl);
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
                    <h1 className="text-3xl font-[900] text-dark dark:text-white mb-2">Welcome Back!</h1>
                    <p className="text-gray-500 dark:text-gray-400">Log in to continue trading sustainably.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold border-l-4 border-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-brutal active:scale-95 disabled:opacity-50 transition-all"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
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
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-bold text-primary hover:underline">
                        Sign Up
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <button
                        onClick={() => {
                            enableDemoMode();
                            router.push('/');
                        }}
                        className="text-sm font-bold text-gray-400 hover:text-dark dark:hover:text-white transition-colors"
                    >
                        Need to test? Try Demo Mode 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}

function LoginLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginContent />
        </Suspense>
    );
}
