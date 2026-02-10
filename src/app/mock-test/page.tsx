'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { getMockTests, MockTest } from '@/lib/mock-test-store';
import { motion } from 'framer-motion';
import {
    Target, BookOpen, Lock, Clock, AlertTriangle, ArrowRight, PlayCircle,
    Brain, Calculator, BarChart3, Monitor, MapPin, Newspaper
} from 'lucide-react';

const SUBJECT_ICONS: Record<string, React.ElementType> = {
    'Mathematics': Calculator,
    'Reasoning': Brain,
    'Data Interpretation': BarChart3,
    'Computer Knowledge': Monitor,
    'Odisha GK': MapPin,
    'Current Affairs': Newspaper,
};

function TestCard({ test, index }: { test: MockTest; index: number }) {
    const Icon = test.subject ? (SUBJECT_ICONS[test.subject] || BookOpen) : Target;
    const isLocked = test.isLocked || test.questions.length === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            {isLocked ? (
                <div className="glass-card rounded-2xl p-6 border border-white/5 opacity-60 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                        <Lock className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400 mb-1">{test.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">Coming Soon</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.timeLimit} min</span>
                    </div>
                    <div className="mt-4 px-4 py-2.5 bg-slate-800/50 text-slate-500 rounded-xl text-center text-sm font-bold cursor-not-allowed">
                        🔒 Locked
                    </div>
                </div>
            ) : (
                <Link href={`/mock-test/${test.id}`} className="block group">
                    <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 hover:bg-white/5 transition-all hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                        {test.type === 'full' && (
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-primary/20 to-transparent px-4 py-1 text-xs font-bold text-primary rounded-bl-xl">
                                ⭐ FULL LENGTH
                            </div>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${test.type === 'full' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{test.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {test.questions.length} Questions
                            {test.negativeMarking > 0 && ` • -${test.negativeMarking} neg. marking`}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.timeLimit} min</span>
                            {test.negativeMarking > 0 && (
                                <span className="flex items-center gap-1 text-red-400"><AlertTriangle className="w-3.5 h-3.5" /> Negative Marking</span>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-bold group-hover:bg-primary group-hover:text-black transition-all">
                            <PlayCircle className="w-4 h-4" /> Start Test <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </Link>
            )}
        </motion.div>
    );
}

export default function MockTestHubPage() {
    const [tests, setTests] = useState<MockTest[]>([]);

    useEffect(() => {
        setTests(getMockTests());
    }, []);

    const fullTests = tests.filter(t => t.type === 'full');
    const subjectTests = tests.filter(t => t.type === 'subject');
    const premiumTests = tests.filter(t => t.type === 'premium');

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-4 mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold mb-6"
                    >
                        <Target className="w-4 h-4" /> Mock Test Center
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading"
                    >
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Mock Test</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        Full-length exams, subject-wise practice, and premium test series. Pick your challenge and start preparing.
                    </motion.p>
                </section>

                <div className="max-w-7xl mx-auto px-4 space-y-16">
                    {/* Full-Length Tests */}
                    {fullTests.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Full-Length Mock Tests</h2>
                                    <p className="text-sm text-slate-500">Complete exam simulation with timer & negative marking</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fullTests.map((test, i) => <TestCard key={test.id} test={test} index={i} />)}
                            </div>
                        </section>
                    )}

                    {/* Subject-wise Tests */}
                    {subjectTests.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Subject-wise Practice</h2>
                                    <p className="text-sm text-slate-500">Focus on individual topics to strengthen weak areas</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subjectTests.map((test, i) => <TestCard key={test.id} test={test} index={i} />)}
                            </div>
                        </section>
                    )}

                    {/* Premium Test Series */}
                    {premiumTests.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Premium Test Series</h2>
                                    <p className="text-sm text-slate-500">Advanced tests coming soon — stay tuned!</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {premiumTests.map((test, i) => <TestCard key={test.id} test={test} index={i} />)}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
