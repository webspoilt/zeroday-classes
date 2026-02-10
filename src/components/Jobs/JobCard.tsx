'use client';

import React from 'react';
import { Calendar, Share2, Download, ExternalLink, Clock, Users, Building2 } from 'lucide-react';
import { JobPost } from '@/data/jobs'; // Adjust path as necessary
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const JobCard = ({ job }: { job: JobPost }) => {
    // Calculate urgency
    const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isUrgent = daysLeft <= 3 && daysLeft >= 0;
    const isExpired = daysLeft < 0;

    // Function to generate .ics file
    const addToCalendar = () => {
        const event = {
            title: `Apply for ${job.title}`,
            description: `Application deadline for ${job.organization}. Apply here: ${job.applyLink}`,
            startTime: new Date(job.lastDate).toISOString(),
            endTime: new Date(job.lastDate).toISOString(),
        };

        // Simple .ics generation logic (simplified for demo)
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
DTSTART:${event.startTime.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.endTime.replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `job-reminder-${job.id}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const shareJob = () => {
        const text = `Hey, check out this job opportunity on ZeroDay Classes: ${job.title} at ${job.organization}. Apply here: ${job.applyLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        >

            {/* Urgency Indicator Strip */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-colors",
                isUrgent ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500'
            )} />

            <div className="flex flex-col md:flex-row justify-between gap-6 pl-2">

                {/* Main Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {job.category}
                        </span>
                        {job.isNew && (
                            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md border border-green-500/20 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                NEW
                            </span>
                        )}
                        {isUrgent && (
                            <span className="text-xs font-bold px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md border border-red-500/20">
                                Closing Soon
                            </span>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                            <Building2 className="w-4 h-4" />
                            {job.organization}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-2">
                            <Clock className={cn("w-4 h-4", isUrgent ? "text-red-500" : "text-blue-500")} />
                            Last Date:
                            <span className={cn("font-semibold", isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-200')}>
                                {new Date(job.lastDate).toLocaleDateString()}
                            </span>
                        </span>
                        <span className="w-px h-4 bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            Vacancies:
                            <span className="font-semibold text-slate-900 dark:text-slate-200">
                                {job.vacancies || "N/A"}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row md:flex-col justify-center gap-3 min-w-[160px]">
                    <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                    >
                        Apply Now <ExternalLink className="w-4 h-4" />
                    </a>

                    {job.notificationPdf && (
                        <a
                            href={job.notificationPdf}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-all"
                        >
                            <Download className="w-4 h-4" /> PDF
                        </a>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={addToCalendar}
                            title="Add to Calendar"
                            className="flex-1 flex items-center justify-center p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Calendar className="w-5 h-5" />
                        </button>
                        <button
                            onClick={shareJob}
                            title="Share via WhatsApp"
                            className="flex-1 flex items-center justify-center p-2.5 bg-green-50 dark:bg-slate-800 text-green-600 dark:text-green-500 hover:bg-green-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-green-200 dark:border-green-900/30"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
