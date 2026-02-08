"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type SubscriptionTier = 'BASIC' | 'PRO';

export interface UserProfile {
    id: string;
    email: string;
    subscription_tier: SubscriptionTier;
    stripe_customer_id?: string;
    created_at: string;
    is_admin?: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signInWithOtp: (email: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    updatePassword: (password: string) => Promise<{ data: { user: User | null }; error: AuthError | null }>;
    isPro: boolean;
    showAuthModal: boolean;
    authModalMode: 'signin' | 'signup' | 'update-password';
    isAuthProContext: boolean;
    triggerAuthModal: (mode?: 'signin' | 'signup' | 'update-password', isPro?: boolean) => void;
    closeAuthModal: () => void;
    authMethod: 'password' | 'google' | 'otp' | 'unknown';
    hasEmailPassword: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signIn: async () => ({ data: { user: null, session: null }, error: null }),
    signInWithGoogle: async () => ({ error: null }),
    signInWithOtp: async () => ({ error: null }),
    signOut: async () => { },
    updatePassword: async () => ({ data: { user: null }, error: null }),
    isPro: false,
    showAuthModal: false,
    authModalMode: 'signin',
    isAuthProContext: false,
    triggerAuthModal: () => { },
    closeAuthModal: () => { },
    authMethod: 'unknown',
    hasEmailPassword: false,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'update-password'>('signin');
    const [isAuthProContext, setIsAuthProContext] = useState(false);

    // Fetch user profile from database
    const fetchProfile = async (userObj: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userObj.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // Profile missing, create it automatically
                console.log('Profile missing, creating for:', userObj.email);
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: userObj.id,
                            email: userObj.email || '',
                            subscription_tier: 'PRO'
                        }
                    ])
                    .select()
                    .single();

                if (insertError) throw insertError;
                setProfile(newProfile);
                return;
            }

            if (error) throw error;

            // Auto-promotion: Upgrade BASIC to PRO automatically
            if (data && data.subscription_tier === 'BASIC') {
                console.log('Auto-promoting existing user to PRO');
                const { data: updatedProfile, error: updateError } = await supabase
                    .from('profiles')
                    .update({ subscription_tier: 'PRO' })
                    .eq('id', userObj.id)
                    .select()
                    .single();

                if (!updateError && updatedProfile) {
                    setProfile(updatedProfile);
                    return;
                }
            }

            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Task 1: Real-time Profile Subscription
    useEffect(() => {
        if (!user) return;

        const profileSubscription = supabase
            .channel(`profile:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('Profile updated in real-time:', payload.new);
                    setProfile(payload.new as UserProfile);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(profileSubscription);
        };
    }, [user]);

    const signUp = async (email: string, password: string) => {
        const response = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return response;
    };

    const signIn = async (email: string, password: string) => {
        const response = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return response;
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error };
    };

    const signInWithOtp = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                shouldCreateUser: true,
            },
        });
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const updatePassword = async (password: string) => {
        const response = await supabase.auth.updateUser({
            password
        });
        return response;
    };

    const triggerAuthModal = (mode: 'signin' | 'signup' | 'update-password' = 'signin', isPro: boolean = false) => {
        setAuthModalMode(mode);
        setIsAuthProContext(isPro);
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithOtp,
        signOut,
        updatePassword,
        isPro: profile?.subscription_tier === 'PRO',
        showAuthModal,
        authModalMode,
        triggerAuthModal,
        closeAuthModal,
        isAuthProContext,
        authMethod: (user?.app_metadata?.provider as any) || 'unknown',
        hasEmailPassword: !!user?.identities?.some(id => id.provider === 'email'),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
