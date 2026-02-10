'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, adminLogout } from '@/lib/admin-auth';
import { getJobs, addJob, updateJob, deleteJob } from '@/lib/job-store';
import { JobPost } from '@/data/jobs';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Briefcase, LogOut, Plus, Trash2, Edit3, Save, X,
    ChevronDown, AlertTriangle, CheckCircle, ExternalLink, Shield
} from 'lucide-react';

const CATEGORIES = ['OSSC', 'OPSC', 'Railway', 'Bank', 'Police', 'Teaching', 'Other'] as const;

// ─── Job Form (Add / Edit) ────────────────────────────────────
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

    const inputClass = "w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm";
    const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider";

    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-5"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{initial ? '✏️ Edit Job Post' : '➕ Add New Job Post'}</h3>
                <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
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
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className={inputClass}>
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
                    <input type="checkbox" id="isNew" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50" />
                    <label htmlFor="isNew" className="text-sm text-slate-300 font-medium cursor-pointer">Mark as "NEW"</label>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/20">
                    <Save className="w-4 h-4" /> {initial ? 'Update Job' : 'Add Job'}
                </button>
                <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors">
                    Cancel
                </button>
            </div>
        </motion.form>
    );
};

// ─── Main Admin Dashboard ──────────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState<JobPost | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!isAdminLoggedIn()) {
            router.replace('/admin/login');
            return;
        }
        setJobs(getJobs());
    }, [router]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleAdd = (data: Omit<JobPost, 'id' | 'postDate'>) => {
        addJob(data);
        setJobs(getJobs());
        setShowForm(false);
        showToast('✅ Job post added successfully!');
    };

    const handleUpdate = (data: Omit<JobPost, 'id' | 'postDate'>) => {
        if (!editingJob) return;
        updateJob(editingJob.id, data);
        setJobs(getJobs());
        setEditingJob(null);
        showToast('✅ Job post updated!');
    };

    const handleDelete = (id: string) => {
        deleteJob(id);
        setJobs(getJobs());
        setDeleteConfirm(null);
        showToast('🗑️ Job post deleted.');
    };

    const handleLogout = () => {
        adminLogout();
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/80 border-r border-white/5 p-6 flex flex-col h-screen sticky top-0 shrink-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                        <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white font-outfit">Admin</h2>
                        <p className="text-xs text-slate-500">ZeroDay Classes</p>
                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    <a href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-600/10 text-blue-400 font-medium text-sm border border-blue-500/10">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </a>
                    <a href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm transition-colors">
                        <Briefcase className="w-4 h-4" /> Job Posts
                    </a>
                </nav>

                <div className="pt-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 font-medium text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Toast */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 right-6 z-50 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-outfit">Job Posts Manager</h1>
                        <p className="text-slate-500 mt-1">Add, edit, or remove job alerts for the Odisha Career Center.</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditingJob(null); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5" /> Add New Job
                    </button>
                </div>

                {/* Stats Bar */}
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
                            {jobs.filter(j => {
                                const daysLeft = Math.ceil((new Date(j.lastDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                return daysLeft <= 3 && daysLeft >= 0;
                            }).length}
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

                {/* Add / Edit Form */}
                <AnimatePresence>
                    {(showForm || editingJob) && (
                        <div className="mb-8">
                            <JobForm
                                initial={editingJob}
                                onSave={editingJob ? handleUpdate : handleAdd}
                                onCancel={() => { setShowForm(false); setEditingJob(null); }}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Jobs Table */}
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
                                    const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                    const isExpired = daysLeft < 0;
                                    const isUrgent = daysLeft <= 3 && !isExpired;

                                    return (
                                        <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-white max-w-xs truncate">{job.title}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{job.organization}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded text-slate-300">{job.category}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-medium ${isUrgent ? 'text-red-400' : isExpired ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                                                    {new Date(job.lastDate).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {isExpired ? (
                                                    <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-500 rounded">Expired</span>
                                                ) : job.isNew ? (
                                                    <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">NEW</span>
                                                ) : (
                                                    <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Active</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingJob(job); setShowForm(false); }}
                                                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={job.applyLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                                                        title="Open link"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                    {deleteConfirm === job.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(job.id)}
                                                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-400 transition-colors text-xs font-bold"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(job.id)}
                                                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {jobs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                            No job posts yet. Click "Add New Job" to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
