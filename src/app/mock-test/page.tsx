'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMockTests, MockTest } from '@/lib/mock-test-store';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { Target, Clock, AlertTriangle, Lock, ChevronRight, Sparkles, BookOpen, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

function TestCard({ test, index }: { test: MockTest; index: number }) {
    const isLocked = test.isLocked;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            {isLocked ? (
                <div className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.02] opacity-60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 to-transparent" />
                    <div className="flex items-center justify-between mb-3 relative">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-800 text-slate-500 uppercase tracking-wider">
                            Premium
                        </span>
                        <Lock className="w-4 h-4 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-500 mb-1 font-heading">{test.title}</h3>
                    <p className="text-sm text-slate-600">🔒 Coming Soon</p>
                </div>
            ) : (
                <Link href={`/mock-test/${test.id}`} className="block group">
                    <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all" />

                        <div className="flex items-center justify-between mb-3 relative">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${test.type === 'full' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                {test.type === 'full' ? 'Full Test' : test.subject || 'Subject'}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" /> {test.timeLimit} min
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 font-heading">
                            {test.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                            <span>📝 {test.questions.length} Questions</span>
                            {test.negativeMarking > 0 && (
                                <span className="flex items-center gap-1 text-red-400/70">
                                    <AlertTriangle className="w-3 h-3" /> -{test.negativeMarking}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-primary text-sm font-bold group-hover:gap-3 transition-all">
                            Start Test <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </Link>
            )}
        </motion.div>
    );
}

export default function MockTestHubPage() {
    const [tests, setTests] = useState<MockTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMockTests().then(data => { setTests(data); setLoading(false); });
    }, []);

    const fullTests = tests.filter(t => t.type === 'full');
    const subjectTests = tests.filter(t => t.type === 'subject');
    const premiumTests = tests.filter(t => t.type === 'premium');

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
            <NavBar />

            {/* Hero */}
            <section className="relative pt-28 pb-16 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#0f172a] to-[#0f172a] -z-10" />
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
                        <Target className="w-4 h-4" /> Mock Test Hub
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                        Choose Your Mock Test
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Full-length exams, subject-wise practice, and premium test series. Pick your challenge and start preparing.
                    </motion.p>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-4 pb-20 space-y-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <>
                        {/* Full-Length Tests */}
                        {fullTests.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Trophy className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-heading">🎯 Full-Length Mock Tests</h2>
                                        <p className="text-sm text-slate-500">Complete exam simulation</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {fullTests.map((test, i) => <TestCard key={test.id} test={test} index={i} />)}
                                </div>
                            </section>
                        )}

                        {/* Subject-wise Tests */}
                        {subjectTests.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-400" /></div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-heading">📚 Subject-wise Practice</h2>
                                        <p className="text-sm text-slate-500">Focus on specific topics</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {subjectTests.map((test, i) => <TestCard key={test.id} test={test} index={i} />)}
                                </div>
                            </section>
                        )}

                        {/* Interactive Legacy Portal */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-orange-400" /></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white font-heading">⚡ Interactive Simulation Engine (v2)</h2>
                                    <p className="text-sm text-slate-500">Standalone high-precision mocks with advanced logic</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Link href="/mocks/OSSC_CGL_Mock_2_2026.html" target="_blank" className="block group">
                                    <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 hover:bg-white/5 transition-all hover:shadow-lg hover:shadow-orange-500/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-all" />
                                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2 font-heading">OSSC CGL Mock Test 2</h3>
                                        <p className="text-sm text-slate-400 mb-4">150 Questions · 150 Minutes · Real-time Results</p>
                                        <div className="flex items-center gap-2 text-orange-400 text-sm font-bold group-hover:gap-3 transition-all">
                                            Launch Mock Engine <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                                <Link href="/mocks/OSSC_CGL_Mock_3_2026.html" target="_blank" className="block group">
                                    <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 hover:bg-white/5 transition-all hover:shadow-lg hover:shadow-orange-500/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-all" />
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors font-heading">OSSC CGL Mock Test 3</h3>
                                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-400 uppercase tracking-wider">🔒 Locked</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-2">150 Questions · 150 Minutes · PDF Report</p>
                                        <p className="text-xs text-yellow-400 font-semibold">🕙 Unlocks: April 18, 2026 — 10:00 AM IST</p>
                                    </div>
                                </Link>
                            </div>
                        </section>

                        {/* Premium Tests */}

                        {premiumTests.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-yellow-400" /></div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white font-heading">🔒 Premium Test Series</h2>
                                        <p className="text-sm text-slate-500">Coming soon — advanced practice</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {premiumTests.map((test, i) => <TestCard key={test.id} test={test} index={i} />)}
                                </div>
                            </section>
                        )}

                        {tests.length === 0 && (
                            <div className="text-center py-20 text-slate-500">
                                <p className="text-lg mb-2">No mock tests available yet.</p>
                                <p className="text-sm">Admin can add tests from the <Link href="/admin" className="text-primary underline">Admin Panel</Link>.</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
