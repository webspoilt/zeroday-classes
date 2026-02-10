'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, adminLogout } from '@/lib/admin-auth';
import { getJobs, addJob, updateJob, deleteJob } from '@/lib/job-store';
import {
    getMockTests, addMockTest, updateMockTest, deleteMockTest,
    addQuestionToTest, updateQuestionInTest, deleteQuestionFromTest,
    MockTest, Question
} from '@/lib/mock-test-store';
import { JobPost } from '@/data/jobs';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, LogOut, Plus, Trash2, Edit3, Save, X,
    CheckCircle, ExternalLink, Shield,
    Target, Eye, ArrowLeft, Lock, Unlock
} from 'lucide-react';

const CATEGORIES = ['OSSC', 'OPSC', 'Railway', 'Bank', 'Police', 'Teaching', 'Other'] as const;
const inputClass = "w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm";
const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";

// ─── Job Form ──────────────────────────────────────────
interface JobFormProps {
    initial?: JobPost | null;
    onSave: (data: Omit<JobPost, 'id' | 'postDate'>) => void;
    onCancel: () => void;
}

const JobForm = ({ initial, onSave, onCancel }: JobFormProps) => {
    const [form, setForm] = useState({
        title: initial?.title || '',
        organization: initial?.organization || '',
        lastDate: initial?.lastDate ? new Date(initial.lastDate).toISOString().split('T')[0] : '',
        vacancies: initial?.vacancies?.toString() || '',
        qualification: initial?.qualification || '',
        category: initial?.category || 'OSSC' as JobPost['category'],
        applyLink: initial?.applyLink || '',
        notificationPdf: initial?.notificationPdf || '',
        isNew: initial?.isNew ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title: form.title,
            organization: form.organization,
            lastDate: new Date(form.lastDate).toISOString(),
            vacancies: form.vacancies ? parseInt(form.vacancies) : undefined,
            qualification: form.qualification || undefined,
            category: form.category as JobPost['category'],
            applyLink: form.applyLink,
            notificationPdf: form.notificationPdf || undefined,
            isNew: form.isNew,
        });
    };

    return (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{initial ? '✏️ Edit Job Post' : '➕ Add New Job Post'}</h3>
                <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={labelClass}>Job Title *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Junior Assistant Recruitment 2024" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Organization *</label>
                    <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="e.g. OSSC" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as JobPost['category'] })} className={inputClass}>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Last Date to Apply *</label>
                    <input type="date" value={form.lastDate} onChange={(e) => setForm({ ...form, lastDate: e.target.value })} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Vacancies</label>
                    <input type="number" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: e.target.value })} placeholder="e.g. 500" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Qualification</label>
                    <input type="text" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="e.g. Any Graduate" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Apply Link (URL) *</label>
                    <input type="url" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} placeholder="https://ossc.gov.in/apply" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Notification PDF (URL)</label>
                    <input type="url" value={form.notificationPdf} onChange={(e) => setForm({ ...form, notificationPdf: e.target.value })} placeholder="https://..." className={inputClass} />
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="isNew" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600" />
                    <label htmlFor="isNew" className="text-sm text-slate-300 font-medium cursor-pointer">Mark as &quot;NEW&quot;</label>
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"><Save className="w-4 h-4" /> {initial ? 'Update Job' : 'Add Job'}</button>
                <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700">Cancel</button>
            </div>
        </motion.form>
    );
};

// ─── Question Form ─────────────────────────────────────
interface QFormProps {
    initial?: Question | null;
    onSave: (data: Omit<Question, 'id'>) => void;
    onCancel: () => void;
}

