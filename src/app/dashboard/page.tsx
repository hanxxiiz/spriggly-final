'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FaLock, FaCoins } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const REWARD_DAYS = 7;

type DailyRewards = {
  currentDay: number;
  lastClaimed: string | null;
  alreadyClaimed: boolean;
  reset: boolean;
  claimedDays?: string[];
};

function getNextMidnight(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getTimeDiffString(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return '00:00:00';
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Remove leaderboard fetch logic and use static users
const staticLeaderboardUsers = [
  { name: 'Aaron', level: 5, xp: 1500, money: 200 },
  { name: 'Hannah', level: 4, xp: 1200, money: 150 },
  { name: 'Shayne', level: 3, xp: 1100, money: 100 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const username = session?.user?.name || 'Username';
  const userLevel = 'Level #'; // Always show placeholder

  // Daily rewards state
  const [dailyRewards, setDailyRewards] = useState<DailyRewards>({ currentDay: 1, lastClaimed: null, alreadyClaimed: false, reset: false });
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsDay, setCongratsDay] = useState(1);
  const [timer, setTimer] = useState('');

  // Timer effect for next reward
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const claimedDays = dailyRewards.claimedDays || [];
    const claimedToday = claimedDays.includes(getTodayStr());
    if (claimedToday) {
      const updateTimer = () => {
        const nextMidnight = getNextMidnight();
        setTimer(getTimeDiffString(nextMidnight));
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setTimer('');
    }
    return () => interval && clearInterval(interval);
  }, [dailyRewards.claimedDays?.length, (dailyRewards.claimedDays || []).includes(getTodayStr())]);

  // Fetch daily rewards info on mount
  useEffect(() => {
    async function fetchRewards() {
      setLoadingRewards(true);
      try {
        const res = await fetch('/api/auth/update', { method: 'GET', cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.dailyRewards) setDailyRewards(data.dailyRewards);
        }
      } catch (e) {}
      setLoadingRewards(false);
    }
    fetchRewards();
  }, []);

  // Claim daily reward
  async function claimReward(day: number) {
    setClaiming(true);
    try {
      const res = await fetch('/api/auth/update', { method: 'PATCH', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.dailyRewards) {
          setDailyRewards(data.dailyRewards);
          setCongratsDay(day);
          setShowCongrats(true);
        }
      }
      // Refetch to ensure up-to-date state
      const getRes = await fetch('/api/auth/update', { method: 'GET', cache: 'no-store' });
      if (getRes.ok) {
        const data = await getRes.json();
        if (data.dailyRewards) setDailyRewards(data.dailyRewards);
      }
    } finally {
      setClaiming(false);
    }
  }

  // Debug: log dailyRewards state
  console.log('dailyRewards', dailyRewards);

  // Determine reward state for each day using claimedDays from backend
  function getRewardState(day: number) {
    const todayStr = getTodayStr();
    const claimedDays = dailyRewards.claimedDays || [];
    // Day 1 is the first claim, Day 2 is the second, etc.
    if (claimedDays.length === 0) return day === 1 ? 'current' : 'locked';
    if (day < claimedDays.length + 1) return 'claimed';
    if (day === claimedDays.length + 1) {
      // Only allow claim if today is not in claimedDays
      return claimedDays.includes(todayStr) ? 'claimed' : 'current';
    }
    return 'locked';
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center py-4">
      {/* Header/NavBar */}
      <header className="w-full max-w-7xl bg-white rounded-xl shadow px-6 py-3 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <img src="/globe.svg" alt="Spriggly Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-green-800">Spriggly</span>
        </div>
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8 text-green-800 font-medium">
            <li>
              <span
                className="font-bold border-b-2 border-green-800 pb-1 cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                Home
              </span>
            </li>
            <li>
              <span className="hover:underline cursor-pointer" onClick={() => router.push('/dashboard/grow')}>Grow</span>
            </li>
            <li>
              <span className="hover:underline cursor-pointer" onClick={() => router.push('/dashboard/my_plants')}>My Plants</span>
            </li>
            <li>
              <span className="hover:underline cursor-pointer" onClick={() => router.push('/dashboard/shop')}>Shop</span>
            </li>
            <li>
              <span className="hover:underline cursor-pointer" onClick={() => router.push('/dashboard/notifications')}>Notifications</span>
            </li>
            <li>
              <span className="hover:underline cursor-pointer" onClick={() => router.push('/dashboard/profile')}>Profile</span>
            </li>
            <li>
              <span className="hover:underline cursor-pointer" onClick={() => router.push('/dashboard/settings')}>Settings</span>
            </li>
          </ul>
        </nav>
      </header>

      <main className="w-full max-w-7xl flex flex-col gap-6">
        {/* Top Row: Welcome + Profile */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Welcome Card */}
          <div className="flex-1 rounded-2xl shadow-lg p-8 bg-gradient-to-r from-green-400 via-yellow-300 to-yellow-200 flex flex-col justify-between min-h-[160px]">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Welcome back!</h2>
              <p className="text-white font-medium mb-4">Kickstart your productivity. Sprout your first task today!</p>
            </div>
            <button className="bg-white text-green-700 font-bold px-5 py-2 rounded-lg shadow hover:bg-green-100 transition w-32">Grow</button>
          </div>
          {/* Profile Card */}
          <div className="w-full md:w-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 bg-gray-300 rounded-xl mb-4" />
            <div className="text-green-900 font-bold text-lg mb-1">
              {status === 'loading' ? 'Loading...' : username}
            </div>
            <div className="text-gray-500 mb-2">{userLevel}</div>
            <button className="bg-yellow-200 text-green-900 font-bold px-6 py-1 rounded-lg shadow">View</button>
          </div>
        </div>

        {/* Daily Rewards */}
        <div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Daily Rewards</h3>
          <div className="flex items-center space-x-4">
            {Array.from({ length: REWARD_DAYS }, (_, i) => {
              const day = i + 1;
              const state = getRewardState(day);
              const isCurrent = state === 'current';
              const isClaimed = state === 'claimed';
              const isLocked = state === 'locked';
              return (
                <div key={day} className="flex flex-col items-center">
                  <button
                    disabled={
                      !isCurrent || claiming || (dailyRewards.claimedDays || []).includes(getTodayStr())
                    }
                    onClick={
                      isCurrent && !(dailyRewards.claimedDays || []).includes(getTodayStr())
                        ? () => claimReward(day)
                        : undefined
                    }
                    className={`w-24 h-24 rounded-xl shadow flex flex-col items-center justify-center transition font-bold text-xs
                      ${isClaimed ? 'bg-yellow-200 text-gray-700' : ''}
                      ${isCurrent ? 'bg-yellow-200 text-gray-700 hover:scale-105 cursor-pointer' : ''}
                      ${isLocked ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : ''}
                      ${(dailyRewards.claimedDays || []).includes(getTodayStr()) ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    style={{ outline: isCurrent ? '2px solid #B6C24B' : undefined }}
                  >
                    {isClaimed || isCurrent ? (
                      <>
                        <FaCoins className="text-yellow-500 text-3xl mb-1" />
                        <span>+4 Coins</span>
                        <span className="mt-1">Day {day}</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="text-yellow-500 text-3xl mb-1" />
                        <span className="mt-1">Day {day}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          {/* Timer below the rewards row */}
          {(dailyRewards.claimedDays || []).includes(getTodayStr()) && (
            <div className="w-full flex justify-center mt-3">
              <span className="text-base text-red-700 font-bold bg-white bg-opacity-90 px-4 py-2 rounded shadow border border-red-300 animate-pulse">
                Next reward in: {timer || '00:00:00'}
              </span>
            </div>
          )}
        </div>

        {/* Congrats Modal */}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-xs w-full">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-xl font-bold text-green-800 mb-2">Congratulations!</div>
              <div className="text-green-900 mb-4">You received <span className="font-bold">+4 Coins</span> for Day {congratsDay}.</div>
              <button
                className="bg-yellow-200 text-green-900 font-bold px-6 py-2 rounded-lg shadow hover:bg-yellow-300"
                onClick={() => setShowCongrats(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Middle Row: Recent + Leaderboard */}
        <div className="flex flex-col md:flex-row gap-6 mt-2">
          {/* Recent Progress */}
          <div className="flex-1 rounded-2xl shadow-lg p-8 bg-gradient-to-r from-green-400 to-yellow-200 flex items-center min-h-[160px]">
            <div className="flex-1 flex items-center">
              <span className="text-6xl md:text-7xl font-extrabold text-green-900 mr-6">53%</span>
              <div>
                <div className="text-green-900 font-semibold mb-2">Your Wild Cactus is almost complete.<br />Continue growing now!</div>
                <button className="bg-yellow-200 text-green-900 font-bold px-6 py-1 rounded-lg shadow mt-2">Grow</button>
              </div>
            </div>
          </div>
          {/* Leaderboard */}
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-lg flex flex-col p-6">
            <h4 className="text-green-800 font-bold text-lg mb-4">Leaderboard</h4>
            {staticLeaderboardUsers.map((user, i) => (
              <div key={user.name} className="flex items-center bg-yellow-200 rounded-xl p-3 mb-3 last:mb-0">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center font-bold text-lg">
                  {user.name ? user.name[0].toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-green-900">{user.name}</div>
                  <div className="text-xs text-gray-700">Level {user.level}</div>
                  <div className="text-xs text-gray-700">XP: {user.xp} &nbsp; $:{user.money}</div>
                </div>
              </div>
            ))}
            <button
              className="bg-yellow-200 text-green-900 font-bold px-6 py-1 rounded-lg shadow mt-4"
              onClick={() => router.push('/dashboard/leaderboard')}
            >
              View all
            </button>
          </div>
        </div>

        {/* Explore Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Shop */}
          <div
            className="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push('/dashboard/shop')}
          >
            <div className="bg-gray-300 rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">Icon</div>
            <div className="flex-1">
              <div className="font-bold text-green-900 text-lg">Shop</div>
              <div className="text-gray-700 text-sm">New boosters and seed packs are in stock. Check it out now!</div>
            </div>
          </div>
          {/* Focus */}
          <div
            className="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push('/dashboard/Focus')}
          >
            <div className="bg-gray-300 rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">Icon</div>
            <div className="flex-1">
              <div className="font-bold text-green-900 text-lg">Focus</div>
              <div className="text-gray-700 text-sm">Start a productive day with focus sessions and task management.</div>
            </div>
          </div>
          {/* My Plants */}
          <div
            className="flex items-center bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push('/dashboard/my_plants')}
          >
            <div className="bg-gray-300 rounded-lg w-12 h-12 flex items-center justify-center mr-4 font-bold">Icon</div>
            <div className="flex-1">
              <div className="font-bold text-green-900 text-lg">My Plants</div>
              <div className="text-gray-700 text-sm">Stay updated on tasks, plant growth, and rewards.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
