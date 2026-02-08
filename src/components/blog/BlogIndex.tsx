"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import { ArrowRight, Search, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogIndexProps {
    allPosts: BlogPost[];
}

export function BlogIndex({ allPosts }: BlogIndexProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", ...new Set(allPosts.map(p => p.frontmatter.category || "General"))];

    const filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.frontmatter.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.frontmatter.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = activeCategory === "All" || post.frontmatter.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-8 pb-20 bg-slate-950">
            <div className="max-w-6xl mx-auto px-6">

                {/* Header & Command Palette Search */}
                <div className="mb-20 text-center animate-in-fade">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight font-outfit">
                        Quant <span className="text-indigo-500">Intelligence</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-serif italic">
                        Deep dives into the mathematics of survival, expected value, and proprietary trading constraints.
                    </p>

                    {/* Search Bar (Glassmorphism) */}
                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                        <div className="relative flex items-center bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl">
                            <Search className="w-5 h-5 text-slate-500 ml-2" />
                            <input
                                type="text"
                                placeholder="Search risk models, strategies, or math..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 ml-4 font-mono text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500 pointer-events-none">
                                <span className="px-1 text-slate-400">⌘</span> K
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8 animate-in-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Filter className="w-4 h-4 text-slate-600 mr-2" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border",
                                    activeCategory === cat
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo"
                                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in-slide-up" style={{ animationDelay: '0.3s' }}>
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group relative flex flex-col bg-slate-900/40 border border-slate-800/50 rounded-3xl overflow-hidden hover:bg-slate-900 hover:border-indigo-500/30 hover:-translate-y-2 transition-all duration-500 shadow-xl"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="p-8 flex-1 flex flex-col relative z-10">
                                {/* Top Meta */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn(
                                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em]",
                                        post.frontmatter.category === 'Math' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    )}>
                                        {post.frontmatter.category || 'Standard'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                                        <Clock className="w-3 h-3" /> {post.readingTime}m
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-indigo-400 transition-colors font-outfit">
                                    {post.frontmatter.title}
                                </h2>

                                <p className="text-slate-400 leading-relaxed text-sm mb-6 line-clamp-3 font-serif">
                                    {post.frontmatter.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                            {post.frontmatter.author?.charAt(0) || 'Q'}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-ellipsis overflow-hidden whitespace-nowrap max-w-[100px]">
                                            {post.frontmatter.author || 'QuantRisk'}
                                        </span>
                                    </div>
                                    <div className="text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <Search className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                            <div className="text-xl text-slate-500 font-serif">No quantitative matches found for "{searchQuery}"</div>
                            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-indigo-500 hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
