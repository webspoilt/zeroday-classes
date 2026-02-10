// Supabase-backed Mock Test data store
// Replaces localStorage with persistent PostgreSQL via Supabase

import { supabase } from './supabase';

// ─── Types ──────────────────────────────────────
export interface Question {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
}

export interface MockTest {
    id: string;
    title: string;
    type: 'full' | 'subject' | 'premium';
    subject?: string;
    timeLimit: number;
    negativeMarking: number;
    questions: Question[];
    isLocked: boolean;
    createdAt: string;
}

// ─── DB Row Types ───────────────────────────────
interface TestRow {
    id: string;
    title: string;
    type: string;
    subject: string | null;
    time_limit: number;
    negative_marking: number;
    is_locked: boolean;
    created_at: string;
}

interface QuestionRow {
    id: string;
    test_id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string | null;
    sort_order: number;
}

// ─── Mappers ────────────────────────────────────
function rowToTest(row: TestRow, questions: Question[]): MockTest {
    return {
        id: row.id,
        title: row.title,
        type: row.type as MockTest['type'],
        subject: row.subject ?? undefined,
        timeLimit: row.time_limit,
        negativeMarking: row.negative_marking,
        questions,
        isLocked: row.is_locked,
        createdAt: row.created_at,
    };
}

function rowToQuestion(row: QuestionRow): Question {
    return {
        id: row.id,
        question: row.question,
        options: row.options,
        correct: row.correct,
        explanation: row.explanation ?? undefined,
    };
}

// ─── Get All Tests ──────────────────────────────
export async function getMockTests(): Promise<MockTest[]> {
    const { data: tests, error: tErr } = await supabase
        .from('mock_tests')
        .select('*')
        .order('created_at', { ascending: true });

    if (tErr || !tests) {
        console.error('Error fetching mock tests:', tErr);
        return [];
    }

    const { data: allQs, error: qErr } = await supabase
        .from('questions')
        .select('*')
        .order('sort_order', { ascending: true });

    if (qErr) console.error('Error fetching questions:', qErr);

    const questionsMap = new Map<string, Question[]>();
    (allQs || []).forEach((qRow: QuestionRow) => {
        const arr = questionsMap.get(qRow.test_id) || [];
        arr.push(rowToQuestion(qRow));
        questionsMap.set(qRow.test_id, arr);
    });

    return tests.map((t: TestRow) => rowToTest(t, questionsMap.get(t.id) || []));
}

// ─── Get Single Test ────────────────────────────
export async function getMockTestById(id: string): Promise<MockTest | null> {
    const { data: test, error: tErr } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('id', id)
        .single();

    if (tErr || !test) return null;

    const { data: qs } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', id)
        .order('sort_order', { ascending: true });

    return rowToTest(test, (qs || []).map(rowToQuestion));
}

// ─── Add Test ───────────────────────────────────
export async function addMockTest(test: Omit<MockTest, 'id' | 'createdAt'>): Promise<MockTest | null> {
    const { data, error } = await supabase
        .from('mock_tests')
        .insert({
            title: test.title,
            type: test.type,
            subject: test.subject ?? null,
            time_limit: test.timeLimit,
            negative_marking: test.negativeMarking,
            is_locked: test.isLocked,
        })
        .select()
        .single();

    if (error || !data) {
        console.error('Error adding test:', error);
        return null;
    }
    return rowToTest(data, []);
}

// ─── Update Test ────────────────────────────────
export async function updateMockTest(id: string, updates: Partial<MockTest>): Promise<boolean> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.subject !== undefined) dbUpdates.subject = updates.subject;
    if (updates.timeLimit !== undefined) dbUpdates.time_limit = updates.timeLimit;
    if (updates.negativeMarking !== undefined) dbUpdates.negative_marking = updates.negativeMarking;
    if (updates.isLocked !== undefined) dbUpdates.is_locked = updates.isLocked;

    const { error } = await supabase.from('mock_tests').update(dbUpdates).eq('id', id);
    if (error) console.error('Error updating test:', error);
    return !error;
}

// ─── Delete Test ────────────────────────────────
export async function deleteMockTest(id: string): Promise<boolean> {
    // Questions cascade-deleted via FK
    const { error } = await supabase.from('mock_tests').delete().eq('id', id);
    if (error) console.error('Error deleting test:', error);
    return !error;
}

// ─── Add Question ───────────────────────────────
export async function addQuestionToTest(testId: string, q: Omit<Question, 'id'>): Promise<Question | null> {
    // Get highest sort_order for this test
    const { data: lastQ } = await supabase
        .from('questions')
        .select('sort_order')
        .eq('test_id', testId)
        .order('sort_order', { ascending: false })
        .limit(1);

    const nextOrder = lastQ && lastQ.length > 0 ? (lastQ[0].sort_order || 0) + 1 : 0;

    const { data, error } = await supabase
        .from('questions')
        .insert({
            test_id: testId,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation || '',
            sort_order: nextOrder,
        })
        .select()
        .single();

    if (error || !data) {
        console.error('Error adding question:', error);
        return null;
    }
    return rowToQuestion(data);
}

// ─── Update Question ────────────────────────────
export async function updateQuestionInTest(_testId: string, questionId: string, updates: Partial<Question>): Promise<boolean> {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.question !== undefined) dbUpdates.question = updates.question;
    if (updates.options !== undefined) dbUpdates.options = updates.options;
    if (updates.correct !== undefined) dbUpdates.correct = updates.correct;
    if (updates.explanation !== undefined) dbUpdates.explanation = updates.explanation;

    const { error } = await supabase.from('questions').update(dbUpdates).eq('id', questionId);
    if (error) console.error('Error updating question:', error);
    return !error;
}

// ─── Delete Question ────────────────────────────
export async function deleteQuestionFromTest(_testId: string, questionId: string): Promise<boolean> {
    const { error } = await supabase.from('questions').delete().eq('id', questionId);
    if (error) console.error('Error deleting question:', error);
    return !error;
}
