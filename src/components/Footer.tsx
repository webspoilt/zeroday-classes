export const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-background/50 backdrop-blur-lg mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold font-heading mb-4">ZERODAY<span className="text-primary">.</span></h2>
                        <p className="text-muted-foreground max-w-sm">
                            Master the art of ethical hacking and cybersecurity. Join the elite community of security researchers.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Platform</h3>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Courses</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Career Path</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Certificates</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Mock Tests</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Community</h3>
                        <ul className="space-y-2 text-muted-foreground text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} ZeroDay Classes. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-foreground">Privacy</a>
                        <a href="#" className="hover:text-foreground">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
