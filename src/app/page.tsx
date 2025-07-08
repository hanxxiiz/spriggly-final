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
        <header className="fixed w-full bg-white z-50">
          <nav className="py-2 sm:py-3">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 sm:px-6 lg:px-8 mx-auto">
              <a href="" className="flex items-center">
                <img src="/logo.png" className="h-6 sm:h-8 lg:h-9 mr-2 sm:mr-3" />
                <span className="text-lime-700 text-lg sm:text-xl font-semibold">Spriggly</span>
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
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2 text-sm sm:text-base"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#about"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2 text-sm sm:text-base"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2 text-sm sm:text-base"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/auth"
                      className="text-white bg-lime-700 rounded block px-3 py-2 hover:scale-105 transition text-sm sm:text-base"
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
          <div className="max-w-screen-xl flex flex-col lg:flex-row items-center justify-between mx-auto pt-20 sm:pt-24 lg:pt-28 px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16 gap-8 lg:gap-12">
            <div className="place-self-center text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 text-lime-700 leading-tight">
                Grow Your <br /> Productivity <br />Garden
              </h1>
              <p className="text-gray-500 font-light text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto lg:mx-0">
                Transform your daily tasks into a thriving digital plants. 
                Complete tasks, earn rewards, and watch your virtual plants flourish as you build lasting productivity habits.
              </p>
            </div>
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <img src="/hero.png" className="w-full h-auto hover:scale-105 transition"/>
            </div>
          </div>
        </section>
        
        <section className="bg-lime-50">
          <div className="max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-24 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Gamification That <br /> Actually Works
                </h2>
                <p className="mb-6 sm:mb-8 text-gray-700 text-base sm:text-lg lg:text-xl">
                  Unlike other productivity apps, Spriggly makes progress visible and rewarding. 
                  Your digital garden grows with every completed task, creating a beautiful visual 
                  representation of your achievements.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-md">
                  {[
                    { icon: '🏆', title: 'Leaderboards', desc: 'Compete with friends and colleagues' },
                    { icon: '🛒', title: 'Marketplace', desc: 'Spend coins on new plants and items' },
                    { icon: '🔔', title: 'Smart Notifications', desc: 'Stay on track with gentle reminders' },
                    { icon: '🎯', title: 'Achievement System', desc: 'Unlock badges and milestones' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3 sm:p-4 shadow">
                      <span className="text-xl sm:text-2xl">{item.icon}</span>
                      <h4 className="font-semibold text-green-900 mt-2 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white/50 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl shadow-md ml-0 lg:ml-8 xl:ml-12 hover:scale-105 transition">
                  {[
                    { icon: '🌱', title: 'Level 1', desc: 'Seedling Stage' },
                    { icon: '🪙', title: '1,250', desc: 'Coins Earned' },
                    { icon: '⚡', title: '7 Days', desc: 'Current Streak' },
                    { icon: '🥇', title: '12', desc: 'Achievements' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{item.icon}</span>
                      <h4 className="font-bold text-green-900 mt-2 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 text-center">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-900 mb-6 sm:mb-8 lg:mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full">
            {/* Feature 1 */}
            <div className="bg-[#DFF3A0] rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition">
              <svg width="40" height="40" className="sm:w-12 sm:h-12" fill="none"><circle cx="24" cy="24" r="22" fill="#A7D129" /><path d="M16 28l6-8 6 8" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="18" y="32" width="12" height="4" rx="2" fill="#4F772D"/></svg>
              <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-4 mb-2 text-center">Task Management</h3>
              <p className="text-green-800 text-sm sm:text-base text-center">Organize, prioritize, and conquer your to-dos.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#E5F58C] rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition">
              <svg width="40" height="40" className="sm:w-12 sm:h-12" fill="none"><circle cx="24" cy="24" r="22" fill="#B6E388" /><path d="M24 14v10l6 4" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-4 mb-2 text-center">Focus Timers</h3>
              <p className="text-green-800 text-sm sm:text-base text-center">Stay on track with Pomodoro-style sessions.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#B6E388] rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition">
              <svg width="40" height="40" className="sm:w-12 sm:h-12" fill="none"><circle cx="24" cy="24" r="22" fill="#DFF3A0" /><path d="M24 32c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" stroke="#4F772D" strokeWidth="2"/><text x="24" y="28" textAnchor="middle" fontSize="12" fill="#4F772D">XP</text></svg>
              <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-4 mb-2 text-center">Gamified Rewards</h3>
              <p className="text-green-800 text-sm sm:text-base text-center">Earn XP, coins, and unlock new plants.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-[#E5F58C] rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition">
              <svg width="40" height="40" className="sm:w-12 sm:h-12" fill="none"><circle cx="24" cy="24" r="22" fill="#A7D129" /><path d="M16 32h16M16 28h16M16 24h16" stroke="#4F772D" strokeWidth="2" strokeLinecap="round"/><circle cx="36" cy="16" r="4" fill="#4F772D"/></svg>
              <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-4 mb-2 text-center">Marketplace</h3>
              <p className="text-green-800 text-sm sm:text-base text-center">Shop for plant upgrades</p>
            </div>
            {/* Feature 5 */}
            <div className="bg-[#B6E388] rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition">
              <svg width="40" height="40" className="sm:w-12 sm:h-12" fill="none"><circle cx="24" cy="24" r="22" fill="#DFF3A0" /><path d="M24 14v10l6 4" stroke="#4F772D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="36" cy="16" r="4" fill="#A7D129"/></svg>
              <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-4 mb-2 text-center">Leaderboards</h3>
              <p className="text-green-800 text-sm sm:text-base text-center">Compete and celebrate your growth with others.</p>
            </div>
            {/* Feature 6 */}
            <div className="bg-[#DFF3A0] rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center hover:scale-105 transition">
              <svg width="40" height="40" className="sm:w-12 sm:h-12" fill="none"><circle cx="24" cy="24" r="22" fill="#B6E388" /><path d="M16 32h16M16 28h16M16 24h16" stroke="#4F772D" strokeWidth="2" strokeLinecap="round"/><circle cx="36" cy="16" r="4" fill="#A7D129"/></svg>
              <h3 className="text-green-900 font-bold text-lg sm:text-xl mt-4 mb-2 text-center">Social Features</h3>
              <p className="text-green-800 text-sm sm:text-base text-center">Share, motivate, and grow together.</p>
            </div>
          </div>
        </section>
        
        <section id="about" className="bg-lime-100 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-900 mb-4 sm:mb-6 lg:mb-8">About Us</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              At <span className="font-semibold text-green-800">Spriggly</span>, we're rethinking what productivity can feel like.
              We believe progress should be visible, enjoyable, and deeply personal. That's why we created a space where
              your daily habits bloom into something beautiful—a digital garden that grows with every task you complete.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Our mission is simple: <span className="italic">make motivation sustainable.</span> Whether you're tackling goals,
              building routines, or just trying to stay on track, Spriggly turns your effort into something you can see,
              nurture, and be proud of.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
              We combine <span className="font-medium">game design</span>, <span className="font-medium">psychology</span>,
              and <span className="font-medium">minimalist design principles</span> to help you stay focused—not with pressure,
              but with purpose.
            </p>
          </div>
        </section>
        
        <section className="bg-lime-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto bg-white/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-md text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 mb-4 sm:mb-6">
              Let's Get <br /> Growing!
            </h2>
            
            <p className="text-green-800 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
              Join our other productive spriggly gardeners and transform your daily tasks into a thriving digital eco-collection. 
              Seeds planted. Goals incoming. You in?
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button className="bg-green-900 text-white px-6 py-3 rounded-lg shadow hover:bg-green-800 transition flex items-center gap-2 hover:scale-105 transition w-full sm:w-auto">
                <a href="/auth" className="font-semibold text-sm sm:text-base">Start Growing</a>
              </button>
            </div>
          </div>
        </section>
        
        <footer className="bg-white">
          <div className="max-w-screen-xl p-4 sm:p-6 lg:p-8 py-6 sm:py-8 lg:py-10 mx-auto">
            <div className="text-center">
              <a
                className="flex items-center justify-center mb-4 sm:mb-5 text-xl sm:text-2xl font-semibold text-gray-900"
              >
                <img src="/logo.png" className="h-6 sm:h-8 mr-2 sm:mr-3" />
                Spriggly
              </a>
              <span className="text-center text-gray-500 text-sm sm:text-base">
                © 2025 Spriggly™. All Rights Reserved.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </Fragment> 
  );
}

