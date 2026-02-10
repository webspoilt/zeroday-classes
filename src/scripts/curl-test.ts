import dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Missing env vars');
    process.exit(1);
}

const tableUrl = `${url}/rest/v1/mock_tests`;
const data = JSON.stringify({
    title: 'Curl Test Mock Test',
    type: 'premium',
    time_limit: 120,
    negative_marking: 0.25,
    is_locked: true
});

// Escape single quotes for Windows PowerShell
const escapedData = data.replace(/"/g, '\\"');

const command = `curl -X POST "${tableUrl}" -H "apikey: ${key}" -H "Authorization: Bearer ${key}" -H "Content-Type: application/json" -H "Prefer: return=representation" -d "${escapedData}"`;

console.log("Executing curl command to:", tableUrl);

try {
    const output = execSync(command, { stdio: 'pipe' }).toString();
    console.log("Curl Output:", output);
} catch (e: any) {
    console.error("Curl failed:", e.message);
    if (e.stdout) console.log("Stdout:", e.stdout.toString());
    if (e.stderr) console.error("Stderr:", e.stderr.toString());
}
