'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { FaLeaf, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePage from './Profile/page';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('Home');
  const [showProfile, setShowProfile] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFocusTimerModal, setShowFocusTimerModal] = useState(false);

  // Pomodoro Timer State
  const initialTime = 30; // 30 seconds for testing
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Task List State
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Sample Task 1', completed: false },
    { id: 2, text: 'Sample Task 2', completed: false },
  ]);
  const [nextTaskId, setNextTaskId] = useState(3);

  // Interactive Completion State
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [interactionType, setInteractionType] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDrag, setShowDrag] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [showInputPrompt, setShowInputPrompt] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
    <span key="grown" style={{fontSize: '3rem'}} role="img" aria-label="grown">��</span>,
  ];

  // Calendar logic
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  // Calendar state for navigation
  const [displayedMonth, setDisplayedMonth] = useState(todayMonth);
  const [displayedYear, setDisplayedYear] = useState(todayYear);
  // Calculate number of days in displayed month
  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  // Calculate the weekday the 1st of the month falls on (0=Sunday, 6=Saturday)
  const firstDayOfWeek = new Date(displayedYear, displayedMonth, 1).getDay();

  // Handle month navigation
  const handlePrevMonth = () => {
    setDisplayedMonth((prev) => {
      if (prev === 0) {
        setDisplayedYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  const handleNextMonth = () => {
    setDisplayedMonth((prev) => {
      if (prev === 11) {
        setDisplayedYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

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

  // Handle task completion and timer reduction
  // Randomly select an interaction type
  const interactionTypes = ['modal', 'drag', 'celebrate', 'input'];
  const handleCompleteClick = (id: number) => {
    if (tasks.find((t) => t.id === id)?.completed) return;
    setActiveTaskId(id);
    const randomType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
    setInteractionType(randomType);
    if (randomType === 'modal') setShowModal(true);
    if (randomType === 'drag') setShowDrag(true);
    if (randomType === 'celebrate') setShowCelebrate(true);
    if (randomType === 'input') setShowInputPrompt(true);
  };

  // Mark task as complete and reduce timer
  const completeTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id && !task.completed
          ? { ...task, completed: true }
          : task
      )
    );
    setTimeLeft((prev) => Math.max(0, prev - 5));
    setActiveTaskId(null);
    setInteractionType(null);
    setShowModal(false);
    setShowDrag(false);
    setShowCelebrate(false);
    setShowInputPrompt(false);
    setInputValue('');
  };

  const handleAddTask = () => {
    setTasks((prev) => [
      ...prev,
      { id: nextTaskId, text: `New Task ${nextTaskId}`, completed: false },
    ]);
    setNextTaskId((id) => id + 1);
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Drag-to-complete logic
  const [dragged, setDragged] = useState(false);
  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    setDragged(false);
    // If dropped in the right area, complete the task
    const dropZone = document.getElementById('drop-zone');
    const rect = dropZone?.getBoundingClientRect();
    if (
      rect &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      if (activeTaskId !== null) completeTask(activeTaskId);
    }
  };

  // Celebrate animation (auto-complete after animation)
  useEffect(() => {
    if (showCelebrate && activeTaskId !== null) {
      const timeout = setTimeout(() => {
        completeTask(activeTaskId);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [showCelebrate, activeTaskId]);

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
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      {/* Header/NavBar */}
      <header className="bg-white shadow-sm rounded-t-xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/globe.svg" alt="Spriggly Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-green-800">Spriggly</span>
              </div>
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8 text-green-800 font-medium">
            <li>
              <button
                className="hover:underline bg-transparent"
                onClick={() => {
                  setShowProfile(false);
                  setShowFocus(false);
                }}
              >
                Home
              </button>
            </li>
            <li><button className="hover:underline bg-transparent">Grow</button></li>
            <li><button className="hover:underline bg-transparent">Focus</button></li>
            <li><button className="hover:underline bg-transparent">My Plants</button></li>
            <li><button className="hover:underline bg-transparent">Shop</button></li>
            <li><button className="hover:underline bg-transparent">Notifications</button></li>
            <li><button onClick={() => { setShowProfile(true); setShowFocus(false); }} className="hover:underline bg-transparent">Profile</button></li>
            <li><button className="hover:underline bg-transparent">Settings</button></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      {showProfile ? (
        <ProfilePage />
      ) : showFocus ? (
        <main className="flex-1 flex flex-col bg-[#F4F4F4] min-h-screen py-8 px-8 relative">
          <h1 className="text-3xl font-extrabold text-green-800 mb-8">Grow</h1>
          {/* (Focus Timer card, Tasks card, Add Task Modal, and Focus Timer Modal removed) */}
        </main>
      ) : (
        <main className="flex-1 flex flex-col md:flex-row bg-[#F4F4F4]">
          {/* Main Left Content */}
          <section className="flex-1 p-8">
            {/* Welcome Card */}
            <div className="rounded-2xl shadow-lg mb-8 p-8 bg-gradient-to-r from-green-400 via-yellow-300 to-yellow-200">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {status === 'authenticated' && session?.user?.name ? `Welcome back, ${session.user.name}!` : 'Welcome back!'}
              </h2>
              <p className="text-white font-medium mb-4">Water your goals. And maybe your real plants too!</p>
              <button className="bg-white text-green-700 font-bold px-5 py-2 rounded-lg shadow hover:bg-green-100 transition">Start now</button>
                          </div>

            {/* Daily Rewards */}
            <h3 className="text-xl font-bold text-green-800 mb-4">Daily Rewards</h3>
            <div className="flex items-center space-x-4 mb-6">
              <button className="p-2 bg-[#F4F9E7] rounded-full shadow"><FaChevronLeft /></button>
              <div className="flex space-x-4">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="w-20 h-20 rounded-xl bg-yellow-200 shadow" />
                ))}
              </div>
              <button className="p-2 bg-[#F4F9E7] rounded-full shadow"><FaChevronRight /></button>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-10 max-w-2xl">
              <div className="col-span-1 row-span-2 w-full h-40 rounded-xl bg-yellow-200 shadow" />
              <div className="col-span-1 w-full h-20 rounded-xl bg-yellow-200 shadow" />
              <div className="col-span-1 w-full h-20 rounded-xl bg-yellow-200 shadow" />
            </div>

            {/* Explore Section */}
            <h3 className="text-xl font-bold text-green-800 mb-4">Explore</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My Plants */}
              <div className="flex items-center bg-gradient-to-r from-green-400 to-green-200 rounded-xl shadow p-4">
                <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">icon</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">My Plants</div>
                  <div className="text-white text-sm">View all the plants you have grown and collected!</div>
                </div>
                <div className="ml-4 text-white font-bold text-2xl">&gt;</div>
              </div>
              {/* Grow */}
              <div className="flex items-center bg-gradient-to-r from-green-400 to-green-200 rounded-xl shadow p-4">
                <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">icon</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">Grow</div>
                  <div className="text-white text-sm">View all the plants you have grown and collected!</div>
                </div>
                <div className="ml-4 text-white font-bold text-2xl">&gt;</div>
              </div>
              {/* Analytics */}
              <div className="flex items-center bg-gradient-to-r from-green-400 to-green-200 rounded-xl shadow p-4">
                <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">icon</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">Analytics</div>
                  <div className="text-white text-sm">See your focus time and productivity stats.</div>
                </div>
                <div className="ml-4 text-white font-bold text-2xl">&gt;</div>
                  </div>
              {/* Notifications */}
              <div className="flex items-center bg-gradient-to-r from-green-400 to-green-200 rounded-xl shadow p-4">
                <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">icon</div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">Notifications</div>
                  <div className="text-white text-sm">Stay updated on tasks, plant growth, and rewards.</div>
                </div>
                <div className="ml-4 text-white font-bold text-2xl">&gt;</div>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white rounded-l-2xl shadow-lg p-6 flex flex-col border-l border-gray-200">
            {/* Calendar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-black">{new Date(displayedYear, displayedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-100"><FaChevronLeft size={14} /></button>
                  <button className="p-1 rounded hover:bg-gray-100"><FaChevronRight size={14} /></button>
                </div>
              </div>
              {/* Calendar grid (static for now) */}
              <div className="grid grid-cols-7 gap-1 text-xs text-center text-black mb-1">
                {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d => <div key={d}>{d}</div>)}
                    </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Add empty divs for days before the 1st of the month */}
                {Array.from({length: firstDayOfWeek}).map((_, i) => (
                  <div key={`empty-${i}`}></div>
                ))}
                {Array.from({length: daysInMonth}, (_, i) => i+1).map(day => {
                  const isToday = todayDate === day && todayMonth === displayedMonth && todayYear === displayedYear;
                  return (
                    <div
                      key={day}
                      className={`py-1 rounded-full cursor-pointer text-black ${isToday ? 'bg-blue-600 text-white font-bold' : 'hover:bg-green-100'}`}
                    >
                      {day}
                    </div>
                  );
                })}
                    </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Ends</span>
                <input type="time" value="08:00" className="border rounded px-2 py-1 text-xs w-24" readOnly />
                    </div>
                    </div>
            {/* Incoming Tasks */}
            <div className="mt-4">
              <h4 className="font-bold text-gray-700 mb-2 text-sm">Incoming Tasks</h4>
              <div className="space-y-2">
                <div className="h-6 rounded bg-red-500" />
                <div className="h-6 rounded bg-yellow-200" />
                <div className="h-6 rounded bg-yellow-200" />
                <div className="h-6 rounded bg-yellow-200" />
              </div>
            </div>
          </aside>
        </main>
        )}
    </div>
  );
}
