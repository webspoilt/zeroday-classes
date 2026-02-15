import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, BookOpen, Briefcase, Code, FileText, GraduationCap, PlayCircle, Target, TrendingUp, Users, Youtube, Zap } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Target,
    title: "OSSC CGL Mock Tests",
    desc: "150 questions covering Maths, Reasoning, DI, Computer, Odisha GK & Current Affairs. Real exam simulation.",
    href: "/mock-test/ossc-cgl",
    cta: "Start Test",
    color: "text-red-400",
    bg: "bg-red-500/10"
  },
  {
    icon: Briefcase,
    title: "Odisha Career Center",
    desc: "Latest OSSC, OPSC, Railway & Banking job alerts with smart filters and deadline tracking.",
    href: "/odisha-jobs",
    cta: "View Jobs",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    icon: Code,
    title: "Coding Tutorials",
    desc: "Learn web development, Python, and programming basics through our YouTube video series.",
    href: "https://youtube.com/@zerodayclasses",
    cta: "Watch Now",
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
];

const EXAM_SECTIONS = [
  { icon: BookOpen, title: "Mathematics", questions: "25 Qs", color: "text-blue-400" },
  { icon: Zap, title: "Reasoning", questions: "25 Qs", color: "text-purple-400" },
  { icon: TrendingUp, title: "Data Interpretation", questions: "25 Qs", color: "text-yellow-400" },
  { icon: FileText, title: "Computer Knowledge", questions: "25 Qs", color: "text-cyan-400" },
  { icon: GraduationCap, title: "Odisha GK", questions: "25 Qs", color: "text-orange-400" },
  { icon: Target, title: "Current Affairs", questions: "25 Qs", color: "text-pink-400" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[150px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold mb-8">
                <Youtube className="w-4 h-4" /> ZeroDay Classes — Odisha's Exam Prep Platform
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-heading">
                Crack <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Odisha Govt Exams</span>
                <br />
                <span className="text-3xl md:text-5xl text-slate-400 font-normal">& Learn Coding For Free</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Free mock tests, job alerts, and coding tutorials for OSSC CGL, OSSSC, OPSC aspirants. Updated daily from our YouTube channel.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/mock-test/ossc-cgl" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-primary rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]">
                  🎯 Start OSSC CGL Mock Test <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/odisha-jobs" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white glass-card rounded-full hover:bg-white/10 transition-all">
                  💼 Browse Odisha Jobs
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
                <div>
                  <div className="text-3xl font-bold text-white">150+</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Mock Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">6</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Exam Sections</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">Free</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Always</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Everything You Need to <span className="text-primary">Succeed</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From mock tests with real exam patterns to daily job alerts — all in one place, completely free.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {FEATURES.map((feature, i) => (
                <Link key={i} href={feature.href} className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-all hover:scale-[1.02] group block">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bg} ${feature.color} mb-6`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{feature.desc}</p>
                  <span className={`font-bold text-sm ${feature.color} group-hover:underline inline-flex items-center gap-1`}>
                    {feature.cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>

            {/* OSSC CGL Mock Test Breakdown */}
            <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">OSSC CGL Mock Test</h2>
                  <p className="text-muted-foreground">Full-length exam simulation — 150 questions, 120 minutes, negative marking</p>
                </div>
                <Link href="/mock-test/ossc-cgl" className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg">
                  <PlayCircle className="w-5 h-5" /> Start Now
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {EXAM_SECTIONS.map((section, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                    <section.icon className={`w-6 h-6 mx-auto mb-2 ${section.color}`} />
                    <div className="text-sm font-bold text-white">{section.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{section.questions}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm font-bold text-white">⏱️ 120 min</div>
                  <div className="text-xs text-muted-foreground">Time Limit</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm font-bold text-white">📝 150 Qs</div>
                  <div className="text-xs text-muted-foreground">Total Questions</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm font-bold text-red-400">-0.25</div>
                  <div className="text-xs text-muted-foreground">Negative Marking</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="glass-card rounded-2xl p-10 border border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent">
              <Youtube className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">Subscribe to ZeroDay Classes</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Video lessons on OSSC CGL preparation, Odisha GK, coding tutorials, and exam strategies — all free on YouTube.
              </p>
              <a href="https://youtube.com/@zerodayclasses" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-500 transition-all shadow-lg hover:shadow-red-500/20">
                <PlayCircle className="w-5 h-5" /> Subscribe on YouTube
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
