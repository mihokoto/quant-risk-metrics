"use client";

import React, { useState, useEffect } from 'react';
import { PricingCard } from '@/components/pricing/PricingCard';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, TrendingUp, Shield, Zap, X, Crown, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
    const { user, isPro, triggerAuthModal } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSelectPlan = async (tier: 'basic' | 'pro') => {
        if (tier === 'basic') {
            router.push('/');
            return;
        }

        if (isPro) {
            router.push('/');
            return;
        }

        if (user) {
            // Logged in user: direct request
            await handleSubmitRequest(user.email || '');
        } else {
            // Guest: Show unified AuthModal in Pro context
            triggerAuthModal('signup', true);
        }
    };

    const handleSubmitRequest = async (targetEmail: string) => {
        if (!targetEmail) return;
        setRequestStatus('loading');
        setErrorMessage('');

        try {
            // Insert request into pro_requests table
            const { error: dbError } = await supabase
                .from('pro_requests')
                .insert([
                    {
                        email: targetEmail,
                        user_id: user?.id || null,
                        status: 'PENDING'
                    }
                ]);

            if (dbError) throw dbError;
            setRequestStatus('success');
        } catch (err: any) {
            console.error('Request error:', err);
            setErrorMessage(err.message || 'Failed to submit request');
            setRequestStatus('error');
        }
    };

    const basicFeatures = [
        { text: 'Up to 5,000 simulation paths', included: true },
        { text: 'Basic risk metrics dashboard', included: true },
        { text: 'Equity curve visualization', included: true },
        { text: 'Drawdown tracking', included: true },
        { text: 'High-precision simulations (50k paths)', included: false },
        { text: 'Institutional risk audit report', included: false },
        { text: 'Risk heatmap (100-cell matrix)', included: false },
        { text: 'PDF/Text export', included: false },
        { text: 'Priority support', included: false }
    ];

    const proFeatures = [
        { text: 'Ultra-high precision (50,000 paths)', included: true },
        { text: 'Institutional-grade dashboard', included: true },
        { text: 'Advanced equity projections', included: true },
        { text: 'Real-time drawdown alerts', included: true },
        { text: 'Technical Risk Audit Report', included: true },
        { text: 'Risk Heatmap (Death Zone Matrix)', included: true },
        { text: 'Full PDF & Text export', included: true },
        { text: 'Firm compliance scoring', included: true },
        { text: '24/7 priority support', included: true }
    ];

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                        animation: 'float 15s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/6 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
                        animation: 'float 20s ease-in-out infinite reverse'
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                        animation: 'float 12s ease-in-out infinite'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                {/* Hero Section */}
                <div className="text-center mb-20 space-y-6 animate-in-fade">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
                    >
                        ← Back to Terminal
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Pricing</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-outfit font-black text-white tracking-tighter">
                        Unlock <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 bg-clip-text text-transparent animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}>
                            Institutional
                        </span>
                        <br />
                        Analytics
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Join the next generation of institutional traders. Our advanced analytics terminal is in private beta. <span className="text-white font-bold underline decoration-amber-500 underline-offset-4">Request your Pro access</span> below to be manually approved.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                    <PricingCard
                        tier="basic"
                        name="Basic"
                        price={0}
                        period="forever"
                        description="Essential risk metrics for individual traders"
                        features={basicFeatures}
                        onSelect={() => handleSelectPlan('basic')}
                    />
                    <PricingCard
                        tier="pro"
                        name="Institutional Pro"
                        price={0}
                        period="forever"
                        description="Professional-grade analytics for elite traders (Approval Required)"
                        features={proFeatures}
                        popular={true}
                        buttonText={
                            isPro ? "Active Access" :
                                requestStatus === 'success' ? "Request Sent" :
                                    requestStatus === 'loading' ? "Sending..." :
                                        "Request Pro Access"
                        }
                        onSelect={() => handleSelectPlan('pro')}
                    />
                </div>

                {requestStatus === 'success' && (
                    <div className="max-w-xl mx-auto mb-20 animate-in-zoom">
                        <div className="glass p-8 rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Application Received</h3>
                            <p className="text-slate-400 text-sm">
                                {user
                                    ? "Your request for Pro access has been queued. Our team will manually review your profile and unlock your terminal within 24-48 hours."
                                    : "We've sent a verification link to your email. Please click the link to confirm your identity and complete your application review."
                                }
                            </p>
                            <Link href="/">
                                <Button variant="outline" className="mt-4 border-white/10 hover:bg-white/5">
                                    Return to Terminal
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Feature Highlights */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    <div className="glass p-6 rounded-2xl border border-white/10 animate-in-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Ultra-High Precision</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Pro tier runs 50,000 Monte Carlo paths for institutional-grade accuracy
                        </p>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/10 animate-in-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-slate-950" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Risk Audit Reports</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Technical compliance scoring and structural stability analysis
                        </p>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/10 animate-in-slide-up" style={{ animationDelay: '0.5s' }}>
                        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Risk Heatmap</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Visualize the "Death Zone" across 100 win-rate/risk combinations
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-outfit font-black text-white text-center mb-10">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Is it free during beta?',
                                a: 'Yes! During our private beta, Pro access is free for approved users. We are manually reviewing each request to build a high-quality community of traders.'
                            },
                            {
                                q: 'How long does approval take?',
                                a: 'We typically review applications within 24-48 hours. You will receive an email once your terminal has been upgraded to Pro.'
                            },
                            {
                                q: 'Do I need a credit card?',
                                a: 'No credit card is required to join the beta. Simply submit your email for manual review.'
                            },
                            {
                                q: 'Can I use basic features immediately?',
                                a: 'Absolutely. You can use all basic features immediately after creating a free account while waiting for Pro approval.'
                            }
                        ].map((faq, index) => (
                            <details
                                key={index}
                                className="glass p-6 rounded-xl border border-white/10 group cursor-pointer animate-in-slide-up"
                                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                            >
                                <summary className="font-bold text-white flex items-center justify-between cursor-pointer">
                                    {faq.q}
                                    <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>




            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(30px, -30px); }
                    66% { transform: translate(-20px, 20px); }
                }

                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .animate-gradient-flow {
                    animation: gradient-flow 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
