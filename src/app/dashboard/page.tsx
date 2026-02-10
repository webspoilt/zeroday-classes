import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Trophy, Target, Clock, Shield } from "lucide-react";

const enrolledCourses = [
    {
        title: "Web Hacking 101",
        description: "Master the fundamentals of web application security. SQLi, XSS, and more.",
        level: "Beginner",
        price: "Enrolled",
        xp: 500,
        href: "/courses/web-hacking-101",
    },
    {
        title: "Network Penetration Testing",
        description: "Learn to exploit network vulnerabilities and secure infrastructure.",
        level: "Intermediate",
        price: "Enrolled",
        xp: 1000,
        href: "/courses/network-pentest",
    }
];

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <main className="flex-grow pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="text-primary">Hacker</span>.</h1>
                            <p className="text-muted-foreground">Your zero-day journey continues.</p>
                        </div>
                        <div className="glass-card px-6 py-3 rounded-full border border-primary/20 text-primary font-mono font-bold mt-4 md:mt-0">
                            Level 5 • 2,450 XP
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { icon: Trophy, label: "Rank", value: "#42" },
                            { icon: Target, label: "Modules Completed", value: "12" },
                            { icon: Shield, label: "Machines Pwned", value: "8" },
                            { icon: Clock, label: "Hours Hacking", value: "48h" },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 rounded-xl flex items-center space-x-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Enrolled <span className="text-secondary">Courses</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {enrolledCourses.map((course, index) => (
                            <CourseCard key={index} {...(course as any)} />
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Recent <span className="text-secondary">Certificates</span></h2>
                    <div className="glass-card p-8 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-6 mb-6 md:mb-0">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                <Trophy size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Introduction to Cyber Security</h3>
                                <p className="text-muted-foreground text-sm">Issued on Feb 10, 2026</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-bold">
                            Download PDF
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
