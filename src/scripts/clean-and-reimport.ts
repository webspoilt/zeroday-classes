import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

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

async function cleanAndImport() {
    const testId = '9e75f5dc-f023-4b73-b0f4-c42df37d81a5';
    console.log(`🧹 Cleaning questions for Test ID: ${testId}`);

    // Delete existing questions for this test
    const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('test_id', testId);

    if (deleteError) {
        console.error('Error deleting:', deleteError);
        return;
    }
    console.log('✅ Deleted existing questions.');

    // Re-read bulk_data.json and import
    console.log('📂 Reading bulk_data.json...');
    const dataPath = resolve(__dirname, '../../bulk_data.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const importData = JSON.parse(rawData);

    // Filter questions for this test if needed, but bulk_data.json only has Test 3 right now.
    // Confirm title matches just in case
    if (!importData.testTitle.includes("Mock Test 3")) {
        console.warn("Warning: bulk_data.json title does not match expected Test 3. Proceeding anyway with ID injection.");
    }

    console.log('📥 Re-inserting questions...');
    const questionRows = importData.questions.map((q: any, i: number) => ({
        test_id: testId,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation || '',
        sort_order: i
    }));

    const { error: insertError } = await supabase.from('questions').insert(questionRows);

    if (insertError) {
        console.error('Error inserting:', insertError);
    } else {
        console.log(`✅ Successfully re-imported ${questionRows.length} questions.`);
    }
}

cleanAndImport();
