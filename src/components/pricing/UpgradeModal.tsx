"use client";

import React, { useState } from 'react';
import { X, Mail, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface UpgradeModalProps {
    onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
    const { user } = useAuth();
    const [email, setEmail] = useState(user?.email || '');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Here you would typically send an email or create a support ticket
        // For now, we'll just show a success message
        console.log('Upgrade request:', { email, message });

        setSubmitted(true);

        // Auto-close after 3 seconds
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in-fade">
            <div className="absolute inset-0" onClick={onClose} />

            <Card className="w-full max-w-md glass border-white/20 shadow-2xl relative z-10 animate-in-zoom p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                    <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
                </button>

                {!submitted ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/50 mb-4">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-2xl font-outfit font-black text-white mb-2">
                                Request Pro Access
                            </h2>
                            <p className="text-sm text-slate-400">
                                We'll send you payment instructions via email within 24 hours
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="upgrade-email" className="text-xs font-bold uppercase tracking-widest text-slate-300">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    <Input
                                        id="upgrade-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-12 bg-slate-950/80 border-white/20 focus:border-amber-500 transition-all text-white"
                                        required
                                        disabled={!!user?.email}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-300">
                                    Message (Optional)
                                </Label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-950/80 border border-white/20 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-white text-sm resize-none"
                                    placeholder="Any specific questions or requirements?"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold uppercase tracking-widest text-sm shadow-lg shadow-amber-500/30"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Request
                            </Button>

                            <p className="text-xs text-center text-slate-500">
                                Payment methods: Bank Transfer, Payoneer
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8 space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white">Request Sent!</h3>
                        <p className="text-sm text-slate-400 max-w-sm mx-auto">
                            We've received your upgrade request. Check your email for payment instructions within 24 hours.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
