"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Crown, Zap, Shield, TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
    tier: 'basic' | 'pro';
    name: string;
    price: number;
    period: string;
    description: string;
    features: { text: string; included: boolean }[];
    popular?: boolean;
    buttonText?: string;
    onSelect: () => void;
}

export function PricingCard({ tier, name, price, period, description, features, popular, buttonText, onSelect }: PricingCardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { isPro } = useAuth();

    // Magnetic hover effect for Pro card
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (tier !== 'pro' || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        setMousePosition({ x: x * 0.1, y: y * 0.1 });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const isPurchased = tier === 'pro' && isPro;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative group perspective-1000",
                "animate-in-slide-up"
            )}
            style={{
                transform: tier === 'pro'
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) rotateX(${-mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`
                    : 'none',
                transition: 'transform 0.2s ease-out',
                animationDelay: tier === 'basic' ? '0.1s' : '0.2s'
            }}
        >
            {/* Gradient Glow */}
            {tier === 'pro' && (
                <div
                    className={cn(
                        "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                        "bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-500/30",
                        "animate-gradient-flow"
                    )}
                />
            )}

            {/* Popular Badge */}
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/50">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        <div className="flex items-center gap-1.5 relative z-10">
                            <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-950">Most Popular</span>
                        </div>
                    </div>
                </div>
            )}

            <div
                className={cn(
                    "relative glass rounded-3xl p-8 h-full flex flex-col",
                    "transition-all duration-300",
                    tier === 'pro'
                        ? "border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent"
                        : "border border-white/10",
                    isHovered && tier === 'pro' && "shadow-2xl shadow-amber-500/20"
                )}
            >
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        {tier === 'basic' ? (
                            <Shield className="w-6 h-6 text-blue-500" />
                        ) : (
                            <Crown className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                        )}
                        <h3 className="text-2xl font-outfit font-black text-white uppercase tracking-tight">
                            {name}
                        </h3>
                    </div>
                    <p className="text-sm text-slate-400 font-serif italic">{description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white font-outfit">
                            ${price}
                        </span>
                        <span className="text-slate-500 text-sm font-medium">/{period}</span>
                    </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className={cn(
                                "flex items-start gap-3 group/feature transition-all duration-300",
                                "hover:translate-x-1"
                            )}
                            style={{
                                animation: isHovered ? `slideInLeft 0.3s ease-out ${index * 0.05}s both` : 'none'
                            }}
                        >
                            {feature.included ? (
                                <div className="mt-0.5 p-1 rounded-full bg-emerald-500/20">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 animate-in-zoom" />
                                </div>
                            ) : (
                                <div className="mt-0.5 p-1 rounded-full bg-slate-800/50">
                                    <X className="w-3.5 h-3.5 text-slate-600" />
                                </div>
                            )}
                            <span className={cn(
                                "text-sm font-medium leading-relaxed",
                                feature.included ? "text-slate-200" : "text-slate-600 line-through"
                            )}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <Button
                    onClick={onSelect}
                    disabled={isPurchased}
                    className={cn(
                        "w-full h-14 font-bold uppercase tracking-widest text-sm transition-all relative overflow-hidden group/btn",
                        tier === 'pro'
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/30"
                            : "bg-slate-800 hover:bg-slate-700 text-white border border-white/10"
                    )}
                >
                    {/* Ripple Effect */}
                    <span className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 rounded-full transition-transform duration-500 origin-center" />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isPurchased ? (
                            <>
                                <Check className="w-5 h-5" />
                                {buttonText || "Current Plan"}
                            </>
                        ) : buttonText ? (
                            buttonText
                        ) : tier === 'basic' ? (
                            "Continue Free"
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Upgrade Now
                            </>
                        )}
                    </span>
                </Button>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }

                .animate-gradient-flow {
                    background-size: 200% 200%;
                    animation: gradient-flow 3s ease infinite;
                }

                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
}
