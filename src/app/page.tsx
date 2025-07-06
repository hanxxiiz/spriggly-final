"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { TiThMenu } from "react-icons/ti";

// Load the font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function LandingPage() {
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false)
  return (
    <Fragment>
      <div className={`${poppins.className} bg-white min-h-screen w-full overflow-x-hidden`}>
        <header className="fixed w-full bg-white">
          <nav className="py-2.5">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
              <a href="" className="flex items-center">
                <img src="/logo.png" className="h-6 mr-3 sm:h-9" />
                <span className="text-lime-700 text-xl font-semibold ">Spriggly</span>
              </a>
              <button className="lg:hidden" onClick={() => setIsMenuShown(!isMenuShown)}>
                <TiThMenu className="w-6 h-6" />
              </button>
              <div
                className={`lg:flex items-center justify-between w-full lg:w-auto lg:order-1 ${
                  isMenuShown ? '' : 'hidden'
                }`}
              >
                <ul className="flex flex-col lg:flex-row lg:space-x-8 font-medium">
                  <li>
                    <a 
                      href="#features"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#about"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/auth"
                      className="text-white bg-lime-700 rounded block px-3 py-2 hover:scale-105 transition"
                    >
                      Start Growing
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <section className="bg-lime-100">
          <div className="max-w-screen-xl flex align-center justify-between mx-auto pt-20 px-4 pb-8">
            <div className="place-self-center">
              <h1 className="text-4xl font-extrabold mb-4 xl:text-6xl text-lime-700">
                Grow Your <br /> Productivity <br />Garden
              </h1>
              <p className="text-gray-500 font-light md:text-lg lg:text-xl">
                Transform your daily tasks into a thriving digital plants. 
                Complete tasks, earn rewards, and watch your virtual plants flourish as you build lasting productivity habits.
              </p>
            </div>
            <div>
              <img src="/hero.png" className="hover:scale-105 transition"/>
            </div>
          </div>
        </section>
        <section className="bg-lime-50 ">
          <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900">
                  Gamification That <br /> Actually Works
                </h2>
                <p className="mb-8 text-gray-700 lg:text-xl">
                  Unlike other productivity apps, Spriggly makes progress visible and rewarding. 
                  Your digital garden grows with every completed task, creating a beautiful visual 
                  representation of your achievements.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
                  {[
                    { icon: '🏆', title: 'Leaderboards', desc: 'Compete with friends and colleagues' },
                    { icon: '🛒', title: 'Marketplace', desc: 'Spend coins on new plants and items' },
                    { icon: '🔔', title: 'Smart Notifications', desc: 'Stay on track with gentle reminders' },
                    { icon: '🎯', title: 'Achievement System', desc: 'Unlock badges and milestones' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow">
                      <span className="text-2xl">{item.icon}</span>
                      <h4 className="font-semibold text-green-900 mt-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-4 bg-white/50 p-6 md:p-10 rounded-2xl shadow-md ml-0 lg:ml-12 hover:scale-105 transition">
                  {[
                    { icon: '🌱', title: 'Level 1', desc: 'Seedling Stage' },
                    { icon: '🪙', title: '1,250', desc: 'Coins Earned' },
                    { icon: '⚡', title: '7 Days', desc: 'Current Streak' },
                    { icon: '🥇', title: '12', desc: 'Achievements' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
                      <span className="text-4xl md:text-6xl">{item.icon}</span>
                      <h4 className="font-bold text-green-900 mt-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

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
        <section id="about" className="bg-lime-100 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-green-900 mb-6">About Us</h2>
            <p className="text-lg text-gray-700 mb-6">
              At <span className="font-semibold text-green-800">Spriggly</span>, we're rethinking what productivity can feel like.
              We believe progress should be visible, enjoyable, and deeply personal. That’s why we created a space where
              your daily habits bloom into something beautiful—a digital garden that grows with every task you complete.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our mission is simple: <span className="italic">make motivation sustainable.</span> Whether you're tackling goals,
              building routines, or just trying to stay on track, Spriggly turns your effort into something you can see,
              nurture, and be proud of.
            </p>
            <p className="text-lg text-gray-700">
              We combine <span className="font-medium">game design</span>, <span className="font-medium">psychology</span>,
              and <span className="font-medium">minimalist design principles</span> to help you stay focused—not with pressure,
              but with purpose.
            </p>
          </div>
        </section>
        <section className="bg-lime-50 py-16 px-4">
          <div className="max-w-xl mx-auto bg-white/40 backdrop-blur-md p-10 rounded-3xl shadow-md text-center ">
            
            <h2 className="text-3xl font-extrabold text-green-900 mb-4">
              Let’s Get <br /> Growing!
            </h2>
            
            <p className="text-green-800 mb-8">
              Join our other productive spriggly gardeners and transform your daily tasks into a thriving digital eco-collection. 
              Seeds planted. Goals incoming. You in?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 ">
              <button className="bg-green-900 text-white px-6 py-3 rounded-lg shadow hover:bg-green-800 transition flex items-center gap-2 hover:scale-105 transition">
                <a href="/auth" className="font-semibold">Start Growing</a>
              </button>
            </div>
          </div>
        </section>
        <footer className="bg-white">
          <div className="max-w-screen-xl p-4 py-6 mx-auto md:p-8 lg:p-10">
            <div className="text-center">
              <a
                className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900"
              >
                <img src="/logo.png" className="h-8 mr-3" />
                Spriggly
              </a>
              <span className="text-center text-gray-500">
                © 2025 Spriggly™. All Rights Reserved.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </Fragment> 
  );
}

