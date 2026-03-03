'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/services/auth-service';
import { LoginResponse } from '@/types/auth';

interface AuthContextType {
    user: any | null;       // 🔥 Poora user object (name, email, etc.)
    isLoggedIn: boolean;
    userRoles: string[];
    isLoading: boolean;
    login: (data: any) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Session Verification: Page load par backend se pucho "Main kaun hoon?"
    useEffect(() => {
        const verifySession = async () => {
            try {
                // Backend ka /auth/me endpoint hit karo 
                const userData = await authService.getCurrentUser();

                if (userData) {
                    setUser(userData);
                    setIsLoggedIn(true);
                    setUserRoles(userData.roles || []);
                }
            } catch (err) {
                // Agar token expired hai ya cookie nahi hai
                setIsLoggedIn(false);
                setUser(null);
                setUserRoles([]);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    // 2. Login function: Jab login success ho jaye
    const login = (userData: any) => {
        setUser(userData);
        setIsLoggedIn(true);
        setUserRoles(userData.roles || []);
    };

    const logout = async () => {
        setIsLoading(true); // Loading chalu karo taaki components re-render na hon bematlab
        try {
            await authService.logout();
        } catch (err) {
            console.error("Logout API failed, but clearing local state anyway", err);
        } finally {
            // 🧹 State saaf karo chahe API fail ho ya pass
            setUser(null);
            setIsLoggedIn(false);
            setUserRoles([]);
            setIsLoading(false);

            // Sab kuch clear karne ke baad hi redirect karo
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, userRoles, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};