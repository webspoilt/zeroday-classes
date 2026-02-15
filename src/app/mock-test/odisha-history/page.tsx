"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabaseClient";
import questions from "@/data/odisha-history.json";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Save } from "lucide-react";
import Link from "next/link"; // Import Link component

export default function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        if (selectedOption === currentQuestion.answer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
            saveScore();
        }
    };

    const saveScore = async () => {
        setIsSaving(true);
        try {
            // Check if Supabase URL is configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.warn("Supabase URL not configured. Skipping save.");
                setSaveStatus("error"); // Or just ignore silently
                setIsSaving(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error } = await supabase
                    .from('exam_results')
                    .insert([
                        {
                            user_id: user.id,
                            exam_name: 'Odisha History',
                            score: score + (selectedOption === currentQuestion.answer ? 1 : 0),
                            total_questions: questions.length
                        },
                    ]);

                if (error) throw error;
                setSaveStatus("success");
            } else {
                console.log("User not logged in, skipping save.");
                setSaveStatus("idle");
            }
        } catch (error) {
            console.error("Error saving score:", error);
            setSaveStatus("error");
        } finally {
            setIsSaving(false);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
        setSaveStatus("idle");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    {!showResult ? (
                        <div className="glass-card p-8 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold font-heading text-primary">Odisha History Challenge</h1>
                                    <p className="text-muted-foreground text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
                                </div>
                                <div className="text-xl font-mono font-bold text-secondary">
                                    Score: {score}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
                                <motion.div
                                    className="bg-primary h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl md:text-2xl font-bold mb-6">{currentQuestion.question}</h2>
                                <div className="space-y-4">
                                    {currentQuestion.options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`w-full p-4 rounded-xl text-left transition-all border ${selectedOption === option
                                                ? "bg-primary/20 border-primary text-primary font-bold shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                                                : "bg-white/5 border-white/10 hover:bg-white/10 text-foreground"
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-6 h-6 rounded-full border mr-4 flex items-center justify-center ${selectedOption === option ? "border-primary" : "border-white/30"
                                                    }`}>
                                                    {selectedOption === option && <div className="w-3 h-3 bg-primary rounded-full" />}
                                                </div>
                                                {option}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={!selectedOption}
                                    className={`px-8 py-3 rounded-full font-bold flex items-center transition-all ${selectedOption
                                        ? "bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                                        : "bg-white/5 text-white/30 cursor-not-allowed"
                                        }`}
                                >
                                    {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next Question"}
                                    <ArrowRight className="ml-2" size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-10 rounded-2xl border border-white/10 text-center"
                        >
                            <h1 className="text-4xl font-bold font-heading mb-6">Quiz Completed!</h1>

                            <div className="flex justify-center mb-8">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                        <motion.circle
                                            cx="50" cy="50" r="45"
                                            fill="none"
                                            stroke="#00ff9d"
                                            strokeWidth="10"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * (score / questions.length))}
                                            transform="rotate(-90 50 50)"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * (score / questions.length)) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold">{Math.round((score / questions.length) * 100)}%</span>
                                        <span className="text-xs text-muted-foreground">Accuracy</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-2xl mb-8">
                                You scored <span className="text-primary font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={restartQuiz}
                                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center transition-colors"
                                >
                                    <RefreshCw className="mr-2" size={20} />
                                    Try Again
                                </button>
                                <Link href="/" className="px-6 py-3 rounded-full bg-primary text-black font-bold flex items-center hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,255,157,0.3)]">
                                    Back to Home
                                </Link>
                            </div>

                            {saveStatus === 'success' && (
                                <div className="mt-6 flex items-center justify-center text-green-400 text-sm">
                                    <CheckCircle className="mr-2" size={16} /> Score saved to profile
                                </div>
                            )}
                            {saveStatus === 'error' && (
                                <div className="mt-6 flex items-center justify-center text-red-400 text-sm">
                                    <XCircle className="mr-2" size={16} /> Could not save score (Not logged in or config missing)
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
