
(async () => {
    try {
        console.log('🌱 Starting seed process...');

        // ─── 1. Seed Job Posts ─────────────────────
        console.log('📋 Seeding job posts...');
        const { data: existingJobs } = await supabase.from('job_posts').select('id').limit(1);
        if (existingJobs && existingJobs.length > 0) {
            console.log('⏩ Job posts already exist, skipping.');
        } else {
            const jobRows = JOB_DATA.map((j) => ({
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
            console.log(`✅ Inserted ${jobRows.length} job posts.`);
        }
    } catch (err) {
        console.error("Execution Error:", err);
    }
})();
