"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Crown, Loader2, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminPage() {
    const { profile, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && profile?.is_admin) {
            fetchUsers();
        }
    }, [authLoading, profile]);

    async function fetchUsers() {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function toggleTier(userId: string, currentTier: string) {
        const newTier = currentTier === 'PRO' ? 'BASIC' : 'PRO';
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ subscription_tier: newTier })
                .eq('id', userId);

            if (error) throw error;

            // Local update for immediate feedback
            setUsers(users.map(u => u.id === userId ? { ...u, subscription_tier: newTier } : u));
        } catch (err: any) {
            alert(err.message);
        }
    }

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.includes(searchQuery)
    );

    if (authLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        </div>
    );

    if (!profile?.is_admin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-rose-500" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Access Denied</h1>
                <p className="text-slate-400 max-w-sm mb-8">
                    You do not have the institutional clearance required to access the QuantAdmin Command Center.
                </p>
                <Link href="/">
                    <Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-8 h-12">
                        Back to Terminal
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-12 space-y-10 animate-in-fade">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                        Administrative Console
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white flex items-center gap-4">
                        <Shield className="w-10 h-10 text-blue-500" />
                        Admin Command Center
                    </h1>
                    <p className="text-slate-400 text-lg">Manage user profiles and institutional access tiers.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchUsers}
                        disabled={loading}
                        className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Terminal Home
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass border-white/5 p-6 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Total Records</p>
                    <p className="text-4xl font-black text-white">{users.length}</p>
                </Card>
                <Card className="glass border-white/5 p-6 space-y-2">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Pro Accounts</p>
                    <p className="text-4xl font-black text-white">{users.filter(u => u.subscription_tier === 'PRO').length}</p>
                </Card>

                <div className="md:col-span-2 flex items-end">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by email or UID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Main Table View */}
            <Card className="glass border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/[0.02] py-6">
                    <CardTitle className="text-xl flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-400" />
                        User Directory
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-6 py-4">User Identity</th>
                                    <th className="px-6 py-4">Current Tier</th>
                                    <th className="px-6 py-4">Created Date</th>
                                    <th className="px-6 py-4 text-right">Access Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-500/50" />
                                            <p className="text-slate-500 mt-4 font-mono text-xs uppercase tracking-widest">Compiling Records...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-500 font-medium">
                                            No matches found in standard directory.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{user.email || 'No Email'}</span>
                                                    <span className="text-[10px] font-mono text-slate-600 lowercase">{user.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.subscription_tier === 'PRO'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                    {user.subscription_tier === 'PRO' && <Crown className="w-3 h-3" />}
                                                    {user.subscription_tier}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => toggleTier(user.id, user.subscription_tier)}
                                                    className={cn(
                                                        "font-bold uppercase tracking-widest text-[10px] h-9 px-4 rounded-lg transition-all",
                                                        user.subscription_tier === 'PRO'
                                                            ? "bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20"
                                                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                                    )}
                                                >
                                                    {user.subscription_tier === 'PRO' ? 'Downgrade' : 'Promote to Pro'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
