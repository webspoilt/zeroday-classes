import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'jobs.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const jobs = JSON.parse(fileData);

        return NextResponse.json(jobs, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('Error reading jobs.json:', error);
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
}
