"use strict";
// Simple client-side admin auth using localStorage
// In production, replace with Supabase Auth or NextAuth
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = adminLogin;
exports.isAdminLoggedIn = isAdminLoggedIn;
exports.adminLogout = adminLogout;
const ADMIN_KEY = 'zeroday_admin_session';
const ADMIN_PASSWORD = 'zeroday@admin2024'; // Change this!
function adminLogin(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify({
            loggedIn: true,
            timestamp: Date.now()
        }));
        return true;
    }
    return false;
}
function isAdminLoggedIn() {
    if (typeof window === 'undefined')
        return false;
    try {
        const session = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
        if (!session.loggedIn)
            return false;
        // Session expires after 24 hours
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - session.timestamp > ONE_DAY) {
            localStorage.removeItem(ADMIN_KEY);
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
}
function adminLogout() {
    localStorage.removeItem(ADMIN_KEY);
}
