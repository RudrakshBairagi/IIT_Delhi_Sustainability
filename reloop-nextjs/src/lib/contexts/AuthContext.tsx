'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
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
    isDemo: true,
    logout: () => { },
    updateProfile: async () => { },
    refreshUser: () => { },
    enableDemoMode: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(true);

    const refreshUser = useCallback(async () => {
        setUser({ ...DemoManager.getMockUser() });
    }, []);

    const enableDemoMode = useCallback(() => {
        setIsDemo(true);
        setUser({ ...DemoManager.getMockUser() });
    }, []);

    // Startup initialization
    useEffect(() => {
        setIsDemo(true);
        DemoManager.setMode(true);
        setUser({ ...DemoManager.getMockUser() });
        setIsLoading(false);
    }, []);

    // Subscribe to DemoManager updates for state synchronization
    useEffect(() => {
        const unsubscribe = DemoManager.subscribe((updatedUser) => {
            setUser({ ...updatedUser });
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        DemoManager.resetAll();
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) return;
        DemoManager.adminUpdateUser(data);
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
