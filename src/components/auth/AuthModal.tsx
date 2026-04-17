'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'google' | 'phone'>('google');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth/callback',
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        // Rate Limit Check
        const lastOtpTime = localStorage.getItem('last_otp_time');
        const otpCount = parseInt(localStorage.getItem('otp_count_session') || '0');
        const now = Date.now();

        if (otpCount >= 3 && lastOtpTime && now - parseInt(lastOtpTime) < 1000 * 60 * 10) { // 10 min cooldown after 3 attempts
            setError('Too many OTP attempts. Please wait 10 minutes.');
            return;
        }

        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid phone number.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: '+91' + phoneNumber.replace(/\D/g, '').slice(-10), // Assuming India +91
            });
            if (error) throw error;

            // Update Rate Limit
            localStorage.setItem('last_otp_time', now.toString());
            localStorage.setItem('otp_count_session', (otpCount + 1).toString());

            setStep('otp');
            setTimeLeft(60); // 60s cooldown for resend UI
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: '+91' + phoneNumber.replace(/\D/g, '').slice(-10),
                token: otp,
                type: 'sms',
            });
            if (error) throw error;
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="flex justify-between items-center p-4 border-b border-white/5">
                        <h2 className="text-lg font-bold text-white">Login Required</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>

                    <div className="p-6">
                        <p className="text-slate-400 text-sm mb-6 text-center">
                            Please login to access Mock Tests and save your progress.
                        </p>

                        <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
                            <button
                                onClick={() => setMode('google')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'google' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Google
                            </button>
                            <button
                                onClick={() => setMode('phone')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'phone' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                Phone OTP
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {mode === 'google' && (
                            <div className="space-y-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                                    Continue with Google
                                </button>
                            </div>
                        )}

                        {mode === 'phone' && (
                            <div className="space-y-4">
                                {step === 'phone' ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">+91</div>
                                                <input
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    placeholder="Enter 10-digit number"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={loading || phoneNumber.length < 10}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                            Send OTP
                                        </button>
                                        <div className="text-xs text-center text-slate-500">
                                            Limit: 3 OTPs per session to prevent misuse.
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mb-2">
                                            <div className="text-slate-400 text-sm">Validating OTP sent to</div>
                                            <div className="text-white font-mono font-bold">+91 {phoneNumber}</div>
                                            <button onClick={() => setStep('phone')} className="text-xs text-blue-400 hover:text-blue-300 mt-1">Change Number</button>
                                        </div>
                                        <div className="flex justify-center gap-2 mb-4">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="XXXXXX"
                                                className="w-32 text-center py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white text-xl tracking-widest focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                maxLength={6}
                                            />
                                        </div>
                                        <button
                                            onClick={handleVerifyOtp}
                                            disabled={loading || otp.length < 6}
                                            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                            Verify & Login
                                        </button>
                                        {timeLeft > 0 && (
                                            <div className="text-xs text-center text-slate-500 mt-2">
                                                Resend OTP in {timeLeft}s
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
