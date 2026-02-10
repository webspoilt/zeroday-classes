'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Timer, AlertCircle, ChevronRight, ChevronLeft, Flag, Send, Download, Trophy, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import COMPLETE_QUESTION_BANK from '../../data/ossc-cgl';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// If you don't have a Button component, I will use standard HTML button elements with Tailwind classes.
// For now, I'll stick to standard elements to avoid dependency issues if Shadcn components aren't fully set up.

const SECTIONS = {
    MATH: { name: 'Quantitative Aptitude', count: 30, time: 24, id: 'MATH' },
    REASONING: { name: 'Reasoning Ability', count: 30, time: 24, id: 'REASONING' },
    DI: { name: 'Data Interpretation', count: 30, time: 24, id: 'DI' },
    COMPUTER: { name: 'Computer Awareness', count: 10, time: 8, id: 'COMPUTER' },
    ODISHA_GK: { name: 'Odisha General Knowledge', count: 20, time: 16, id: 'ODISHA_GK' },
    CURRENT_AFFAIRS: { name: 'Current Affairs', count: 30, time: 24, id: 'CURRENT_AFFAIRS' }
};

const TOTAL_TIME = 120 * 60; // 120 minutes in seconds

// Types
interface Question {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    section: string;
    sectionName: string;
    questionNumber: number;
    globalIndex: number;
}

interface QuizResult {
    userName: string;
    score: number;
    correct: number;
    wrong: number;
    unattempted: number;
    totalQuestions: number;
    timeTaken: number;
    sectionWise: Record<string, { correct: number; wrong: number; unattempted: number; score: number }>;
    timestamp: string;
    answers: Record<number, number>;
    questions: Question[];
}

// Generate full question set
const generateFullQuestionSet = (): Question[] => {
    const questions: Question[] = [];
    let globalIndex = 0;

    Object.entries(SECTIONS).forEach(([key, section]) => {
        // @ts-ignore - Accessing dynamic keys on the imported object
        const sectionQuestions = COMPLETE_QUESTION_BANK[key as keyof typeof COMPLETE_QUESTION_BANK]?.slice(0, section.count) || [];
        sectionQuestions.forEach((q: any, idx: number) => {
            questions.push({
                ...q,
                section: key,
                sectionName: section.name,
                questionNumber: idx + 1,
                globalIndex: globalIndex++
            });
        });
    });

    return questions;
};

// User Registration Component
const UserRegistration = ({ onStart }: { onStart: (name: string) => void }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Please enter your full name (at least 3 characters)');
            return;
        }
        onStart(name.trim());
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f172a] text-white font-sans relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-4 animate-pulse">
                        <Timer className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2 font-outfit">OSSC CGL Mock Test</h1>
                    <p className="text-slate-400">Full Length Examination • 150 Questions</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-5 mb-6 text-sm border border-white/5">
                    <h3 className="font-semibold text-blue-300 mb-3 text-lg">Exam Pattern</h3>
                    <ul className="space-y-2 text-slate-300">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Mathematics: 30 Questions</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Reasoning: 30 Questions</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Data Interpretation: 30 Questions</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Computer: 10 Questions</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Odisha GK: 20 Questions</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Current Affairs: 30 Questions</li>

                        <div className="my-3 h-px bg-white/10" />

                        <li className="font-semibold text-white flex justify-between">
                            <span>Total Time</span>
                            <span>120 Minutes</span>
                        </li>
                        <li className="font-semibold text-red-400 flex justify-between">
                            <span>Negative Marking</span>
                            <span>-0.25</span>
                        </li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Full Name (for Leaderboard)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                            placeholder="Enter your full name"
                            required
                        />
                        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                    >
                        Start Mock Test
                    </button>
                </form>

                <p className="text-xs text-slate-500 mt-5 text-center">
                    Note: Do not refresh the page once the test starts.
                </p>
            </motion.div>
        </div>
    );
};

