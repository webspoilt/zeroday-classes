import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

// 1. Setup Environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables. Make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 2. Read Bulk Data
async function runImport() {
    try {
        console.log('📂 Reading bulk_data.json...');
        const dataPath = resolve(__dirname, '../../bulk_data.json');

        try {
            await fs.access(dataPath);
        } catch {
            throw new Error('bulk_data.json not found in project root!');
        }

        const rawData = await fs.readFile(dataPath, 'utf-8');
        const importData = JSON.parse(rawData);

        console.log(`📝 Found test: "${importData.testTitle}" with ${importData.questions.length} questions.`);

        // 3. Create or Update Test
        console.log('🔄 Syncing Mock Test...');

        // Check if test exists
        const { data: existingTests } = await supabase
            .from('mock_tests')
            .select('id')
            .eq('title', importData.testTitle)
            .limit(1);

        let testId;

        if (existingTests && existingTests.length > 0) {
            testId = existingTests[0].id;
            console.log(`   → Updating existing test (ID: ${testId})`);
            // Update metadata just in case
            await supabase.from('mock_tests').update({
                subject: importData.subject,
                time_limit: importData.timeLimit,
                negative_marking: importData.negativeMarking
            }).eq('id', testId);
        } else {
            console.log(`   → Creating new test...`);
            const { data: newTest, error } = await supabase.from('mock_tests').insert({
                title: importData.testTitle,
                type: 'subject', // Defaulting to subject type for imports
                subject: importData.subject,
                time_limit: importData.timeLimit,
                negative_marking: importData.negativeMarking || 0.25,
                is_locked: false
            }).select().single();

            if (error) throw new Error(`Failed to create test: ${error.message}`);
            testId = newTest.id;
        }

        // 4. Insert Questions
        console.log('📥 Inserting questions...');

        const questionRows = importData.questions.map((q: any, i: number) => ({
            test_id: testId,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation || '',
            sort_order: i
        }));

        // We aren't deleting old questions to avoid data loss, just appending new ones.
        // You might want to delete old ones if you want a "replace" behavior.

        const { error: qError } = await supabase.from('questions').insert(questionRows);

        if (qError) throw new Error(`Failed to insert questions: ${qError.message}`);

        console.log(`✅ Successfully imported ${questionRows.length} questions into "${importData.testTitle}"!`);

    } catch (err: any) {
        console.error(`❌ Error: ${err.message}`);
    }
}

runImport();
