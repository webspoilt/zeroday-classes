'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMockTestById, MockTest, Question } from '@/lib/mock-test-store';
import { NavBar } from '@/components/layout/NavBar';
import { Timer, ChevronRight, ChevronLeft, Flag, Send, CheckCircle, XCircle, MinusCircle, ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Share2, Mail, Loader2, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';


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
function Registration({ test, onStart }: { test: MockTest; onStart: (name: string, email: string) => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !phone || phone.length < 10) {
            setError('Please enter valid details');
            return;
        }

        // Rate Limit Check
        const lastOtpTime = localStorage.getItem('last_otp_time');
        const otpCount = parseInt(localStorage.getItem('otp_count_session') || '0');
        const now = Date.now();

        if (otpCount >= 3 && lastOtpTime && now - parseInt(lastOtpTime) < 1000 * 60 * 10) {
            setError('Too many OTP attempts. Please wait 10 minutes.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: '+91' + phone.replace(/\D/g, '').slice(-10),
            });
            if (error) throw error;

            // Update Rate Limit
            localStorage.setItem('last_otp_time', now.toString());
            localStorage.setItem('otp_count_session', (otpCount + 1).toString());

            setStep('otp');
            setTimeLeft(60);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: '+91' + phone.replace(/\D/g, '').slice(-10),
                token: otp,
                type: 'sms',
            });
            if (error) throw error;
            onStart(name, email);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 'details' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Your Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number *</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">+91</div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter 10-digit number"
                                    className="w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    required
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email (Optional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="For result report"
                                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            />
                            <p className="text-xs text-slate-500 mt-1">Provide email to get the test report sent to you.</p>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP & Start'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="text-center mb-4">
                            <div className="text-slate-400 text-sm">OTP sent to +91 {phone}</div>
                            <button type="button" onClick={() => setStep('details')} className="text-xs text-blue-400 hover:text-blue-300">Change</button>
                        </div>

                        <div className="flex justify-center gap-2 mb-4">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="XXXXXX"
                                className="w-32 text-center py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white text-xl tracking-widest focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        <button type="submit" disabled={loading || otp.length < 6} className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all shadow-lg flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Start Test'}
                        </button>
                        {timeLeft > 0 && <div className="text-center text-xs text-slate-500">Resend in {timeLeft}s</div>}
                    </form>
                )}
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
function ResultsView({ test, result, userEmail, userName, onRetry }: { test: MockTest; result: TestResult; userEmail: string; userName: string; onRetry: () => void }) {
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, []);

    const percentage = (result.correct / result.totalQuestions) * 100;
    const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

    const handleSendEmail = async () => {
        if (!userEmail) {
            alert('No email provided during registration.');
            return;
        }
        setSendingEmail(true);
        try {
            const res = await fetch('/api/send-report', {
                method: 'POST',
                body: JSON.stringify({
                    email: userEmail,
                    name: userName,
                    testTitle: test.title,
                    score: result.score.toFixed(1),
                    totalQuestions: result.totalQuestions,
                    correct: result.correct,
                    wrong: result.wrong,
                    unattempted: result.unattempted,
                    timeTaken: formatTime(result.timeTaken),
                    questions: result.questions,
                    answers: result.answers
                })
            });
            const data = await res.json();
            if (data.success) alert(`Report sent to ${userEmail}!`);
            else alert('Failed to send email.');
        } catch (e) {
            console.error(e);
            alert('Error sending email.');
        } finally {
            setSendingEmail(false);
        }
    };

    const handleDownloadReport = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(41, 128, 185);
        doc.text('Mock Test Report', 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Test: ${test.title}`, 14, 32);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

        // Summary Table
        autoTable(doc, {
            startY: 45,
            head: [['Metric', 'Value']],
            body: [
                ['Score', `${result.score.toFixed(1)}`],
                ['Correct Answers', `${result.correct}`],
                ['Wrong Answers', `${result.wrong}`],
                ['Unattempted', `${result.unattempted}`],
                ['Accuracy', `${percentage.toFixed(0)}%`],
                ['Time Taken', formatTime(result.timeTaken)],
            ],
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 10 },
        });

        // Detailed Analysis
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text('Detailed Question Analysis', 14, finalY);

        const tableData = result.questions.map((q, i) => {
            const userAnsIndex = result.answers[q.globalIndex];
            const userAns = userAnsIndex !== undefined ? q.options[userAnsIndex] : 'Skipped';
            const correctAns = q.options[q.correct];
            let status = 'Skipped';
            if (userAnsIndex === q.correct) status = 'Correct';
            else if (userAnsIndex !== undefined) status = 'Wrong';

            return [
                `${i + 1}`,
                q.question,
                userAns,
                correctAns,
                status
            ];
        });

        autoTable(doc, {
            startY: finalY + 5,
            head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 9, cellWidth: 'wrap' },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 60 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40 },
                4: { cellWidth: 20 },
            },
            didParseCell: function (data) {
                if (data.section === 'body' && data.column.index === 4) {
                    if (data.cell.raw === 'Correct') {
                        data.cell.styles.textColor = [0, 180, 0];
                    } else if (data.cell.raw === 'Wrong') {
                        data.cell.styles.textColor = [200, 0, 0];
                    } else {
                        data.cell.styles.textColor = [150, 150, 150];
                    }
                }
            }
        });

        doc.save(`${test.title.replace(/\s+/g, '_')}_Report.pdf`);
    };

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
                                            <div className="text-xs text-green-400 mb-2">Correct: {q.options[q.correct]}</div>
                                            {q.explanation && (
                                                <div className="text-xs text-slate-500 bg-white/5 rounded-lg p-3 mt-1 whitespace-pre-wrap font-mono">
                                                    💡 <strong>Explanation:</strong><br />
                                                    {q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button onClick={handleDownloadReport} className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all flex items-center gap-2">
                        <Download className="w-5 h-5" /> Download PDF
                    </button>
                    {userEmail && (
                        <button onClick={handleSendEmail} disabled={sendingEmail} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50">
                            {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />} Email Report
                        </button>
                    )}
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
    const [userEmail, setUserEmail] = useState('');
    const [result, setResult] = useState<TestResult | null>(null);

    // Removed separate auth check since it is now in Registration
    // Initial session check for existing sessions (optional, but good for UX)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                // We could auto-fill user details here if we had a profile table
                // For now just acknowledgement
                console.log("Session found:", session.user.email);
            }
            setLoading(false);
        });
    }, []);

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
        return <ResultsView test={test} result={result} userEmail={userEmail} userName={userName} onRetry={() => { setResult(null); setPhase('register'); }} />;
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
            {/* If user is already logged in, we can skip OTP? For now, we always show registration to get latest Name/Email intent, but we could auto-fill phone */}
            <Registration test={test} onStart={(name, email) => { setUserName(name); setUserEmail(email); setPhase('quiz'); }} />
        </div>
    );
}
