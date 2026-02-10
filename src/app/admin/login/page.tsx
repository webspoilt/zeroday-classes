'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { adminLogin, isAdminLoggedIn } from '@/lib/admin-auth';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isAdminLoggedIn()) {
            router.replace('/admin');
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (adminLogin(password)) {
            router.push('/admin');
        } else {
            setError('Invalid password. Access denied.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-red-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <Shield className="w-8 h-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white font-outfit">Admin Access</h1>
                        <p className="text-sm text-slate-500 mt-1">ZeroDay Classes Control Panel</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                <Lock className="w-3.5 h-3.5 inline mr-1.5" />
                                Admin Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all pr-12"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
                        >
                            Unlock Dashboard
                        </button>
                    </form>

                    <p className="text-xs text-slate-600 text-center mt-6">
                        This area is restricted to authorized administrators only.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
