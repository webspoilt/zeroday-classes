'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import COMPLETE_QUESTION_BANK from '@/data/ossc-cgl';
import { JOB_DATA } from '@/data/jobs';
import { ArrowLeft, Database, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const SUBJECT_META: Record<string, { title: string; subject: string; time: number }> = {
    MATH: { title: 'Mathematics Practice', subject: 'Mathematics', time: 30 },
    REASONING: { title: 'Reasoning Ability Practice', subject: 'Reasoning', time: 25 },
    DI: { title: 'Data Interpretation Practice', subject: 'DI', time: 20 },
    COMPUTER: { title: 'Computer Knowledge Practice', subject: 'Computer', time: 20 },
    ODISHA_GK: { title: 'Odisha GK Practice', subject: 'Odisha GK', time: 25 },
    CURRENT_AFFAIRS: { title: 'Current Affairs Practice', subject: 'Current Affairs', time: 20 },
};

export default function SeedPage() {
    const router = useRouter();
    const [status, setStatus] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);

    const log = (msg: string) => setStatus(prev => [...prev, msg]);

    const seed = async () => {
        if (!isAdminLoggedIn()) {
            router.replace('/admin/login');
            return;
        }
        setRunning(true);
        setStatus([]);

        try {
            // ─── 1. Seed Job Posts ─────────────────────
            log('📋 Seeding job posts...');
            const { data: existingJobs } = await supabase.from('job_posts').select('id').limit(1);
            if (existingJobs && existingJobs.length > 0) {
                log('⏩ Job posts already exist, skipping.');
            } else {
                const jobRows = JOB_DATA.map(j => ({
                    title: j.title,
                    organization: j.organization,
                    post_date: j.postDate,
                    last_date: j.lastDate,
                    vacancies: j.vacancies ?? null,
                    qualification: j.qualification ?? null,
                    category: j.category,
                    apply_link: j.applyLink,
                    notification_pdf: j.notificationPdf ?? null,
                    is_new: j.isNew,
                }));
                const { error } = await supabase.from('job_posts').insert(jobRows);
                if (error) throw new Error(`Job insert failed: ${error.message}`);
                log(`✅ Inserted ${jobRows.length} job posts.`);
            }

            // ─── 2. Seed Mock Tests ───────────────────
            log('📝 Seeding mock tests...');
            const { data: existingTests } = await supabase.from('mock_tests').select('id').limit(1);
            if (existingTests && existingTests.length > 0) {
                log('⏩ Mock tests already exist, skipping.');
            } else {
                // All questions combined
                const allQuestions = Object.values(COMPLETE_QUESTION_BANK).flat();

                // Full-Length Test
                log('  → Creating full-length test...');
                const { data: fullTestData, error: ftErr } = await supabase
                    .from('mock_tests')
                    .insert({ title: 'OSSC CGL Full Mock Test 1', type: 'full', time_limit: 120, negative_marking: 0.25, is_locked: false })
                    .select();

                if (ftErr || !fullTestData || fullTestData.length === 0) throw new Error(`Full test insert failed: ${ftErr?.message || 'No data returned'}`);
                const fullTest = fullTestData[0];

                const fullQRows = allQuestions.map((q, i) => ({
                    test_id: fullTest.id,
                    question: q.question,
                    options: q.options,
                    correct: q.correct,
                    explanation: q.explanation || '',
                    sort_order: i,
                }));
                // Insert in batches of 50
                for (let i = 0; i < fullQRows.length; i += 50) {
                    const batch = fullQRows.slice(i, i + 50);
                    const { error } = await supabase.from('questions').insert(batch);
                    if (error) throw new Error(`Question batch insert failed: ${error.message}`);
                }
                log(`  ✅ Full-length test: ${allQuestions.length} questions`);

                // Subject-wise Tests
                for (const [key, questions] of Object.entries(COMPLETE_QUESTION_BANK)) {
                    const meta = SUBJECT_META[key];
                    if (!meta) continue;
                    log(`  → Creating ${meta.subject} test...`);

                    const { data: subTestData, error: stErr } = await supabase
                        .from('mock_tests')
                        .insert({ title: meta.title, type: 'subject', subject: meta.subject, time_limit: meta.time, negative_marking: 0.25, is_locked: false })
                        .select();

                    if (stErr || !subTestData || subTestData.length === 0) {
                        log(`⚠️ Skipped ${meta.subject}: ${stErr?.message || 'No data'}`);
                        continue;
                    }
                    const subTest = subTestData[0];

                    const qArr = (questions as Array<{ question: string; options: string[]; correct: number; explanation?: string }>);
                    const subQRows = qArr.map((q, i) => ({
                        test_id: subTest.id,
                        question: q.question,
                        options: q.options,
                        correct: q.correct,
                        explanation: q.explanation || '',
                        sort_order: i,
                    }));
                    const { error } = await supabase.from('questions').insert(subQRows);
                    if (error) throw new Error(`Subject question insert failed: ${error.message}`);
                    log(`  ✅ ${meta.subject}: ${qArr.length} questions`);
                }

                // Premium placeholder tests
                log('  → Creating premium placeholder tests...');
                await supabase.from('mock_tests').insert([
                    { title: 'OSSC CGL Mock Test 2 (Premium)', type: 'premium', time_limit: 120, negative_marking: 0.25, is_locked: true },
                    { title: 'OSSSC RI Mock Test (Premium)', type: 'premium', time_limit: 90, negative_marking: 0.25, is_locked: true },
                ]);
                log('  ✅ Premium placeholder tests created.');
            }

            log('');
            log('🎉 Seed complete! All data is now in Supabase.');
            setDone(true);
        } catch (err) {
            log(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Back to Admin</Link>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><Database className="w-6 h-6 text-blue-400" /></div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Seed Supabase Database</h1>
                            <p className="text-sm text-slate-500">Populate with existing 150 questions + job data</p>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-400">
                            <strong>One-time setup.</strong> Only run this once to populate your database. If data already exists, it will be skipped.
                        </div>
                    </div>

                    {!running && !done && (
                        <button onClick={seed} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                            <Database className="w-5 h-5" /> Run Seed Script
                        </button>
                    )}

                    {running && (
                        <div className="flex items-center gap-2 text-blue-400 mb-4 font-medium">
                            <Loader2 className="w-5 h-5 animate-spin" /> Seeding in progress...
                        </div>
                    )}

                    {done && (
                        <div className="flex items-center gap-2 text-green-400 mb-4 font-medium">
                            <CheckCircle className="w-5 h-5" /> Seed complete!
                        </div>
                    )}

                    {status.length > 0 && (
                        <div className="mt-4 bg-slate-950 rounded-xl p-4 font-mono text-sm max-h-[400px] overflow-y-auto space-y-1">
                            {status.map((line, i) => (
                                <div key={i} className={line.startsWith('❌') ? 'text-red-400' : line.startsWith('✅') ? 'text-green-400' : line.startsWith('⏩') ? 'text-yellow-400' : line.startsWith('🎉') ? 'text-green-300 font-bold' : 'text-slate-400'}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    )}

                    {done && (
                        <div className="mt-6 flex gap-3">
                            <Link href="/mock-test" className="flex-1 text-center py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all">
                                View Mock Tests →
                            </Link>
                            <Link href="/admin" className="flex-1 text-center py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all">
                                Admin Panel
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
