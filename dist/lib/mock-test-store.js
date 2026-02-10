"use strict";
// Supabase-backed Mock Test data store
// Replaces localStorage with persistent PostgreSQL via Supabase
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockTests = getMockTests;
exports.getMockTestById = getMockTestById;
exports.addMockTest = addMockTest;
exports.updateMockTest = updateMockTest;
exports.deleteMockTest = deleteMockTest;
exports.addQuestionToTest = addQuestionToTest;
exports.updateQuestionInTest = updateQuestionInTest;
exports.deleteQuestionFromTest = deleteQuestionFromTest;
const supabase_1 = require("./supabase");
// ─── Mappers ────────────────────────────────────
function rowToTest(row, questions) {
    return {
        id: row.id,
        title: row.title,
        type: row.type,
        subject: row.subject ?? undefined,
        timeLimit: row.time_limit,
        negativeMarking: row.negative_marking,
        questions,
        isLocked: row.is_locked,
        createdAt: row.created_at,
    };
}
function rowToQuestion(row) {
    return {
        id: row.id,
        question: row.question,
        options: row.options,
        correct: row.correct,
        explanation: row.explanation ?? undefined,
    };
}
// ─── Get All Tests ──────────────────────────────
async function getMockTests() {
    const { data: tests, error: tErr } = await supabase_1.supabase
        .from('mock_tests')
        .select('*')
        .order('created_at', { ascending: true });
    if (tErr || !tests) {
        console.error('Error fetching mock tests:', tErr);
        return [];
    }
    const { data: allQs, error: qErr } = await supabase_1.supabase
        .from('questions')
        .select('*')
        .order('sort_order', { ascending: true });
    if (qErr)
        console.error('Error fetching questions:', qErr);
    const questionsMap = new Map();
    (allQs || []).forEach((qRow) => {
        const arr = questionsMap.get(qRow.test_id) || [];
        arr.push(rowToQuestion(qRow));
        questionsMap.set(qRow.test_id, arr);
    });
    return tests.map((t) => rowToTest(t, questionsMap.get(t.id) || []));
}
// ─── Get Single Test ────────────────────────────
async function getMockTestById(id) {
    const { data: test, error: tErr } = await supabase_1.supabase
        .from('mock_tests')
        .select('*')
        .eq('id', id)
        .single();
    if (tErr || !test)
        return null;
    const { data: qs } = await supabase_1.supabase
        .from('questions')
        .select('*')
        .eq('test_id', id)
        .order('sort_order', { ascending: true });
    return rowToTest(test, (qs || []).map(rowToQuestion));
}
// ─── Add Test ───────────────────────────────────
async function addMockTest(test) {
    const { data, error } = await supabase_1.supabase
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
async function updateMockTest(id, updates) {
    const dbUpdates = {};
    if (updates.title !== undefined)
        dbUpdates.title = updates.title;
    if (updates.type !== undefined)
        dbUpdates.type = updates.type;
    if (updates.subject !== undefined)
        dbUpdates.subject = updates.subject;
    if (updates.timeLimit !== undefined)
        dbUpdates.time_limit = updates.timeLimit;
    if (updates.negativeMarking !== undefined)
        dbUpdates.negative_marking = updates.negativeMarking;
    if (updates.isLocked !== undefined)
        dbUpdates.is_locked = updates.isLocked;
    const { error } = await supabase_1.supabase.from('mock_tests').update(dbUpdates).eq('id', id);
    if (error)
        console.error('Error updating test:', error);
    return !error;
}
// ─── Delete Test ────────────────────────────────
async function deleteMockTest(id) {
    // Questions cascade-deleted via FK
    const { error } = await supabase_1.supabase.from('mock_tests').delete().eq('id', id);
    if (error)
        console.error('Error deleting test:', error);
    return !error;
}
// ─── Add Question ───────────────────────────────
async function addQuestionToTest(testId, q) {
    // Get highest sort_order for this test
    const { data: lastQ } = await supabase_1.supabase
        .from('questions')
        .select('sort_order')
        .eq('test_id', testId)
        .order('sort_order', { ascending: false })
        .limit(1);
    const nextOrder = lastQ && lastQ.length > 0 ? (lastQ[0].sort_order || 0) + 1 : 0;
    const { data, error } = await supabase_1.supabase
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
async function updateQuestionInTest(_testId, questionId, updates) {
    const dbUpdates = {};
    if (updates.question !== undefined)
        dbUpdates.question = updates.question;
    if (updates.options !== undefined)
        dbUpdates.options = updates.options;
    if (updates.correct !== undefined)
        dbUpdates.correct = updates.correct;
    if (updates.explanation !== undefined)
        dbUpdates.explanation = updates.explanation;
    const { error } = await supabase_1.supabase.from('questions').update(dbUpdates).eq('id', questionId);
    if (error)
        console.error('Error updating question:', error);
    return !error;
}
// ─── Delete Question ────────────────────────────
async function deleteQuestionFromTest(_testId, questionId) {
    const { error } = await supabase_1.supabase.from('questions').delete().eq('id', questionId);
    if (error)
        console.error('Error deleting question:', error);
    return !error;
}
