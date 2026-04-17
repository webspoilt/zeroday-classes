import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    // ID from the user's log
    const testId = '9e75f5dc-f023-4b73-b0f4-c42df37d81a5';

    const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('test_id', testId);

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Test ID: ${testId}`);
    console.log(`Total Questions: ${count}`);

    // Check for explicit duplicates (same question text)
    const { data: questions } = await supabase
        .from('questions')
        .select('question')
        .eq('test_id', testId);

    if (questions && count !== null) {
        const unique = new Set(questions.map(q => q.question)).size;
        console.log(`Unique Questions: ${unique}`);
        if (count > unique) {
            console.log(`⚠️ DETECTED ${count - unique} DUPLICATES!`);
        } else {
            console.log("✅ No duplicates found.");
        }
    }
}

check();
