"use strict";
// Supabase-backed Job data store
// All CRUD operations go through Supabase PostgreSQL
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = getJobs;
exports.addJob = addJob;
exports.updateJob = updateJob;
exports.deleteJob = deleteJob;
const supabase_1 = require("./supabase");
const jobs_1 = require("@/data/jobs");
function rowToJob(row) {
    return {
        id: row.id,
        title: row.title,
        organization: row.organization,
        postDate: row.post_date,
        lastDate: row.last_date,
        vacancies: row.vacancies ?? undefined,
        qualification: row.qualification ?? undefined,
        category: row.category,
        applyLink: row.apply_link,
        notificationPdf: row.notification_pdf ?? undefined,
        isNew: row.is_new,
    };
}
// ─── Read ────────────────────────────────────────
async function getJobs() {
    const { data, error } = await supabase_1.supabase
        .from('job_posts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
        // Fallback to hardcoded mock data if DB is empty or unavailable
        return jobs_1.JOB_DATA;
    }
    return data.map(rowToJob);
}
// ─── Create ──────────────────────────────────────
async function addJob(job) {
    const { data, error } = await supabase_1.supabase
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
async function updateJob(id, updates) {
    const dbUpdates = {};
    if (updates.title !== undefined)
        dbUpdates.title = updates.title;
    if (updates.organization !== undefined)
        dbUpdates.organization = updates.organization;
    if (updates.lastDate !== undefined)
        dbUpdates.last_date = updates.lastDate;
    if (updates.vacancies !== undefined)
        dbUpdates.vacancies = updates.vacancies;
    if (updates.qualification !== undefined)
        dbUpdates.qualification = updates.qualification;
    if (updates.category !== undefined)
        dbUpdates.category = updates.category;
    if (updates.applyLink !== undefined)
        dbUpdates.apply_link = updates.applyLink;
    if (updates.notificationPdf !== undefined)
        dbUpdates.notification_pdf = updates.notificationPdf;
    if (updates.isNew !== undefined)
        dbUpdates.is_new = updates.isNew;
    const { error } = await supabase_1.supabase
        .from('job_posts')
        .update(dbUpdates)
        .eq('id', id);
    if (error)
        console.error('Error updating job:', error);
    return !error;
}
// ─── Delete ──────────────────────────────────────
async function deleteJob(id) {
    const { error } = await supabase_1.supabase
        .from('job_posts')
        .delete()
        .eq('id', id);
    if (error)
        console.error('Error deleting job:', error);
    return !error;
}
