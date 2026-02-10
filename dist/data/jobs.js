"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_DATA = void 0;
exports.JOB_DATA = [
    {
        id: '1',
        title: 'Junior Assistant Recruitment 2024',
        organization: 'Odisha Staff Selection Commission (OSSC)',
        postDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days left (Urgent)
        vacancies: 156,
        qualification: 'Any Graduate',
        category: 'OSSC',
        applyLink: 'https://ossc.gov.in',
        notificationPdf: 'https://ossc.gov.in/notification.pdf',
        isNew: true
    },
    {
        id: '2',
        title: 'Assistant Section Officer (ASO)',
        organization: 'Odisha Public Service Commission (OPSC)',
        postDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days left
        vacancies: 796,
        qualification: 'Graduation',
        category: 'OPSC',
        applyLink: 'https://opsc.gov.in',
        isNew: false
    },
    {
        id: '3',
        title: 'Sub-Inspector of Police',
        organization: 'Odisha Police Recruitment Board',
        postDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
        vacancies: 477,
        qualification: 'Graduation',
        category: 'Police',
        applyLink: 'https://odishapolice.gov.in',
        notificationPdf: '#',
        isNew: true
    },
    {
        id: '4',
        title: 'Assistant Loco Pilot (ALP)',
        organization: 'Railway Recruitment Board (RRB)',
        postDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day left (Urgent)
        vacancies: 5696,
        qualification: 'Matriculation + ITI',
        category: 'Railway',
        applyLink: 'https://indianrailways.gov.in',
        isNew: false
    },
    {
        id: '5',
        title: 'Probationary Officer (PO)',
        organization: 'State Bank of India',
        postDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
        vacancies: 2000,
        qualification: 'Graduation',
        category: 'Bank',
        applyLink: 'https://sbi.co.in',
        isNew: true
    }
];
