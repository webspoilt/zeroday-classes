// localStorage-based Mock Test data store
// Admin creates tests here, frontend reads from it

import COMPLETE_QUESTION_BANK from '@/data/ossc-cgl';

// ─── Types ─────────────────────────────────────────────
export interface Question {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface MockTest {
    id: string;
    title: string;
    type: 'full' | 'subject' | 'premium';
    subject?: string;
    timeLimit: number;       // minutes
    negativeMarking: number; // e.g. 0.25
    questions: Question[];
    isLocked: boolean;
    createdAt: string;
}

const STORE_KEY = 'zeroday_mock_tests';
const SEEDED_KEY = 'zeroday_mock_tests_seeded';

// ─── Seed default tests from existing question bank ────
function buildDefaultTests(): MockTest[] {
    const subjects = [
        { key: 'MATH', label: 'Mathematics', id: 'subject-math' },
        { key: 'REASONING', label: 'Reasoning', id: 'subject-reasoning' },
        { key: 'DI', label: 'Data Interpretation', id: 'subject-di' },
        { key: 'COMPUTER', label: 'Computer Knowledge', id: 'subject-computer' },
        { key: 'ODISHA_GK', label: 'Odisha GK', id: 'subject-odisha-gk' },
        { key: 'CURRENT_AFFAIRS', label: 'Current Affairs', id: 'subject-current-affairs' },
    ];

    // Full mock test with all questions
    const allQuestions: Question[] = [];
    for (const s of subjects) {
        const bank = COMPLETE_QUESTION_BANK[s.key as keyof typeof COMPLETE_QUESTION_BANK] as Question[];
        allQuestions.push(...bank);
    }

    const fullTest: MockTest = {
        id: 'ossc-cgl-full-1',
        title: 'OSSC CGL Full Mock Test 1',
        type: 'full',
        timeLimit: 120,
        negativeMarking: 0.25,
        questions: allQuestions,
        isLocked: false,
        createdAt: new Date().toISOString(),
    };

    // Subject-wise tests
    const subjectTests: MockTest[] = subjects.map(s => {
        const questions = COMPLETE_QUESTION_BANK[s.key as keyof typeof COMPLETE_QUESTION_BANK] as Question[];
        return {
            id: s.id,
            title: `${s.label} Practice`,
            type: 'subject' as const,
            subject: s.label,
            timeLimit: 30,
            negativeMarking: 0,
            questions,
            isLocked: false,
            createdAt: new Date().toISOString(),
        };
    });

    // Premium placeholder tests
    const premiumTests: MockTest[] = [
        {
            id: 'premium-ossc-cgl-2',
            title: 'OSSC CGL Mock Test 2 (Premium)',
            type: 'premium',
            timeLimit: 120,
            negativeMarking: 0.25,
            questions: [],
            isLocked: true,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'premium-osssc-ri',
            title: 'OSSSC RI Mock Test (Premium)',
            type: 'premium',
            timeLimit: 90,
            negativeMarking: 0.25,
            questions: [],
            isLocked: true,
            createdAt: new Date().toISOString(),
        },
    ];

    return [fullTest, ...subjectTests, ...premiumTests];
}

// ─── Store Operations ──────────────────────────────────
function ensureSeeded() {
    if (typeof window === 'undefined') return;
    const seeded = localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
        const defaults = buildDefaultTests();
        localStorage.setItem(STORE_KEY, JSON.stringify(defaults));
        localStorage.setItem(SEEDED_KEY, 'true');
    }
}

export function getMockTests(): MockTest[] {
    if (typeof window === 'undefined') return buildDefaultTests();
    ensureSeeded();
    try {
        const stored = localStorage.getItem(STORE_KEY);
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return buildDefaultTests();
}

export function getMockTestById(id: string): MockTest | undefined {
    return getMockTests().find(t => t.id === id);
}

export function saveMockTests(tests: MockTest[]) {
    localStorage.setItem(STORE_KEY, JSON.stringify(tests));
}

export function addMockTest(test: Omit<MockTest, 'id' | 'createdAt'>): MockTest {
    const tests = getMockTests();
    const newTest: MockTest = {
        ...test,
        id: `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
    };
    tests.push(newTest);
    saveMockTests(tests);
    return newTest;
}

export function updateMockTest(id: string, updates: Partial<MockTest>) {
    const tests = getMockTests();
    const idx = tests.findIndex(t => t.id === id);
    if (idx !== -1) {
        tests[idx] = { ...tests[idx], ...updates };
        saveMockTests(tests);
    }
}

export function deleteMockTest(id: string) {
    const tests = getMockTests().filter(t => t.id !== id);
    saveMockTests(tests);
}

// Question-level operations on a specific test
export function addQuestionToTest(testId: string, question: Omit<Question, 'id'>): Question {
    const tests = getMockTests();
    const test = tests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');
    const newQ: Question = {
        ...question,
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    };
    test.questions.push(newQ);
    saveMockTests(tests);
    return newQ;
}

export function updateQuestionInTest(testId: string, questionId: string, updates: Partial<Question>) {
    const tests = getMockTests();
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    const qi = test.questions.findIndex(q => q.id === questionId);
    if (qi !== -1) {
        test.questions[qi] = { ...test.questions[qi], ...updates };
        saveMockTests(tests);
    }
}

export function deleteQuestionFromTest(testId: string, questionId: string) {
    const tests = getMockTests();
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    test.questions = test.questions.filter(q => q.id !== questionId);
    saveMockTests(tests);
}