const QuestionForm = ({ initial, onSave, onCancel }: QFormProps) => {
    const [question, setQuestion] = useState(initial?.question || '');
    const [options, setOptions] = useState<string[]>(initial?.options || ['', '', '', '']);
    const [correct, setCorrect] = useState(initial?.correct ?? 0);
    const [explanation, setExplanation] = useState(initial?.explanation || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (options.some(o => !o.trim())) return alert('All 4 options are required');
        onSave({ question, options, correct, explanation });
    };

    return (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
            className="bg-slate-800/50 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{initial ? '✏️ Edit Question' : '➕ Add Question'}</h3>
                <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div>
                <label className={labelClass}>Question *</label>
                <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} placeholder="Enter the question text..." className={`${inputClass} resize-none`} required />
            </div>

            <div className="space-y-3">
                <label className={labelClass}>Options * (select the correct one)</label>
                {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} className="w-4 h-4 text-green-500 border-slate-600 bg-slate-800" />
                        <span className="text-xs font-bold text-slate-500 w-5">{String.fromCharCode(65 + i)}</span>
                        <input type="text" value={opt} onChange={(e) => { const n = [...options]; n[i] = e.target.value; setOptions(n); }} placeholder={`Option ${String.fromCharCode(65 + i)}`} className={inputClass} required />
                        {correct === i && <span className="text-xs font-bold text-green-400 shrink-0">✓ Correct</span>}
                    </div>
                ))}
            </div>

            <div>
                <label className={labelClass}>Solution / Explanation</label>
                <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} placeholder="Explain why the answer is correct..." className={`${inputClass} resize-none`} />
            </div>

            <div className="flex gap-3 pt-2">
                <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 text-sm"><Save className="w-4 h-4" /> {initial ? 'Update Question' : 'Add Question'}</button>
                <button type="button" onClick={onCancel} className="px-5 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 text-sm">Cancel</button>
            </div>
        </motion.form>
    );
};

