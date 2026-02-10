// Supabase-backed Job data store
// All CRUD operations go through Supabase PostgreSQL

import { supabase } from './supabase';
import { JobPost, JOB_DATA } from '@/data/jobs';

// ─── Mapper: DB row → JobPost ────────────────────
interface JobRow {
    id: string;
    title: string;
    organization: string;
    post_date: string;
    last_date: string;
    vacancies: number | null;
    qualification: string | null;
    category: string;
    apply_link: string;
    notification_pdf: string | null;
    is_new: boolean;
}

function rowToJob(row: JobRow): JobPost {
    return {
        id: row.id,
        title: row.title,
        organization: row.organization,
        postDate: row.post_date,
        lastDate: row.last_date,
        vacancies: row.vacancies ?? undefined,
        qualification: row.qualification ?? undefined,
        category: row.category as JobPost['category'],
        applyLink: row.apply_link,
        notificationPdf: row.notification_pdf ?? undefined,
        isNew: row.is_new,
    };
}

// ─── Read ────────────────────────────────────────
export async function getJobs(): Promise<JobPost[]> {
    const { data, error } = await supabase
        .from('job_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
        // Fallback to hardcoded mock data if DB is empty or unavailable
        return JOB_DATA;
    }
    return data.map(rowToJob);
}

// ─── Create ──────────────────────────────────────
export async function addJob(job: Omit<JobPost, 'id' | 'postDate'>): Promise<JobPost | null> {
    const { data, error } = await supabase
        .from('job_posts')
        .insert({
            title: job.title,
            organization: job.organization,
            last_date: job.lastDate,
            vacancies: job.vacancies ?? null,
            qualification: job.qualification ?? null,
            category: job.category,
            apply_link: job.applyLink,
            notification_pdf: job.notificationPdf ?? null,
            is_new: job.isNew,
        })
        .select()
        .single();

    if (error || !data) {
        console.error('Error adding job:', error);
        return null;
    }
    return rowToJob(data);
}

// ─── Update ──────────────────────────────────────
export async function updateJob(id: string, updates: Partial<JobPost>): Promise<boolean> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.organization !== undefined) dbUpdates.organization = updates.organization;
    if (updates.lastDate !== undefined) dbUpdates.last_date = updates.lastDate;
    if (updates.vacancies !== undefined) dbUpdates.vacancies = updates.vacancies;
    if (updates.qualification !== undefined) dbUpdates.qualification = updates.qualification;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.applyLink !== undefined) dbUpdates.apply_link = updates.applyLink;
    if (updates.notificationPdf !== undefined) dbUpdates.notification_pdf = updates.notificationPdf;
    if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;

    const { error } = await supabase
        .from('job_posts')
        .update(dbUpdates)
        .eq('id', id);

    if (error) console.error('Error updating job:', error);
    return !error;
}

// ─── Delete ──────────────────────────────────────
export async function deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('job_posts')
        .delete()
        .eq('id', id);

    if (error) console.error('Error deleting job:', error);
    return !error;
}
