'use client';

import React, { useState, useEffect } from 'react';
import { JobPost } from '@/data/jobs';
import { getJobs } from '@/lib/job-store';
import JobCard from '@/components/Jobs/JobCard';
import { Filter, Search, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'OSSC', 'OPSC', 'Railway', 'Bank', 'Police'];

export default function OdishaJobsPage() {
    const [allJobs, setAllJobs] = useState<JobPost[]>([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getJobs().then(setAllJobs);
    }, []);

    // Filter Logic
    const filteredJobs = allJobs.filter(job => {
        const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.organization.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort by Newest First
    const sortedJobs = [...filteredJobs].sort((a, b) =>
        new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f172a] to-[#0f172a] -z-10" />
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-6"
                    >
                        <Briefcase className="w-4 h-4" /> Odisha Career Center
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-outfit tracking-tight"
                    >
                        Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Government Job</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        Latest OSSC, OPSC, Railway, and Banking updates curated daily. Never miss an opportunity with our smart alerts.
                    </motion.p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="glass-card bg-slate-900/50 border border-white/10 rounded-xl p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
                                <Filter className="w-5 h-5 text-blue-500" /> Filters
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Category</label>
                                    <div className="space-y-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setFilterCategory(cat)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center group",
                                                    filterCategory === cat
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                )}
                                            >
                                                {cat}
                                                {filterCategory === cat && <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Feed */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search jobs by title or organization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        {/* Job List */}
                        <div className="space-y-4">
                            {sortedJobs.length > 0 ? (
                                sortedJobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">No jobs found</h3>
                                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