// ─── Mock Test Manager View ────────────────────────────
function MockTestManager({ showToast }: { showToast: (msg: string) => void }) {
    const [tests, setTests] = useState<MockTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [showTestForm, setShowTestForm] = useState(false);
    const [editingTest, setEditingTest] = useState<MockTest | null>(null);
    const [showQForm, setShowQForm] = useState(false);
    const [editingQ, setEditingQ] = useState<Question | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteQConfirm, setDeleteQConfirm] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        const data = await getMockTests();
        setTests(data);
        setLoading(false);
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const selectedTest = tests.find(t => t.id === selectedTestId);

    // ─── Test List View ─────────────────────
    if (!selectedTestId) {
        return (
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-outfit">Mock Tests Manager</h1>
                        <p className="text-slate-500 mt-1">Create tests, add questions — data saved to Supabase cloud.</p>
                    </div>
                    <button onClick={() => { setShowTestForm(true); setEditingTest(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg">
                        <Plus className="w-5 h-5" /> New Mock Test
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">{tests.length}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Total Tests</div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{tests.filter(t => t.type === 'full').length}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Full Length</div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">{tests.filter(t => t.type === 'subject').length}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Subject Tests</div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{tests.filter(t => t.type === 'premium').length}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase font-bold">Premium</div>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full" />
                    </div>
                )}

                {/* New Test Form */}
                <AnimatePresence>
                    {showTestForm && (
                        <div className="mb-8">
                            <TestMetaForm
                                initial={editingTest}
                                onSave={async (data) => {
                                    if (editingTest) {
                                        await updateMockTest(editingTest.id, data);
                                        showToast('✅ Test updated!');
                                    } else {
                                        await addMockTest({
                                            title: data.title || '',
                                            type: data.type || 'full',
                                            subject: data.subject,
                                            timeLimit: data.timeLimit || 120,
                                            negativeMarking: data.negativeMarking || 0.25,
                                            questions: [],
                                            isLocked: false,
                                        });
                                        showToast('✅ Mock test created! Now add questions.');
                                    }
                                    await refresh();
                                    setShowTestForm(false);
                                    setEditingTest(null);
                                }}
                                onCancel={() => { setShowTestForm(false); setEditingTest(null); }}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Tests Table */}
                {!loading && (
                    <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-white/5">
                                <tr>
                                    <th className="px-5 py-3.5 text-left">Test Name</th>
                                    <th className="px-5 py-3.5 text-center">Type</th>
                                    <th className="px-5 py-3.5 text-center">Questions</th>
                                    <th className="px-5 py-3.5 text-center">Time</th>
                                    <th className="px-5 py-3.5 text-center">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tests.map(test => (
                                    <tr key={test.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-white">{test.title}</div>
                                            {test.subject && <div className="text-xs text-slate-500 mt-0.5">{test.subject}</div>}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${test.type === 'full' ? 'bg-green-500/10 text-green-400' : test.type === 'subject' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{test.type.toUpperCase()}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center font-bold text-white">{test.questions.length}</td>
                                        <td className="px-5 py-4 text-center text-slate-400">{test.timeLimit} min</td>
                                        <td className="px-5 py-4 text-center">
                                            {test.isLocked
                                                ? <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-500 rounded">🔒 Locked</span>
                                                : <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-400 rounded">Active</span>}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedTestId(test.id)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10" title="Manage Questions"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => { setEditingTest(test); setShowTestForm(true); }} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10" title="Edit"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={async () => { await updateMockTest(test.id, { isLocked: !test.isLocked }); await refresh(); showToast(test.isLocked ? '🔓 Test unlocked!' : '🔒 Test locked!'); }}
                                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10" title={test.isLocked ? 'Unlock' : 'Lock'}>
                                                    {test.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                                </button>
                                                {deleteConfirm === test.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={async () => { await deleteMockTest(test.id); await refresh(); setDeleteConfirm(null); showToast('🗑️ Test deleted.'); }} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400 text-xs font-bold">Confirm</button>
                                                        <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setDeleteConfirm(test.id)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tests.length === 0 && !loading && (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No mock tests yet. Click &quot;New Mock Test&quot; to create one.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    // ─── Question Manager View (inside a test) ──
    return (
        <div>
            <button onClick={() => { setSelectedTestId(null); refresh(); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to All Tests
            </button>

            {selectedTest && (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white font-outfit">{selectedTest.title}</h1>
                            <p className="text-slate-500 mt-1">{selectedTest.questions.length} questions • {selectedTest.timeLimit} min • neg marking: -{selectedTest.negativeMarking}</p>
                        </div>
                        <button onClick={() => { setShowQForm(true); setEditingQ(null); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg">
                            <Plus className="w-5 h-5" /> Add Question
                        </button>
                    </div>

                    <AnimatePresence>
                        {(showQForm || editingQ) && (
                            <div className="mb-6">
                                <QuestionForm
                                    initial={editingQ}
                                    onSave={async (data) => {
                                        if (editingQ) {
                                            await updateQuestionInTest(selectedTest.id, editingQ.id, data);
                                            showToast('✅ Question updated!');
                                        } else {
                                            await addQuestionToTest(selectedTest.id, data);
                                            showToast('✅ Question added!');
                                        }
                                        await refresh();
                                        setShowQForm(false);
                                        setEditingQ(null);
                                    }}
                                    onCancel={() => { setShowQForm(false); setEditingQ(null); }}
                                />
                            </div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-3">
                        {selectedTest.questions.map((q, i) => (
                            <div key={q.id} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Q{i + 1}</span>
                                        </div>
                                        <p className="text-sm font-medium text-white mb-2">{q.question}</p>
                                        <div className="grid grid-cols-2 gap-1 text-xs">
                                            {q.options.map((opt, oi) => (
                                                <div key={oi} className={`px-2 py-1 rounded ${oi === q.correct ? 'bg-green-500/10 text-green-400 font-bold' : 'text-slate-500'}`}>
                                                    {String.fromCharCode(65 + oi)}. {opt} {oi === q.correct && '✓'}
                                                </div>
                                            ))}
                                        </div>
                                        {q.explanation && <div className="text-xs text-slate-500 mt-2 bg-white/5 rounded-lg px-3 py-1.5">💡 {q.explanation}</div>}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => { setEditingQ(q); setShowQForm(false); }} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"><Edit3 className="w-3.5 h-3.5" /></button>
                                        {deleteQConfirm === q.id ? (
                                            <div className="flex items-center gap-1">
                                                <button onClick={async () => { await deleteQuestionFromTest(selectedTest.id, q.id); await refresh(); setDeleteQConfirm(null); showToast('🗑️ Question deleted.'); }} className="p-1.5 rounded-lg bg-red-500 text-white text-xs font-bold">Yes</button>
                                                <button onClick={() => setDeleteQConfirm(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setDeleteQConfirm(q.id)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {selectedTest.questions.length === 0 && (
                            <div className="text-center py-16 text-slate-500">No questions yet. Click &quot;Add Question&quot; to get started.</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Test Meta Form ────────────────────────────────────
interface TestMetaFormProps {
    initial?: MockTest | null;
    onSave: (data: Partial<MockTest>) => void;
    onCancel: () => void;
}

const TestMetaForm = ({ initial, onSave, onCancel }: TestMetaFormProps) => {
    const [title, setTitle] = useState(initial?.title || '');
    const [type, setType] = useState<MockTest['type']>(initial?.type || 'full');
    const [subject, setSubject] = useState(initial?.subject || '');
    const [timeLimit, setTimeLimit] = useState(initial?.timeLimit?.toString() || '120');
    const [negativeMarking, setNegativeMarking] = useState(initial?.negativeMarking?.toString() || '0.25');

    return (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={(e) => { e.preventDefault(); onSave({ title, type, subject: subject || undefined, timeLimit: parseInt(timeLimit), negativeMarking: parseFloat(negativeMarking) }); }}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{initial ? '✏️ Edit Test' : '➕ Create Mock Test'}</h3>
                <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={labelClass}>Test Title *</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. OSSC CGL Mock Test 2" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Type *</label>
                    <select value={type} onChange={(e) => setType(e.target.value as MockTest['type'])} className={inputClass}>
                        <option value="full">Full Length</option>
                        <option value="subject">Subject-wise</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
                {type === 'subject' && (
                    <div>
                        <label className={labelClass}>Subject Name</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" className={inputClass} />
                    </div>
                )}
                <div>
                    <label className={labelClass}>Time Limit (minutes) *</label>
                    <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Negative Marking (per wrong answer)</label>
                    <input type="number" step="0.05" value={negativeMarking} onChange={(e) => setNegativeMarking(e.target.value)} className={inputClass} />
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"><Save className="w-4 h-4" /> {initial ? 'Update Test' : 'Create Test'}</button>
                <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700">Cancel</button>
            </div>
        </motion.form>
    );
};

// ─── Main Admin Dashboard ──────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'jobs' | 'tests'>('jobs');
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState<JobPost | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const refreshJobs = useCallback(async () => {
        const data = await getJobs();
        setJobs(data);
    }, []);

    useEffect(() => {
        if (!isAdminLoggedIn()) {
            router.replace('/admin/login');
            return;
        }
        refreshJobs();
    }, [router, refreshJobs]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAdd = async (data: Omit<JobPost, 'id' | 'postDate'>) => {
        await addJob(data);
        await refreshJobs();
        setShowForm(false);
        showToast('✅ Job post added successfully!');
    };

    const handleUpdate = async (data: Omit<JobPost, 'id' | 'postDate'>) => {
        if (!editingJob) return;
        await updateJob(editingJob.id, data);
        await refreshJobs();
        setEditingJob(null);
        showToast('✅ Job post updated!');
    };

    const handleDelete = async (id: string) => {
        await deleteJob(id);
        await refreshJobs();
        setDeleteConfirm(null);
        showToast('🗑️ Job post deleted.');
    };

    const handleLogout = () => {
        adminLogout();
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex">
            <aside className="w-64 bg-slate-900/80 border-r border-white/5 p-6 flex flex-col h-screen sticky top-0 shrink-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20"><Shield className="w-5 h-5 text-red-400" /></div>
                    <div>
                        <h2 className="text-lg font-bold text-white font-outfit">Admin</h2>
                        <p className="text-xs text-slate-500">ZeroDay Classes</p>
                    </div>
                </div>
                <nav className="space-y-1 flex-1">
                    <button onClick={() => setActiveTab('jobs')} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'jobs' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Briefcase className="w-4 h-4" /> Job Posts
                    </button>
                    <button onClick={() => setActiveTab('tests')} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'tests' ? 'bg-green-600/10 text-green-400 border border-green-500/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Target className="w-4 h-4" /> Mock Tests
                    </button>
                </nav>
                <div className="pt-4 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 font-medium text-sm transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <AnimatePresence>
                    {toast && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 right-6 z-50 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeTab === 'tests' && <MockTestManager showToast={showToast} />}

                {activeTab === 'jobs' && (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white font-outfit">Job Posts Manager</h1>
                                <p className="text-slate-500 mt-1">Add, edit, or remove job alerts — saved to Supabase cloud.</p>
                            </div>
                            <button onClick={() => { setShowForm(true); setEditingJob(null); }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg">
                                <Plus className="w-5 h-5" /> Add New Job
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{jobs.length}</div>
                                <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Total Posts</div>
                            </div>
                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">{jobs.filter(j => j.isNew).length}</div>
                                <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Marked New</div>
                            </div>
                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-red-400">
                                    {jobs.filter(j => { const d = Math.ceil((new Date(j.lastDate).getTime() - Date.now()) / 86400000); return d <= 3 && d >= 0; }).length}
                                </div>
                                <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Closing Soon</div>
                            </div>
                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-slate-400">
                                    {jobs.filter(j => new Date(j.lastDate).getTime() < Date.now()).length}
                                </div>
                                <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Expired</div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {(showForm || editingJob) && (
                                <div className="mb-8">
                                    <JobForm initial={editingJob} onSave={editingJob ? handleUpdate : handleAdd} onCancel={() => { setShowForm(false); setEditingJob(null); }} />
                                </div>
                            )}
                        </AnimatePresence>

                        <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-white/5">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left">Title</th>
                                            <th className="px-5 py-3.5 text-left">Category</th>
                                            <th className="px-5 py-3.5 text-left">Last Date</th>
                                            <th className="px-5 py-3.5 text-center">Status</th>
                                            <th className="px-5 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {jobs.map(job => {
                                            const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - Date.now()) / 86400000);
                                            const isExpired = daysLeft < 0;
                                            const isUrgent = daysLeft <= 3 && !isExpired;
                                            return (
                                                <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="font-medium text-white max-w-xs truncate">{job.title}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5">{job.organization}</div>
                                                    </td>
                                                    <td className="px-5 py-4"><span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded text-slate-300">{job.category}</span></td>
                                                    <td className="px-5 py-4"><span className={`font-medium ${isUrgent ? 'text-red-400' : isExpired ? 'text-slate-600 line-through' : 'text-slate-300'}`}>{new Date(job.lastDate).toLocaleDateString()}</span></td>
                                                    <td className="px-5 py-4 text-center">
                                                        {isExpired ? <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-500 rounded">Expired</span>
                                                            : job.isNew ? <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">NEW</span>
                                                                : <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Active</span>}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => { setEditingJob(job); setShowForm(false); }} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10" title="Edit"><Edit3 className="w-4 h-4" /></button>
                                                            <a href={job.applyLink} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-green-400 hover:bg-green-500/10" title="Open link"><ExternalLink className="w-4 h-4" /></a>
                                                            {deleteConfirm === job.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <button onClick={() => handleDelete(job.id)} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400 text-xs font-bold">Confirm</button>
                                                                    <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => setDeleteConfirm(job.id)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {jobs.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No job posts yet. Click &quot;Add New Job&quot; to get started.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
