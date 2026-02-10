"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TerminalHero = () => {
    const text = "> init zero_day_sequence...";
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(text.slice(0, i));
            i++;
            if (i > text.length) {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-xl sm:text-2xl md:text-3xl text-primary font-bold">
            {displayText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-3 h-6 bg-primary ml-1 align-middle"
            />
        </div>
    );
};
