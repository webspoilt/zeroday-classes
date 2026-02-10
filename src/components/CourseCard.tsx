"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CourseCardProps {
    title: string;
    description: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    price: string;
    xp: number;
    image?: string;
    href: string;
}

export const CourseCard = ({ title, description, level, price, xp, href }: CourseCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
            className="glass-card rounded-xl p-6 flex flex-col h-full relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 bg-primary/20 text-primary px-3 py-1 text-xs font-mono font-bold rounded-bl-lg">
                +{xp} XP
            </div>

            <div className="mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded border ${level === 'Beginner' ? 'border-green-500 text-green-500' :
                        level === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                            'border-red-500 text-red-500'
                    }`}>
                    {level.toUpperCase()}
                </span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                <span className="font-mono text-lg font-bold text-secondary">{price}</span>
                <Link href={href} className="flex items-center text-sm font-bold text-foreground hover:text-primary transition-colors">
                    Enroll <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>

            {/* Decorative gradient blob */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
        </motion.div>
    );
};
