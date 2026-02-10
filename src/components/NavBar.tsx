"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-foreground font-heading tracking-tighter">
                            ZERODAY<span className="text-primary">.</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="hover:text-primary transition-colors px-3 py-2 rounded-md font-medium">Home</Link>
                            <Link href="/dashboard" className="hover:text-primary transition-colors px-3 py-2 rounded-md font-medium">Dashboard</Link>
                            <Link href="/courses" className="hover:text-primary transition-colors px-3 py-2 rounded-md font-medium">Courses</Link>
                            <Link href="/mock-test/odisha-history" className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all px-4 py-2 rounded-full font-medium">
                                Try Mock Test
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden glass-card border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-white/5">Home</Link>
                        <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-white/5">Dashboard</Link>
                        <Link href="/courses" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-white/5">Courses</Link>
                        <Link href="/mock-test/odisha-history" className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-primary/10">Try Mock Test</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
