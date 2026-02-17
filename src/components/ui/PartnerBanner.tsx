import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PartnerBannerProps {
    firmKey: string;
    type: 'hero' | 'leaderboard' | 'square';
    className?: string;
}

const BANNER_MAP: Record<string, Record<string, { url: string, width: number, height: number }>> = {
    ftmo: {
        hero: {
            url: "https://cdn.ftmo.com/aff-banner.1200x628",
            width: 1200,
            height: 628
        },
        leaderboard: {
            url: "https://cdn.ftmo.com/aff-banner.728x90",
            width: 728,
            height: 90
        }
    }
};

export function PartnerBanner({ firmKey, type, className }: PartnerBannerProps) {
    const banner = BANNER_MAP[firmKey.toLowerCase()]?.[type];

    if (!banner) return null;

    return (
        <div className={cn(
            "relative group rounded-xl overflow-hidden border border-white/5 transition-all duration-500",
            "hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
            className
        )}>
            <Link
                href={`/go/${firmKey.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
            >
                <img
                    src={banner.url}
                    alt={`${firmKey} Partner Banner`}
                    width={banner.width}
                    height={banner.height}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                />

                {/* Subtle Overlay Glow */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        </div>
    );
}
