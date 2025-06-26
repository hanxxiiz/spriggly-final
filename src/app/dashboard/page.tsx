'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { FaLeaf, FaClock, FaShoppingCart, FaChartBar } from 'react-icons/fa';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('Home');

  // Pomodoro Timer State
  const initialTime = 30; // 30 seconds for testing
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Plant growth stage: 0 = seedling, 1 = sprout, 2 = grown
  const getPlantStage = () => {
    const percent = 1 - timeLeft / initialTime;
    if (percent < 0.33) return 0;
    if (percent < 0.66) return 1;
    return 2;
  };
  const plantStages = [
    <span key="seedling" style={{fontSize: '3rem'}} role="img" aria-label="seedling">🌱</span>,
    <span key="sprout" style={{fontSize: '3rem'}} role="img" aria-label="sprout">🌿</span>,
    <span key="grown" style={{fontSize: '3rem'}} role="img" aria-label="grown">🌳</span>,
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeLeft === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  };
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F3D6]">
      {/* Navigation Bar */}
      <nav className="bg-[#E8F3D6] border-b border-green-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <FaLeaf className="h-6 w-6 text-green-600" />
                <span className="ml-2 text-xl font-semibold text-green-800">Spriggly</span>
              </div>
              <div className="flex space-x-6">
                <button onClick={() => setActiveSection('Home')} className={`text-green-800 hover:text-green-600 focus:outline-none ${activeSection === 'Home' ? 'font-bold' : ''}`}>Home</button>
                <button onClick={() => setActiveSection('Grow')} className={`text-green-800 hover:text-green-600 focus:outline-none ${activeSection === 'Grow' ? 'font-bold' : ''}`}>Grow</button>
                <button onClick={() => setActiveSection('Plants')} className={`text-green-800 hover:text-green-600 focus:outline-none ${activeSection === 'Plants' ? 'font-bold' : ''}`}>Plants</button>
                <button onClick={() => setActiveSection('Shop')} className={`text-green-800 hover:text-green-600 focus:outline-none ${activeSection === 'Shop' ? 'font-bold' : ''}`}>Shop</button>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button className="text-green-800 hover:text-green-600 focus:outline-none">Notifications
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">1</span>
                </button>
              </div>
              <button className="text-green-800 hover:text-green-600 focus:outline-none">Profile</button>
              <button className="text-green-800 hover:text-green-600 focus:outline-none">Settings</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeSection === 'Plants' ? (
          // Plants Collection Layout
          <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-[#F4F9E7] rounded-2xl shadow-md p-8 w-full h-[400px] max-w-[500px] flex flex-col justify-end relative">
                <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2">
                  <div className="bg-[#F8FFB0] rounded-lg shadow-md w-[320px] h-[140px]" />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-green-900 mb-8">Collection</h2>
              <div className="grid grid-cols-2 gap-8">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="bg-[#F4F9E7] rounded-xl shadow-md w-[180px] h-[220px]" />
                ))}
              </div>
            </div>
          </div>
        ) : activeSection === 'Shop' ? (
          // Shop Page Layout
          <div className="min-h-[70vh]">
            <h2 className="text-4xl font-bold text-green-900 mb-8">Shop</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#F4F9E7] rounded-xl shadow-md w-[180px] h-[220px] mx-auto" />
              ))}
            </div>
          </div>
        ) : activeSection === 'Grow' ? (
          // Grow Page Layout (Match Screenshot UI)
          <div className="flex flex-col min-h-[70vh]">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Pomodoro Timer (Left) */}
              <div className="flex-1 flex items-stretch">
                <div className="bg-[#F4F9E7] rounded-2xl shadow-lg p-8 w-full flex flex-col justify-start min-h-[500px] border border-[#d3e2b6]">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-black">Start Focus Session</h2>
                  <div className="flex flex-col items-center mt-2">
                    <div className="bg-[#bfc7a1] rounded-xl p-8 flex flex-col items-center w-[340px] max-w-full">
                      <h3 className="text-lg font-bold text-[#3b5c2e] mb-2">Pomodoro Timer</h3>
                      <div className="mb-4">{plantStages[getPlantStage()]}</div>
                      <div className="text-5xl font-extrabold text-[#23411a] mb-6">{minutes}:{seconds}</div>
                      <div className="flex space-x-4">
                        <button onClick={handleStart} disabled={isRunning} className={`bg-[#23411a] hover:bg-[#2e6b2e] text-white px-7 py-2 rounded-lg font-bold text-lg ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}>Start</button>
                        <button onClick={handleReset} className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-7 py-2 rounded-lg font-bold text-lg">Surrender</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Task List (Right) */}
              <div className="flex-1 flex items-stretch">
                <div className="bg-[#F4F9E7] rounded-2xl shadow-lg p-8 w-full flex flex-col min-h-[500px] border border-[#d3e2b6]">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-black">task list</h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-black">Today's Tasks</span>
                    <button className="bg-[#23411a] hover:bg-[#2e6b2e] text-white px-4 py-2 rounded-lg text-sm font-bold">+ Add Task</button>
                  </div>
                  <div className="border-2 border-blue-400 rounded-lg p-4 flex items-center justify-between bg-[#bfc7a1]">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 mr-4" />
                    <div className="flex-1"></div>
                    <button className="text-gray-700 font-bold mr-4">Edit</button>
                    <button className="text-red-600 font-bold">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Plant Collection (Full width, below) */}
            <div className="mt-8">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-black">plant collection</h2>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-8 min-w-max">
                  {[0,1,2,3,4,5].map((i) => (
                    <div key={i} className="bg-[#F4F9E7] rounded-xl shadow-lg w-[260px] h-[260px] flex-shrink-0 border border-[#d3e2b6]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Home Section (default)
          <>
            {/* Welcome Section */}
            <div className="bg-[#F4F9E7] rounded-2xl p-8 mb-8">
              <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome back! <FaLeaf className="inline-block text-green-600" /></h1>
              <p className="text-gray-600 mb-8">You have # of task</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-gray-600 mb-2">Tasks Completed</h3>
                  <p className="text-4xl font-bold text-green-800">12</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-gray-600 mb-2">Focus Time Today</h3>
                  <p className="text-4xl font-bold text-green-800">145 min</p>
                  <button className="mt-2 bg-green-700 text-white px-4 py-1 rounded-lg text-sm">
                    Start Focus Session
                  </button>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-gray-600 mb-2">Plant Growth</h3>
                  <p className="text-4xl font-bold text-green-800">75</p>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Today's Tasks */}
              <div className="bg-[#F4F9E7] rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Today's Tasks</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#F4F9E7] rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <button className="w-full bg-white hover:bg-gray-50 text-left px-6 py-4 rounded-xl flex items-center space-x-4 transition-colors">
                    <FaClock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Start Focus Session</p>
                      <p className="text-sm text-gray-500">Begin a timed work session</p>
                    </div>
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-left px-6 py-4 rounded-xl flex items-center space-x-4 transition-colors">
                    <FaLeaf className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Check My Plants</p>
                      <p className="text-sm text-gray-500">See your garden progress</p>
                    </div>
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-left px-6 py-4 rounded-xl flex items-center space-x-4 transition-colors">
                    <FaShoppingCart className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Visit Marketplace</p>
                      <p className="text-sm text-gray-500">Spend your earned coins</p>
                    </div>
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-left px-6 py-4 rounded-xl flex items-center space-x-4 transition-colors">
                    <FaChartBar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">View Analytics</p>
                      <p className="text-sm text-gray-500">Track your productivity</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
