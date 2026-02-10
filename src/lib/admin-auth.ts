// Simple client-side admin auth using localStorage
// In production, replace with Supabase Auth or NextAuth

const ADMIN_KEY = 'zeroday_admin_session';
const ADMIN_PASSWORD = 'zeroday@admin2024'; // Change this!

export function adminLogin(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify({
            loggedIn: true,
            timestamp: Date.now()
        }));
        return true;
    }
    return false;
}

export function isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const session = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
        if (!session.loggedIn) return false;
        // Session expires after 24 hours
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - session.timestamp > ONE_DAY) {
            localStorage.removeItem(ADMIN_KEY);
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export function adminLogout() {
    localStorage.removeItem(ADMIN_KEY);
}
