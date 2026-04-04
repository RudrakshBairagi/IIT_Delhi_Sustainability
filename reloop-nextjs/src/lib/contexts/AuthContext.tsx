'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { auth } from '@/lib/firebase/client';
import { DBService } from '@/lib/firebase/db';
import { onAuthStateChanged } from 'firebase/auth';
import DemoManager from '@/lib/demo-manager';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isDemo: boolean;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    refreshUser: () => void;
    enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isDemo: false,
    logout: () => { },
    updateProfile: async () => { },
    refreshUser: () => { },
    enableDemoMode: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    // Function to refresh user data (for admin updates)
    const refreshUser = useCallback(() => {
        if (isDemo) {
            // Re-read from DemoManager
            setUser({ ...DemoManager.getMockUser() });
        }
    }, [isDemo]);

    const enableDemoMode = useCallback(() => {
        localStorage.setItem('isDemoMode', 'true');
        setIsDemo(true);
        setUser({ ...DemoManager.getMockUser() });
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Real Firebase user
                setIsDemo(false);
                localStorage.removeItem('isDemoMode');
                try {
                    const profile = await DBService.getUserProfile(firebaseUser.uid);
                    if (profile) {
                        setUser(profile);
                    } else {
                        // Fallback if firestore doc missing
                        setUser({
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            avatar: firebaseUser.photoURL || '',
                            level: 1,
                            coins: 0,
                            xp: 0,
                            levelTitle: 'Seedling',
                            itemsTraded: 0,
                            co2Saved: 0,
                            badges: []
                        });
                    }
                } catch (e) {
                    console.error("Error fetching user profile", e);
                }
            } else {
                // No Firebase user - check if we should be in demo mode
                const storedDemo = localStorage.getItem('isDemoMode');
                if (storedDemo === 'true') {
                    setIsDemo(true);
                    setUser({ ...DemoManager.getMockUser() });
                } else {
                    setIsDemo(false);
                    setUser(null);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Subscribe to DemoManager updates for real-time sync
    useEffect(() => {
        if (!isDemo) return;

        console.log('[AuthContext] Subscribing to DemoManager updates');

        // Subscribe to DemoManager changes
        const unsubscribe = DemoManager.subscribe((updatedUser) => {
            console.log('[AuthContext] Received update from DemoManager:', updatedUser.name);
            setUser({ ...updatedUser });
        });

        return () => {
            console.log('[AuthContext] Unsubscribing from DemoManager');
            unsubscribe();
        };
    }, [isDemo]);

    const logout = async () => {
        if (isDemo) {
            // Logout from demo mode
            localStorage.removeItem('isDemoMode');
            setIsDemo(false);
            setUser(null);
            DemoManager.resetAll();
        } else {
            await auth.signOut();
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;

        if (isDemo) {
            // Update DemoManager
            DemoManager.adminUpdateUser(data);
            // User will be updated via subscription
        } else {
            try {
                // Merge update into Firestore
                await DBService.createUserProfile({ ...user, ...data });
                // Update local state
                setUser(prev => prev ? { ...prev, ...data } : null);
            } catch (e) {
                console.error("Error updating profile", e);
                throw e;
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isDemo, logout, updateProfile, refreshUser, enableDemoMode }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
