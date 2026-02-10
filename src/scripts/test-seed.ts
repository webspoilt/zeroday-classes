import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { JOB_DATA } from '../data/jobs';
import COMPLETE_QUESTION_BANK from '../data/ossc-cgl/index';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log("Supabase Client Initialized");

(async () => {
    try {
        console.log("Job Data Length:", JOB_DATA.length);
        console.log("Question Bank Keys:", Object.keys(COMPLETE_QUESTION_BANK));

        const { count, error } = await supabase.from('job_posts').select('*', { count: 'exact', head: true });
        if (error) {
            console.error("Select Error:", error);
        } else {
            console.log("Job Posts Count:", count);
        }
    } catch (err) {
        console.error("Execution Error:", err);
    }
})();
