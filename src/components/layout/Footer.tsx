import Link from "next/link";
import { Youtube } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-background/50 backdrop-blur-lg mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold font-heading mb-4">ZERODAY<span className="text-primary">.</span></h2>
                        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                            Free Odisha exam preparation, government job alerts, and coding tutorials. Part of the ZeroDay Classes YouTube channel.
                        </p>
                        <a href="https://youtube.com/@zerodayclasses" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
                            <Youtube className="w-4 h-4" /> YouTube Channel
                        </a>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Quick Links</h3>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><Link href="/mock-test/ossc-cgl" className="hover:text-primary transition-colors">OSSC CGL Mock Test</Link></li>
                            <li><Link href="/odisha-jobs" className="hover:text-primary transition-colors">Odisha Job Alerts</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>

                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Connect</h3>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><a href="https://youtube.com/@zerodayclasses" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">YouTube</a></li>
                            <li><a href="https://t.me/zerodayclasses" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Telegram</a></li>
                            <li><a href="mailto:heyzerodayhere@gmail.com" className="hover:text-primary transition-colors">Email Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} ZeroDay Classes. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Made with ❤️ for Odisha aspirants</p>
                    <Link href="/admin/login" className="text-xs text-slate-800 ml-4 hover:text-primary transition-colors">Admin</Link>
                </div>
            </div>
        </footer>
    );
};