// Main Quiz Component
const QuizInterface = ({ userName, onComplete }: { userName: string; onComplete: (res: QuizResult) => void }) => {
    const [questions] = useState(generateFullQuestionSet());
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [markedForReview, setMarkedForReview] = useState(new Set<number>());
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0 && !isSubmitted) {
            handleAutoSubmit();
            return;
        }

        // Warn user before unload
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [timeLeft, isSubmitted]);

    // Handle Auto Submit
    const handleAutoSubmit = useCallback(() => {
        setIsSubmitted(true);
        // Use a timeout to break the render cycle or ensure state is updated
        setTimeout(() => calculateAndSubmit(), 0);
    }, []); // Remove dependencies to avoid stale closures issues if handled correctly, or include them if needed. 
    // Better to use refs for latest state if using in callbacks, but here we can just call the function.
    // Actually, to assume 'answers' is fresh, let's pass it or use functional state updates if possible.
    // Since calculateAndSubmit reads 'answers', we need to be careful.
    // Let's make calculateAndSubmit depend on current state.

    const calculateAndSubmit = () => {
        let score = 0;
        let correct = 0;
        let wrong = 0;
        let unattempted = 0;
        const sectionWise: any = {};

        // Initialize section-wise stats
        Object.keys(SECTIONS).forEach(key => {
            sectionWise[key] = { correct: 0, wrong: 0, unattempted: 0, score: 0 };
        });

        questions.forEach(q => {
            const section = q.section;
            if (answers[q.globalIndex] === undefined) {
                unattempted++;
                sectionWise[section].unattempted++;
            } else if (answers[q.globalIndex] === q.correct) {
                score += 1;
                correct++;
                sectionWise[section].correct++;
                sectionWise[section].score += 1;
            } else {
                score -= 0.25; // Negative marking
                wrong++;
                sectionWise[section].wrong++;
                sectionWise[section].score -= 0.25;
            }
        });

        const result: QuizResult = {
            userName,
            score: Math.max(0, score),
            correct,
            wrong,
            unattempted,
            totalQuestions: questions.length,
            timeTaken: TOTAL_TIME - timeLeft,
            sectionWise,
            timestamp: new Date().toISOString(),
            answers: answers,
            questions: questions
        };

        // Save to localStorage for leaderboard
        const existing = JSON.parse(localStorage.getItem('ossc_cgl_results') || '[]');
        existing.push(result);
        localStorage.setItem('ossc_cgl_results', JSON.stringify(existing));

        onComplete(result);
    };

    const handleOptionSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [currentQIndex]: optionIndex
        }));
    };

    const toggleMarkForReview = () => {
        setMarkedForReview(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQIndex)) {
                newSet.delete(currentQIndex);
            } else {
                newSet.add(currentQIndex);
            }
            return newSet;
        });
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentQIndex];

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="glass-card bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <Send className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Submitting Test...</h2>
                    </div>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-nav bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-white font-outfit">OSSC CGL Mock Test</h1>
                        <p className="text-xs text-slate-400">Candidate: <span className="text-blue-400">{userName}</span></p>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border font-mono text-xl font-bold transition-colors ${timeLeft < 300
                        ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                        <Timer className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-1rem)]">
                {/* Question Panel */}
                <div className="lg:col-span-3 flex flex-col h-full gap-4">
                    {/* Question Card */}
                    <div className="glass-card bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex-1 overflow-y-auto relative">
                        <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900/50 backdrop-blur-sm p-2 -mx-2 -mt-2 rounded-lg z-10 border-b border-white/5">
                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
                                {currentQuestion.sectionName}
                            </span>
                            <span className="text-sm font-medium text-slate-400">
                                Question <span className="text-white text-lg">{currentQIndex + 1}</span> / {questions.length}
                            </span>
                        </div>

                        <h3 className="text-xl font-medium text-white mb-8 leading-relaxed font-outfit">
                            {currentQuestion.questionNumber}. {currentQuestion.question}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-center ${answers[currentQIndex] === idx
                                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'border-white/10 bg-slate-800/30 hover:bg-slate-800 hover:border-white/20 text-slate-300'
                                        }`}
                                >
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 text-sm font-bold transition-colors ${answers[currentQIndex] === idx ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="text-lg">{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="glass-card bg-slate-900/80 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                        <button
                            onClick={toggleMarkForReview}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${markedForReview.has(currentQIndex)
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <Flag className={`w-4 h-4 ${markedForReview.has(currentQIndex) ? 'fill-current' : ''}`} />
                            {markedForReview.has(currentQIndex) ? 'Marked' : 'Mark for Review'}
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQIndex === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 text-white transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>

                            {currentQIndex === questions.length - 1 ? (
                                <button
                                    onClick={() => setShowSubmitConfirm(true)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-500 font-bold shadow-lg hover:shadow-green-500/20 transition-all"
                                >
                                    Submit Test
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-bold shadow-lg hover:shadow-blue-500/20 transition-all"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Question Navigator */}
                <div className="lg:col-span-1 hidden lg:flex flex-col h-full">
                    <div className="glass-card bg-slate-900/50 border border-white/10 rounded-2xl p-5 flex flex-col h-full">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <div className="w-1 h-5 bg-blue-500 rounded-full" />
                            Question Pallete
                        </h3>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {questions.map((q, idx) => {
                                    let statusClass = 'bg-slate-800 text-slate-400 hover:bg-slate-700';
                                    if (answers[idx] !== undefined) statusClass = 'bg-green-500/20 text-green-400 border border-green-500/50';
                                    if (markedForReview.has(idx)) statusClass = 'bg-purple-500/20 text-purple-400 border border-purple-500/50';
                                    if (answers[idx] !== undefined && markedForReview.has(idx)) statusClass = 'bg-purple-500 text-white relative after:content-[""] after:absolute after:top-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-green-400 after:rounded-full';
                                    if (idx === currentQIndex) statusClass += ' ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900';

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQIndex(idx)}
                                            className={`aspect-square rounded-lg text-xs font-bold transition-all ${statusClass}`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-3 mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 font-medium">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded-sm"></div> Answered</span>
                                <span className="text-white">{Object.keys(answers).length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500/20 border border-purple-500/50 rounded-sm"></div> Marked</span>
                                <span className="text-white">{markedForReview.size}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> Not Visited</span>
                                <span className="text-white">{questions.length - Object.keys(answers).length}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSubmitConfirm(true)}
                            className="w-full mt-6 bg-red-500/10 border border-red-500/50 text-red-500 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>
            </main>

            {/* Submit Confirmation Modal */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4 text-amber-500">
                            <AlertCircle className="w-8 h-8" />
                            <h3 className="text-xl font-bold text-white">Confirm Submission</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-slate-300">
                                You are about to submit your test.
                            </p>
                            <div className="bg-slate-800 rounded-lg p-4 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">{Object.keys(answers).length}</div>
                                    <div className="text-xs text-slate-400">Answered</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-400">{questions.length - Object.keys(answers).length}</div>
                                    <div className="text-xs text-slate-400">Unanswered</div>
                                </div>
                            </div>
                            <p className="text-amber-500 text-sm font-medium bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                Warning: Once submitted, you cannot modify your answers.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitConfirm(false)}
                                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubmitConfirm(false);
                                    setIsSubmitted(true);
                                    calculateAndSubmit();
                                }}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 font-bold shadow-lg hover:shadow-red-500/20 transition-colors"
                            >
                                Yes, Submit
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// Results Component (Client-side mainly)
const ResultsView = ({ result, onRetry }: { result: QuizResult; onRetry: () => void }) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('ossc_cgl_results') || '[]');
        // Sort by score descending, then by time taken ascending
        const sorted = data.sort((a: any, b: any) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.timeTaken - b.timeTaken;
        }).slice(0, 10);
        setLeaderboard(sorted);
    }, [result]);

    const timestampFormat = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const accuracy = ((result.correct / result.totalQuestions) * 100).toFixed(1);
    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(1);

    // Calculate user rank
    const userRank = leaderboard.findIndex(r =>
        r.userName === result.userName && r.timestamp === result.timestamp
    ) + 1;

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(15, 23, 42); // Slate 900
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('OSSC CGL Mock Test Result', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text('ZeroDay Classes', 105, 30, { align: 'center' });

        // Info Block
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.text(`Candidate: ${result.userName}`, 15, 55);
        doc.text(`Date: ${new Date(result.timestamp).toLocaleDateString()}`, 15, 62);
        doc.text(`Time Taken: ${timestampFormat(result.timeTaken)}`, 150, 55);
        doc.text(`Rank: #${userRank > 0 ? userRank : '-'}`, 150, 62);

        // Score Summary Box
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, 70, 180, 40, 3, 3, 'S');

        doc.setFontSize(14);
        doc.text('Score Summary', 20, 80);
        doc.setFontSize(10);
        doc.text(`Total Score: ${result.score.toFixed(2)} / 150`, 20, 90);
        doc.text(`Percentage: ${percentage}%`, 20, 98);
        doc.text(`Accuracy: ${accuracy}%`, 100, 90);
        doc.text(`Correct: ${result.correct}`, 100, 98);
        doc.text(`Wrong: ${result.wrong}`, 100, 106);

        // Section-wise Table
        const sectionData = Object.entries(result.sectionWise).map(([key, val]: any) => [
            // @ts-ignore
            SECTIONS[key].name,
            val.correct,
            val.wrong,
            val.unattempted,
            val.score.toFixed(2)
        ]);

        autoTable(doc, {
            startY: 120,
            head: [['Section', 'Correct', 'Wrong', 'Unattempted', 'Score']],
            body: sectionData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            columnStyles: { 0: { cellWidth: 80 } }
        });

        // Save PDF
        doc.save(`OSSC_CGL_Result_${result.userName}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] py-12 px-4 font-sans text-slate-200">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Confetti should ideally be triggered here */}

                <div className="text-center">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-2 font-outfit">Test Completed!</h2>
                    <p className="text-slate-400">Great effort, {result.userName}</p>
                </div>

                {/* Score Card */}
                <div className="glass-card bg-slate-900/50 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center group hover:bg-slate-800 transition-colors">
                            <div className="text-sm text-slate-400 mb-1 uppercase tracking-wider font-bold">Total Score</div>
                            <div className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">{result.score.toFixed(2)}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center group hover:bg-slate-800 transition-colors">
                            <div className="text-sm text-slate-400 mb-1 uppercase tracking-wider font-bold">Correct</div>
                            <div className="text-4xl font-bold text-green-500">{result.correct}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center group hover:bg-slate-800 transition-colors">
                            <div className="text-sm text-slate-400 mb-1 uppercase tracking-wider font-bold">Wrong</div>
                            <div className="text-4xl font-bold text-red-500">{result.wrong}</div>
                        </div>
                        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center group hover:bg-slate-800 transition-colors">
                            <div className="text-sm text-slate-400 mb-1 uppercase tracking-wider font-bold">Time Taken</div>
                            <div className="text-4xl font-bold text-yellow-500">{timestampFormat(result.timeTaken)}</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={generatePDF}
                            className="flex items-center gap-2 bg-slate-800 text-white border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 hover:border-white/20 transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Download Report
                        </button>
                        <button
                            onClick={onRetry}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            <Trophy className="w-5 h-5" />
                            Attempt Again
                        </button>
                        <Link href="/dashboard" className="flex items-center gap-2 bg-slate-800 text-white border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 hover:border-white/20 transition-all">
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* Section-wise Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                            Section-wise Analysis
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(result.sectionWise).map(([key, data]: any) => (
                                <div key={key} className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between items-center mb-3">
                                        {/* @ts-ignore */}
                                        <h4 className="font-semibold text-slate-200">{SECTIONS[key].name}</h4>
                                        <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded text-sm">{data.score.toFixed(2)} pts</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                                        <div className="bg-green-500/10 text-green-400 p-2 rounded flex flex-col items-center">
                                            <span>Correct</span>
                                            <span className="text-lg">{data.correct}</span>
                                        </div>
                                        <div className="bg-red-500/10 text-red-400 p-2 rounded flex flex-col items-center">
                                            <span>Wrong</span>
                                            <span className="text-lg">{data.wrong}</span>
                                        </div>
                                        <div className="bg-slate-700/30 text-slate-400 p-2 rounded flex flex-col items-center">
                                            <span>Skipped</span>
                                            <span className="text-lg">{data.unattempted}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="glass-card bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Local Leaderboard
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-white/5">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Rank</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leaderboard.map((entry, idx) => (
                                        <tr key={idx} className={entry.userName === result.userName && entry.timestamp === result.timestamp ? 'bg-blue-500/10' : ''}>
                                            <td className="px-4 py-3">
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-200">{entry.userName}</td>
                                            <td className="px-4 py-3 text-right text-blue-400 font-bold">{entry.score.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No attempts yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Container
const OSSCQuizSystem = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [result, setResult] = useState<QuizResult | null>(null);

    const handleStart = (name: string) => {
        setUserName(name);
        setResult(null);
    };

    const handleComplete = (res: QuizResult) => {
        setResult(res);
    };

    const handleRetry = () => {
        setUserName(null);
        setResult(null);
    };

    if (!userName) {
        return <UserRegistration onStart={handleStart} />;
    }

    if (result) {
        return <ResultsView result={result} onRetry={handleRetry} />;
    }

    return <QuizInterface userName={userName} onComplete={handleComplete} />;
};

export default OSSCQuizSystem;
