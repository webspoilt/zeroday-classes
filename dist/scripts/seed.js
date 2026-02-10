"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const jobs_1 = require("../data/jobs");
const index_1 = __importDefault(require("../data/ossc-cgl/index"));
// Load environment variables from .env.local
// process.cwd() is safe to use here because we expect to run this from the project root
dotenv_1.default.config({ path: (0, path_1.resolve)(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
console.log("Supabase Client Initialized");
const SUBJECT_META = {
    MATH: { title: 'Mathematics Practice', subject: 'Mathematics', time: 30 },
    REASONING: { title: 'Reasoning Ability Practice', subject: 'Reasoning', time: 25 },
    DI: { title: 'Data Interpretation Practice', subject: 'DI', time: 20 },
    COMPUTER: { title: 'Computer Knowledge Practice', subject: 'Computer', time: 20 },
    ODISHA_GK: { title: 'Odisha GK Practice', subject: 'Odisha GK', time: 25 },
    CURRENT_AFFAIRS: { title: 'Current Affairs Practice', subject: 'Current Affairs', time: 20 },
};
async function seed() {
    console.log('🌱 Starting seed process...');
    try {
        // ─── 1. Seed Job Posts ─────────────────────
        console.log('📋 Seeding job posts...');
        const { data: existingJobs } = await supabase.from('job_posts').select('id').limit(1);
        if (existingJobs && existingJobs.length > 0) {
            console.log('⏩ Job posts already exist, skipping.');
        }
        else {
            const jobRows = jobs_1.JOB_DATA.map((j) => ({
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
            if (error)
                throw new Error(`Job insert failed: ${error.message}`);
            console.log(`✅ Inserted ${jobRows.length} job posts.`);
        }
        // ─── 2. Seed Mock Tests ───────────────────
        console.log('📝 Seeding mock tests...');
        const { data: existingTests } = await supabase.from('mock_tests').select('id').limit(1);
        if (existingTests && existingTests.length > 0) {
            console.log('⏩ Mock tests already exist, skipping.');
        }
        else {
            // All questions combined
            const allQuestions = Object.values(index_1.default).flat();
            // Full-Length Test
            console.log('  → Creating full-length test...');
            const { data: fullTestData, error: ftErr } = await supabase
                .from('mock_tests')
                .insert({ title: 'OSSC CGL Full Mock Test 1', type: 'full', time_limit: 120, negative_marking: 0.25, is_locked: false })
                .select();
            if (ftErr || !fullTestData || fullTestData.length === 0)
                throw new Error(`Full test insert failed: ${ftErr?.message || 'No data returned'}`);
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
                if (error)
                    throw new Error(`Question batch insert failed: ${error.message}`);
            }
            console.log(`  ✅ Full-length test: ${allQuestions.length} questions`);
            // Subject-wise Tests
            for (const [key, questions] of Object.entries(index_1.default)) {
                const meta = SUBJECT_META[key];
                if (!meta)
                    continue;
                console.log(`  → Creating ${meta.subject} test...`);
                const { data: subTestData, error: stErr } = await supabase
                    .from('mock_tests')
                    .insert({ title: meta.title, type: 'subject', subject: meta.subject, time_limit: meta.time, negative_marking: 0.25, is_locked: false })
                    .select();
                if (stErr || !subTestData || subTestData.length === 0) {
                    console.log(`⚠️ Skipped ${meta.subject}: ${stErr?.message || 'No data'}`);
                    continue;
                }
                const subTest = subTestData[0];
                const qArr = questions;
                const subQRows = qArr.map((q, i) => ({
                    test_id: subTest.id,
                    question: q.question,
                    options: q.options,
                    correct: q.correct,
                    explanation: q.explanation || '',
                    sort_order: i,
                }));
                const { error } = await supabase.from('questions').insert(subQRows);
                if (error)
                    throw new Error(`Subject question insert failed: ${error.message}`);
                console.log(`  ✅ ${meta.subject}: ${qArr.length} questions`);
            }
            // Premium placeholder tests
            console.log('  → Creating premium placeholder tests...');
            await supabase.from('mock_tests').insert([
                { title: 'OSSC CGL Mock Test 2 (Premium)', type: 'premium', time_limit: 120, negative_marking: 0.25, is_locked: true },
                { title: 'OSSSC RI Mock Test (Premium)', type: 'premium', time_limit: 90, negative_marking: 0.25, is_locked: true },
            ]);
            console.log('  ✅ Premium placeholder tests created.');
        }
        console.log('');
        console.log('🎉 Seed complete! All data is now in Supabase.');
    }
    catch (err) {
        console.error(`❌ Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
}
seed();
