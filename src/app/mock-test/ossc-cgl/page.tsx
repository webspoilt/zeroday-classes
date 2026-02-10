import { Metadata } from 'next';
import OSSCQuizSystem from '@/components/OSSCQuiz/QuizSystem';

export const metadata: Metadata = {
    title: 'OSSC CGL Mock Test | ZeroDay Classes',
    description: 'Full-length OSSC CGL Mock Test with 150 questions covering Math, Reasoning, DI, Computer, Odisha GK, and Current Affairs.',
};

export default function OSSCCGLMockTestPage() {
    return <OSSCQuizSystem />;
}
