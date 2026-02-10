// localStorage-based Job data store
// Admin writes to localStorage, frontend reads from it (with fallback to mock data)

import { JobPost, JOB_DATA } from '@/data/jobs';

const JOBS_KEY = 'zeroday_job_posts';

export function getJobs(): JobPost[] {
    if (typeof window === 'undefined') return JOB_DATA;
    try {
        const stored = localStorage.getItem(JOBS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch { /* ignore */ }
    return JOB_DATA; // Fallback to hardcoded mock data
}

export function saveJobs(jobs: JobPost[]) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function addJob(job: Omit<JobPost, 'id' | 'postDate'>): JobPost {
    const jobs = getJobs();
    const newJob: JobPost = {
        ...job,
        id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        postDate: new Date().toISOString(),
    };
    jobs.unshift(newJob); // Add to top
    saveJobs(jobs);
    return newJob;
}

export function updateJob(id: string, updates: Partial<JobPost>) {
    const jobs = getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...updates };
        saveJobs(jobs);
    }
}

export function deleteJob(id: string) {
    const jobs = getJobs().filter(j => j.id !== id);
    saveJobs(jobs);
}
