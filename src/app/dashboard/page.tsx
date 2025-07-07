'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { FaLeaf, FaChevronLeft, FaChevronRight, FaLock, FaCoins, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GiWateringCan, GiGrowth, GiSprout, GiLaurelsTrophy } from 'react-icons/gi';
import Navbar from '@/components/NavigationBar';

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

  // Daily Rewards Logic
  const dailyRewards = [
    { coins: 50, booster: null, seed: null, label: 'Day 1', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />] },
    { coins: 100, booster: null, seed: null, label: 'Day 2', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />] },
    { coins: 150, booster: 'Watering Can', seed: null, label: 'Day 3', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />, <GiWateringCan key="watering" className="text-blue-400 text-2xl ml-1" />] },
    { coins: 200, booster: null, seed: null, label: 'Day 4', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />] },
    { coins: 250, booster: null, seed: 'Uncommon Seed', label: 'Day 5', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />, <GiSprout key="seed" className="text-green-500 text-2xl ml-1" />] },
    { coins: 300, booster: 'Growth Booster', seed: null, label: 'Day 6', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />, <GiGrowth key="growth" className="text-green-700 text-2xl ml-1" />] },
    { coins: 500, booster: 'Booster', seed: 'Rare Seed', label: 'Day 7', icons: [<FaCoins key="coins" className="text-yellow-500 text-3xl" />, <GiSprout key="rare" className="text-purple-500 text-2xl ml-1" />, <GiLaurelsTrophy key="booster" className="text-yellow-600 text-2xl ml-1" />] },
  ];

  // Backend-integrated daily rewards state
  const [claimedDay, setClaimedDay] = useState<number>(0);
  const [lastClaimDate, setLastClaimDate] = useState<string>('');
  const [rewardsLoading, setRewardsLoading] = useState(true);
  const [rewardsError, setRewardsError] = useState<string | null>(null);

  // Fetch rewards progress from backend on mount
  useEffect(() => {
    async function fetchRewards() {
      setRewardsLoading(true);
      setRewardsError(null);
      try {
        const res = await fetch('/api/user/rewards');
        if (!res.ok) throw new Error('Failed to fetch rewards');
        const data = await res.json();
        setClaimedDay(data.claimedDay || 0);
        setLastClaimDate(data.lastClaimDate || '');
      } catch (err: any) {
        setRewardsError('Could not load rewards');
      } finally {
        setRewardsLoading(false);
      }
    }
    fetchRewards();
  }, []);

  // Claim reward handler (only if a new day)
  const [showAlreadyClaimedMsg, setShowAlreadyClaimedMsg] = useState(false);
  const [alreadyClaimedMsgIdx, setAlreadyClaimedMsgIdx] = useState<number | null>(null);

  const handleClaimReward = async (dayIdx: number) => {
    const todayStr = getTodayString();
    if (dayIdx !== claimedDay) return;
    if (lastClaimDate === todayStr) {
      setAlreadyClaimedMsgIdx(dayIdx);
      setShowAlreadyClaimedMsg(true);
      setTimeout(() => {
        setShowAlreadyClaimedMsg(false);
        setAlreadyClaimedMsgIdx(null);
      }, 1500);
      return;
    }
    let newClaimedDay = dayIdx === dailyRewards.length - 1 ? 0 : dayIdx + 1;
    let newLastClaimDate = dayIdx === dailyRewards.length - 1 ? '' : todayStr;
    setClaimedDay(newClaimedDay);
    setLastClaimDate(newLastClaimDate);
    // Update backend with debug logging
    try {
      console.log('Claiming reward:', { claimedDay: newClaimedDay, lastClaimDate: newLastClaimDate });
      const res = await fetch('/api/user/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimedDay: newClaimedDay, lastClaimDate: newLastClaimDate }),
      });
      const data = await res.json();
      console.log('POST /api/user/rewards response:', res.status, data);
    } catch (err) {
      console.error('Error posting to /api/user/rewards:', err);
    }
    setRewardModalContent({ day: dayIdx, reward: dailyRewards[dayIdx] });
    setShowRewardModal(true);
  };

  // Timer for next claim
  const [nextClaimTimer, setNextClaimTimer] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const updateTimer = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0); // local midnight
      const diff = nextMidnight.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setNextClaimTimer(
          `${hours.toString().padStart(2, '0')}:` +
          `${minutes.toString().padStart(2, '0')}:` +
          `${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setNextClaimTimer('00:00:00');
      }
    };
    updateTimer();
    interval = setInterval(updateTimer, 1000);
    return () => { if (interval) clearInterval(interval); };
  }, [lastClaimDate]);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardModalContent, setRewardModalContent] = useState<{ day: number; reward: typeof dailyRewards[0] } | null>(null);

  // Helper to get today's date string (YYYY-MM-DD)
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
      <header className="bg-white shadow-sm rounded-t-xl px-2 md:px-6 py-3 flex flex-wrap items-center justify-between w-full">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <img src="/globe.svg" alt="Spriggly Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-green-800">Spriggly</span>
        </div>
        <nav className="flex-1 flex justify-center w-full md:w-auto mt-2 md:mt-0">
          <ul className="flex flex-wrap justify-center space-x-4 md:space-x-8 text-green-800 font-medium text-sm md:text-base">
            <li><Link href="/dashboard" className="hover:font-bold">Home</Link></li>
            <li><Link href="/dashboard" className="font-bold underline underline-offset-4">Grow</Link></li>
            <li><Link href="/dashboard/my_plants">My Plants</Link></li>
            <li><Link href="/dashboard/shop">Shop</Link></li>
            <li><Link href="/dashboard/notifications">Notifications</Link></li>
            <li><Link href="/dashboard/profile">Profile</Link></li>
            <li><Link href="/dashboard/settings">Settings</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row bg-[#F4F4F4] p-2 md:p-6 gap-6 w-full max-w-full">
        {/* Left/Main Section */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Home Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 mb-2">Home</h1>

          {/* Welcome Card */}
          <div className="rounded-2xl shadow-lg p-4 md:p-8 bg-gradient-to-br from-green-400 via-yellow-300 to-yellow-200 flex flex-col gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">Welcome back!</h2>
            <p className="text-white font-medium mb-4 text-sm md:text-base">Kickstart your productivity. Sprout your first task today!</p>
            <button className="bg-white text-green-700 font-bold px-5 py-2 rounded-lg shadow hover:bg-green-100 transition w-32">Grow</button>
          </div>

          {/* Daily Rewards */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2">Daily Rewards</h3>
            {rewardsLoading ? (
              <div className="text-gray-500 text-sm py-4">Loading rewards...</div>
            ) : rewardsError ? (
              <div className="text-red-500 text-sm py-4">{rewardsError}</div>
            ) : (
              <div className="flex md:flex-wrap flex-nowrap overflow-x-auto md:overflow-visible gap-2 md:gap-4 mb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                {dailyRewards.map((reward, i) => {
                  const isClaimed = i < claimedDay;
                  const isCurrent = i === claimedDay;
                  const todayStr = getTodayString();
                  const alreadyClaimedToday = isCurrent && lastClaimDate === todayStr;
                  return (
                    <div key={i} className="relative flex flex-col items-center flex-shrink-0 w-24 md:w-1/6 min-w-[90px] max-w-[110px]">
                      <button
                        className={`flex flex-col items-center w-full h-20 rounded-xl shadow transition-all duration-200 border-2 ${isClaimed ? 'bg-yellow-100 border-yellow-300 opacity-60' : isCurrent ? 'bg-yellow-200 border-yellow-400' : 'bg-gray-400 border-gray-400'} ${isCurrent ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}`}
                        disabled={!isCurrent}
                        onClick={() => handleClaimReward(i)}
                        aria-label={reward.label}
                      >
                        <div className="flex items-center justify-center h-12 w-full">{isClaimed ? <FaCoins className="text-yellow-400 text-3xl" /> : isCurrent ? reward.icons : <FaLock className="text-yellow-200 text-3xl" />}</div>
                        <span className={`text-xs font-bold mt-1 ${isClaimed || isCurrent ? 'text-green-800' : 'text-green-800'}`}>{reward.label}</span>
                      </button>
                      {showAlreadyClaimedMsg && alreadyClaimedMsgIdx === i && (
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 shadow z-50" style={{whiteSpace:'nowrap'}}>Already claimed today</div>
                      )}
                      {/* Timer for next claim */}
                      {alreadyClaimedToday && (
                        <div className="mt-1 text-xs text-gray-600">Next reward in <span className="font-mono">{nextClaimTimer}</span></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reward Modal */}
          {showRewardModal && rewardModalContent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs flex flex-col items-center border-2 border-yellow-200">
                <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Congratulations!</h2>
                <div className="mb-2 text-lg text-green-800 font-semibold text-center">You've claimed your Day {rewardModalContent.day + 1} reward:</div>
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="flex gap-2 items-center justify-center">
                    {dailyRewards[rewardModalContent.day].icons}
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    {dailyRewards[rewardModalContent.day].coins} coins<br />
                    {dailyRewards[rewardModalContent.day].booster && <span>+ {dailyRewards[rewardModalContent.day].booster}<br /></span>}
                    {dailyRewards[rewardModalContent.day].seed && <span>+ {dailyRewards[rewardModalContent.day].seed}<br /></span>}
                  </div>
                </div>
                <button className="mt-2 bg-yellow-200 text-green-800 font-bold px-8 py-2 rounded-lg shadow hover:bg-yellow-100 transition" onClick={() => setShowRewardModal(false)}>Close</button>
              </div>
            </div>
          )}

          {/* Recent Progress */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2">Recent</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Progress Card */}
              <div className="flex-1 rounded-2xl shadow-lg bg-gradient-to-br from-green-200 via-green-100 to-yellow-100 flex items-center p-4 md:p-8 min-h-[140px]">
                <span className="text-4xl md:text-6xl font-extrabold text-green-800 mr-4 md:mr-8">53%</span>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-green-800 font-medium mb-2 text-sm md:text-base">Your Wild Cactus is almost complete. Continue growing now!</span>
                  <button className="bg-yellow-200 text-green-800 font-bold px-5 py-2 rounded-lg shadow hover:bg-yellow-100 transition w-32">Grow</button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cards: Shop, Focus, My Plants */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mt-2">
            {/* Shop */}
            <Link href="/dashboard/shop" className="rounded-xl bg-green-200 shadow flex flex-col items-center justify-center p-4 min-h-[120px] transition hover:scale-105 cursor-pointer w-full">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2">icon</div>
              <div className="font-bold text-green-800">Shop</div>
              <div className="text-green-800 text-xs text-center">New boosters and seed packs are in stock. Check it out now!</div>
            </Link>
            {/* Focus */}
            <Link href="/dashboard/Focus" className="rounded-xl bg-green-200 shadow flex flex-col items-center justify-center p-4 min-h-[120px] transition hover:scale-105 cursor-pointer w-full">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2">icon</div>
              <div className="font-bold text-green-800">Focus</div>
              <div className="text-green-800 text-xs text-center">Start a productive day with focus sessions and task management.</div>
            </Link>
            {/* My Plants */}
            <Link href="/dashboard/my_plants" className="rounded-xl bg-green-200 shadow flex flex-col items-center justify-center p-4 min-h-[120px] transition hover:scale-105 cursor-pointer w-full">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2">icon</div>
              <div className="font-bold text-green-800">My Plants</div>
              <div className="text-green-800 text-xs text-center">Stay updated on tasks, plant growth, and rewards.</div>
            </Link>
          </div>
        </section>

        {/* Sidebar: Profile Card + Leaderboard */}
        <aside className="w-full md:w-80 bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col gap-6 border-l border-gray-200 mt-8 md:mt-0 min-w-0">
          {/* Profile Card */}
          <div className="w-full rounded-2xl shadow bg-white flex flex-col items-center justify-center p-4 md:p-6 mb-2">
            <div className="w-16 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <span className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="9" r="3.5" fill="#b0b7be" /><path d="M12 14c-4 0-6 2-6 3.5V19h12v-1.5c0-1.5-2-3.5-6-3.5z" fill="#b0b7be" /></svg>
              </span>
            </div>
            <div className="font-bold text-green-800 text-lg text-center">{session?.user?.name || 'Username'}</div>
            <div className="text-gray-500 text-sm mb-3 text-center">Level #</div>
            <button className="bg-yellow-200 text-green-800 font-bold px-6 py-1 rounded shadow hover:bg-yellow-100 transition text-sm">View</button>
          </div>
          {/* Leaderboard */}
          <h3 className="text-lg md:text-xl font-bold text-green-800 mb-4">Leaderboard</h3>
          <LeaderboardSidebar />
        </aside>
      </main>
    </div>
  );
}

function LeaderboardSidebar() {
  const [users, setUsers] = useState<{ _id?: string; name?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError('Could not load leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  const displayUsers = users.slice(0, 3);

  return (
    <div>
      <div
        className="flex flex-col gap-4"
        aria-label="Leaderboard user list"
      >
        {displayUsers.map((user, i) => (
          <div key={user._id || user.name || i} className="flex items-center bg-yellow-200 rounded-xl p-4 shadow">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-500 mr-4">
              <svg className="w-8 h-8 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="User avatar"><circle cx="12" cy="9" r="3.5" fill="#b0b7be" /><path d="M12 14c-4 0-6 2-6 3.5V19h12v-1.5c0-1.5-2-3.5-6-3.5z" fill="#b0b7be" /></svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-green-800">{user.name || 'Username'}</div>
              <div className="text-gray-600 text-xs">Level #</div>
              <div className="text-gray-600 text-xs">XP: #   S:#</div>
            </div>
          </div>
        ))}
      </div>
      {users.length > 3 && (
        <button
          className="bg-yellow-200 text-green-800 font-bold px-4 py-1 rounded shadow hover:bg-yellow-100 transition text-sm mt-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="View all users"
          onClick={() => router.push('/dashboard/leaderboard')}
        >
          View all
        </button>
      )}
    </div>
  );
}
