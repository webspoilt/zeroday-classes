import { NavBar } from "@/components/NavBar";
import { TerminalHero } from "@/components/TerminalHero";
import { CourseCard } from "@/components/CourseCard";
import { Footer } from "@/components/Footer";
import { ArrowRight, Shield, Terminal, Zap } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    title: "Web Hacking 101",
    description: "Master the fundamentals of web application security. SQLi, XSS, and more.",
    level: "Beginner",
    price: "$49",
    xp: 500,
    href: "/courses/web-hacking-101",
  },
  {
    title: "Network Penetration Testing",
    description: "Learn to exploit network vulnerabilities and secure infrastructure.",
    level: "Intermediate",
    price: "$99",
    xp: 1000,
    href: "/courses/network-pentest",
  },
  {
    title: "Zero-Day Research",
    description: "Advanced techniques for discovering unknown vulnerabilities.",
    level: "Advanced",
    price: "$199",
    xp: 2500,
    href: "/courses/zero-day",
  },
  {
    title: "Red Team Operations",
    description: "Simulate real-world attacks to test organizational readiness.",
    level: "Advanced",
    price: "$149",
    xp: 2000,
    href: "/courses/red-teaming",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <TerminalHero />
                <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                  Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Zero-Day</span> Vulnerabilities.
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                  Join the elite cybersecurity platform designed for the next generation of hackers. Learn, practice, and conquer using real-world scenarios.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-primary rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]">
                    Start Hacking <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="/mock-test/odisha-history" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white glass-card rounded-full hover:bg-white/10 transition-all">
                    Try Mock Test
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                {/* Abstract 3D Visual Placeholder */}
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative glass-card rounded-2xl p-8 border border-white/10 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <div className="font-mono text-sm text-primary mb-4">root@zeroday:~# ./exploit.py</div>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-white/20 rounded animate-pulse" />
                      <div className="h-2 w-1/2 bg-white/20 rounded animate-pulse" />
                      <div className="h-2 w-5/6 bg-white/20 rounded animate-pulse" />
                      <div className="mt-4 p-4 bg-black/50 rounded border border-primary/20 font-mono text-xs text-green-400">
                        [+] Target vulnerable
                        <br />
                        [+] Shell access granted
                        <br />
                        $ whoami
                        <br />
                        root
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why <span className="text-primary">ZeroDay</span>?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We don't just teach theory. We forge elite security professionals through practical, hands-on experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                { icon: Terminal, title: "Hands-on Labs", desc: "Access real-world environments directly in your browser." },
                { icon: Shield, title: "Industry Standard", desc: "Curriculum designed by top security researchers." },
                { icon: Zap, title: "Interactive Learning", desc: "Gamified progression with XP, levels, and achievements." },
              ].map((feature, i) => (
                <div key={i} className="glass-card p-8 rounded-2xl text-center hover:bg-white/5 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold">Featured <span className="text-secondary">Modules</span></h2>
              <Link href="/courses" className="text-primary hover:text-primary/80 font-bold flex items-center">
                View All <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={index} {...(course as any)} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
