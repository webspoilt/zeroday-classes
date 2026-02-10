'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMockTestById, MockTest, Question } from '@/lib/mock-test-store';
import { NavBar } from '@/components/NavBar';
import { Timer, ChevronRight, ChevronLeft, Flag, Send, CheckCircle, XCircle, MinusCircle, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import confetti from 'canvas-confetti';

// ─── Types ─────────────────────────────────────────
interface FormattedQuestion extends Question {
    globalIndex: number;
}

interface TestResult {
    score: number;
    correct: number;
    wrong: number;
    unattempted: number;
    totalQuestions: number;
    timeTaken: number;
    answers: Record<number, number>;
    questions: FormattedQuestion[];
}

// ─── Registration ──────────────────────────────────
function Registration({ test, onStart }: { test: MockTest; onStart: (name: string) => void }) {
    const [name, setName] = useState('');

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg glass-card rounded-2xl p-8 border border-white/10"
            >
                <Link href="/mock-test" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Mock Tests
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2 font-heading">{test.title}</h1>
                <p className="text-slate-400 mb-6">
                    {test.questions.length} Questions • {test.timeLimit} min
                    {test.negativeMarking > 0 && ` • -${test.negativeMarking} negative marking`}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-white">📝 {test.questions.length}</div>
                        <div className="text-xs text-slate-500">Questions</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-white">⏱️ {test.timeLimit}m</div>
                        <div className="text-xs text-slate-500">Time Limit</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-red-400">-{test.negativeMarking}</div>
                        <div className="text-xs text-slate-500">Neg. Marks</div>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onStart(name.trim()); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg">
                        🎯 Start Test
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

// ─── Quiz Interface ────────────────────────────────
function QuizInterface({ test, userName, onComplete }: { test: MockTest; userName: string; onComplete: (result: TestResult) => void }) {
    const questions: FormattedQuestion[] = test.questions.map((q, i) => ({ ...q, globalIndex: i }));
    const totalTime = test.timeLimit * 60;

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [marked, setMarked] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [submitted, setSubmitted] = useState(false);

    const answersRef = useRef(answers);
    useEffect(() => { answersRef.current = answers; }, [answers]);

    const handleSubmit = useCallback(() => {
        if (submitted) return;
        setSubmitted(true);

        const currentAnswers = answersRef.current;
        let correct = 0, wrong = 0, unattempted = 0;

        questions.forEach((q) => {
            const userAns = currentAnswers[q.globalIndex];
            if (userAns === undefined) unattempted++;
            else if (userAns === q.correct) correct++;
            else wrong++;
        });

        const score = correct * 1 - wrong * test.negativeMarking;

        onComplete({
            score,
            correct,
            wrong,
            unattempted,
            totalQuestions: questions.length,
            timeTaken: totalTime - timeLeft,
            answers: currentAnswers,
            questions,
        });
    }, [submitted, questions, test.negativeMarking, onComplete, totalTime, timeLeft]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [handleSubmit]);

    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const q = questions[currentQ];
    if (!q) return null;

    const timePercent = (timeLeft / totalTime) * 100;
    const isLowTime = timeLeft < 300;

    return (
        <div className="min-h-screen bg-[#0f172a]">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="text-sm text-slate-400 font-medium">{test.title} • {userName}</div>
                    <div className={cn("flex items-center gap-2 font-mono font-bold text-lg", isLowTime ? "text-red-400 animate-pulse" : "text-white")}>
                        <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => { if (confirm('Are you sure you want to submit?')) handleSubmit(); }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-500 transition-colors flex items-center gap-1">
                        <Send className="w-4 h-4" /> Submit
                    </button>
                </div>
                <div className="max-w-7xl mx-auto mt-2">
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all duration-1000", isLowTime ? "bg-red-500" : "bg-primary")} style={{ width: `${timePercent}%` }} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Question Area */}
                <div className="lg:col-span-3">
                    <div className="glass-card rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                Question {currentQ + 1} of {questions.length}
                            </span>
                            <button onClick={() => setMarked(prev => { const n = new Set(prev); n.has(currentQ) ? n.delete(currentQ) : n.add(currentQ); return n; })}
                                className={cn("flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors",
                                    marked.has(currentQ) ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-slate-800 text-slate-400 hover:text-white")}>
                                <Flag className="w-3.5 h-3.5" /> {marked.has(currentQ) ? 'Marked' : 'Mark'}
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">{q.question}</h2>

                        <div className="space-y-3">
                            {q.options.map((opt, i) => (
                                <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.globalIndex]: i }))}
                                    className={cn("w-full text-left px-5 py-4 rounded-xl border transition-all font-medium",
                                        answers[q.globalIndex] === i
                                            ? "bg-primary/10 border-primary/40 text-primary"
                                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20")}>
                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-xs font-bold mr-3">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0}
                                className="flex items-center gap-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <button onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentQ === questions.length - 1}
                                className="flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed">
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Palette */}
                <div className="lg:col-span-1">
                    <div className="glass-card rounded-2xl p-6 border border-white/10 sticky top-28">
                        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Question Palette</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, i) => (
                                <button key={i} onClick={() => setCurrentQ(i)}
                                    className={cn("w-full aspect-square rounded-lg text-xs font-bold transition-colors",
                                        currentQ === i ? "ring-2 ring-primary" : "",
                                        marked.has(i) ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                                            answers[i] !== undefined ? "bg-primary/20 text-primary border border-primary/30" :
                                                "bg-slate-800 text-slate-400 hover:bg-slate-700")}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 space-y-2 text-xs text-slate-500">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" /> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" /> Marked</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-800" /> Not visited</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Results View ──────────────────────────────────
function ResultsView({ test, result, onRetry }: { test: MockTest; result: TestResult; onRetry: () => void }) {
    useEffect(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, []);

    const percentage = (result.correct / result.totalQuestions) * 100;
    const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

    return (
        <div className="min-h-screen bg-[#0f172a] pt-24 pb-20">
            <NavBar />
            <div className="max-w-3xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-heading">Test Completed!</h1>
                    <p className="text-slate-400">{test.title}</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card rounded-xl p-5 text-center border border-white/10">
                        <div className="text-3xl font-bold text-white">{result.score.toFixed(1)}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Score</div>
                    </div>
                    <div className="glass-card rounded-xl p-5 text-center border border-white/10">
                        <div className="text-3xl font-bold text-green-400">{result.correct}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Correct</div>
                    </div>
                    <div className="glass-card rounded-xl p-5 text-center border border-white/10">
                        <div className="text-3xl font-bold text-red-400">{result.wrong}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Wrong</div>
                    </div>
                    <div className="glass-card rounded-xl p-5 text-center border border-white/10">
                        <div className="text-3xl font-bold text-slate-400">{result.unattempted}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Skipped</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-card rounded-xl p-5 text-center border border-white/10">
                        <div className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Accuracy</div>
                    </div>
                    <div className="glass-card rounded-xl p-5 text-center border border-white/10">
                        <div className="text-2xl font-bold text-white">{formatTime(result.timeTaken)}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Time Taken</div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
                    <h3 className="text-lg font-bold text-white mb-4">Answer Review</h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {result.questions.map((q, i) => {
                            const userAns = result.answers[q.globalIndex];
                            const isCorrect = userAns === q.correct;
                            const isSkipped = userAns === undefined;

                            return (
                                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-start gap-3">
                                        <div className={cn("mt-1 shrink-0", isSkipped ? "text-slate-500" : isCorrect ? "text-green-400" : "text-red-400")}>
                                            {isSkipped ? <MinusCircle className="w-5 h-5" /> : isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white mb-2">Q{i + 1}. {q.question}</div>
                                            {!isSkipped && !isCorrect && (
                                                <div className="text-xs text-red-400 mb-1">Your answer: {q.options[userAns]}</div>
                                            )}
                                            <div className="text-xs text-green-400 mb-2">Correct: {q.options[q.correct]}</div>
                                            {q.explanation && (
                                                <div className="text-xs text-slate-500 bg-white/5 rounded-lg p-2 mt-1">💡 {q.explanation}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={onRetry} className="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all">
                        🔄 Retry Test
                    </button>
                    <Link href="/mock-test" className="px-6 py-3 glass-card text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                        ← All Mock Tests
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────
export default function DynamicTestPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.testId as string;

    const [test, setTest] = useState<MockTest | null>(null);
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState<'register' | 'quiz' | 'result'>('register');
    const [userName, setUserName] = useState('');
    const [result, setResult] = useState<TestResult | null>(null);

    useEffect(() => {
        // Skip for the hardcoded ossc-cgl route
        if (testId === 'ossc-cgl' || testId === 'odisha-history') {
            return;
        }
        getMockTestById(testId).then(found => {
            if (found && !found.isLocked && found.questions.length > 0) {
                setTest(found);
            }
            setLoading(false);
        });
    }, [testId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-4">
                <NavBar />
                <div className="text-center mt-20">
                    <h1 className="text-3xl font-bold text-white mb-4">Test Not Found</h1>
                    <p className="text-slate-400 mb-6">This test doesn&apos;t exist or is currently locked.</p>
                    <Link href="/mock-test" className="px-6 py-3 bg-primary text-black font-bold rounded-xl">
                        ← Browse Mock Tests
                    </Link>
                </div>
            </div>
        );
    }

    if (phase === 'result' && result) {
        return <ResultsView test={test} result={result} onRetry={() => { setResult(null); setPhase('register'); }} />;
    }

    if (phase === 'quiz') {
        return (
            <QuizInterface
                test={test}
                userName={userName}
                onComplete={(res) => { setResult(res); setPhase('result'); }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a]">
            <NavBar />
            <Registration test={test} onStart={(name) => { setUserName(name); setPhase('quiz'); }} />
        </div>
    );
}
