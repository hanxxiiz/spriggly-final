"use client";

import Link from "next/link";
import { Poppins } from "next/font/google";

// Load the font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function LandingPage() {
  return (
    <div className={`${poppins.className} bg-gradient-to-br from-[#DFF3A0] via-[#E5F58C] to-[#B6E388] min-h-screen w-full overflow-x-hidden`}>  
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-green-900/10 shadow-sm px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-green-900">🌿 Spriggly</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-semibold text-green-900">
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <a href="#features" className="hover:text-green-600 transition">Features</a>
          <a href="#contact" className="hover:text-green-600 transition">Contact</a>
          <Link href="/register">
            <span className="ml-4 px-6 py-2 bg-green-900 text-white rounded-xl shadow hover:brightness-110 transition">Sign Up</span>
          </Link>
        </div>
        {/* Mobile menu icon (optional for future) */}
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center overflow-hidden">
        {/* Decorative Plant Illustration */}
        <svg className="absolute left-0 bottom-0 w-1/2 max-w-lg opacity-40 pointer-events-none" viewBox="0 0 400 300"><ellipse cx="200" cy="250" rx="180" ry="50" fill="#B6E388" /><ellipse cx="100" cy="200" rx="60" ry="120" fill="#A7D129" opacity=".5"/></svg>
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold text-green-900 drop-shadow-lg mb-4">Grow Your Productivity</h1>
          <p className="text-2xl md:text-3xl text-lime-700 font-semibold mb-8 max-w-2xl mx-auto">Spriggly turns your daily tasks into a thriving digital garden. Complete tasks, focus with timers, and watch your progress bloom!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/register">
              <span className="px-10 py-4 bg-green-900 text-white text-lg font-bold rounded-2xl shadow-lg hover:scale-105 hover:brightness-110 transition">Start Growing</span>
            </Link>
            <a href="#features" className="px-10 py-4 bg-white text-green-900 text-lg font-bold rounded-2xl shadow hover:scale-105 hover:bg-lime-100 transition border border-green-900/10">See Features</a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-white min-h-screen flex flex-col items-center justify-center py-16 px-6">
        <h2 className="text-4xl font-extrabold text-green-900 mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {/* Feature 1 */}
          <div className="bg-[#DFF3A0] rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="22" fill="#A7D129" /><path d="M16 28l6-8 6 8" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="18" y="32" width="12" height="4" rx="2" fill="#4F772D"/></svg>
            <h3 className="text-green-900 fontn-bold text-xl mt-4 mb-2">Task Management</h3>
            <p className="text-green-800 text-base">Organize, prioritize, and conquer your to-dos.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-[#E5F58C] rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="22" fill="#B6E388" /><path d="M24 14v10l6 4" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="text-green-900 font-bold text-xl mt-4 mb-2">Focus Timers</h3>
            <p className="text-green-800 text-base">Stay on track with Pomodoro-style sessions.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-[#B6E388] rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="22" fill="#DFF3A0" /><path d="M24 32c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" stroke="#4F772D" strokeWidth="2"/><text x="24" y="28" textAnchor="middle" fontSize="12" fill="#4F772D">XP</text></svg>
            <h3 className="text-green-900 font-bold text-xl mt-4 mb-2">Gamified Rewards</h3>
            <p className="text-green-800 text-base">Earn XP, coins, and unlock new plants.</p>
          </div>
          {/* Feature 4 */}
          <div className="bg-[#E5F58C] rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="22" fill="#A7D129" /><path d="M16 32h16M16 28h16M16 24h16" stroke="#4F772D" strokeWidth="2" strokeLinecap="round"/><circle cx="36" cy="16" r="4" fill="#4F772D"/></svg>
            <h3 className="text-green-900 font-bold text-xl mt-4 mb-2">Marketplace</h3>
            <p className="text-green-800 text-base">Shop for plant upgrades</p>
          </div>
          {/* Feature 5 */}
          <div className="bg-[#B6E388] rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="22" fill="#DFF3A0" /><path d="M24 14v10l6 4" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="36" cy="16" r="4" fill="#A7D129"/></svg>
            <h3 className="text-green-900 font-bold text-xl mt-4 mb-2">Leaderboards</h3>
            <p className="text-green-800 text-base">Compete and celebrate your growth with others.</p>
          </div>
          {/* Feature 6 */}
          <div className="bg-[#DFF3A0] rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="22" fill="#B6E388" /><path d="M16 32h16M16 28h16M16 24h16" stroke="#4F772D" strokeWidth="2" strokeLinecap="round"/><circle cx="36" cy="16" r="4" fill="#A7D129"/></svg>
            <h3 className="text-green-900 font-bold text-xl mt-4 mb-2">Social Features</h3>
            <p className="text-green-800 text-base">Share, motivate, and grow together.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION (placeholder) */}
      <section id="contact" className="bg-white flex flex-col items-center justify-center py-12 px-4">
        <h2 className="text-4xl font-extrabold text-green-900 mb-8">Contact</h2>
        <p className="text-green-800 mb-4">Questions? Suggestions? Reach out to us!</p>
        <a href="mailto:hello@spriggly.app" className="text-green-900 font-semibold underline hover:text-green-600">hello@spriggly.app</a>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-900 text-white py-8 px-6 flex flex-col md:flex-row justify-between items-center text-sm mt-8">
        <div className="mb-4 md:mb-0">© {new Date().getFullYear()} Spriggly. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="/" className="hover:underline">Home</Link>
          <a href="#features" className="hover:underline">Features</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}

