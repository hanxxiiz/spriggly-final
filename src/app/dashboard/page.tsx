'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FaLock, FaCoins, FaGift } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/NavigationBar';
import AnimatedOutline from '@/components/AnimatedOutlineCard';
import RecentCard from '@/components/RecentCard';
import { FiShoppingBag, FiTarget } from 'react-icons/fi';
import { ImLeaf } from "react-icons/im";

interface ProfileData {
  username: string;
  totalFocusTime: string;
  tasksCompleted: number;
  plantsCollected: number;
  totalCoinsEarned: number;
  longestStreak: number;
  profilePictureUrl: string | null;
  currentCoins: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  averageFocusTime: string;
  profilePictureUrl: string | null;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Daily rewards state
  const [dailyRewards, setDailyRewards] = useState<DailyRewards>({ currentDay: 1, lastClaimed: null, alreadyClaimed: false, reset: false });
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsDay, setCongratsDay] = useState(1);
  const [timer, setTimer] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const [timerTimeout, setTimerTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Cleanup timer timeout on unmount
  useEffect(() => {
    return () => {
      if (timerTimeout) {
        clearTimeout(timerTimeout);
      }
    };
  }, [timerTimeout]);

  // Fetch profile and leaderboard on mount
  useEffect(() => {
    setProfileLoading(true);
    fetch('/api/profile')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      })
      .catch((err) => setProfileError(err.message))
      .finally(() => setProfileLoading(false));
    setLeaderboardLoading(true);
    fetch('/api/leaderboard')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      })
      .catch((err) => setLeaderboardError(err.message))
      .finally(() => setLeaderboardLoading(false));
  }, []);

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
        const getData = await getRes.json();
        if (getData.dailyRewards) setDailyRewards(getData.dailyRewards);
      }
    } finally {
      setClaiming(false);
    }
  }

  // Handle day click - show timer for locked days
  const handleDayClick = (day: number) => {
    const state = getRewardState(day);
    
    if (state === 'current' && !(dailyRewards.claimedDays || []).includes(getTodayStr())) {
      claimReward(day);
    } else if (state === 'locked') {
      // Show timer for locked days
      setShowTimer(true);
      
      // Clear existing timeout
      if (timerTimeout) {
        clearTimeout(timerTimeout);
      }
      
      // Hide timer after 3 seconds
      const timeout = setTimeout(() => {
        setShowTimer(false);
      }, 3000);
      
      setTimerTimeout(timeout);
    }
  };

  // Debug: log dailyRewards state
  console.log('dailyRewards', dailyRewards);

  // Determine reward state for each day using claimedDays from backend
  function getRewardState(day: number) {
    const claimedDays = dailyRewards.claimedDays || [];
    if (day <= claimedDays.length) return 'claimed';
    if (day === claimedDays.length + 1) return 'current';
    return 'locked';
  }

  function getInitials(name: string) {
    return name && name.length > 0 ? name[0].toUpperCase() : '?';
  }

  return (
    <>
      <Navbar />
      <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen pt-18 py-4 px-4 sm:px-6 lg:px-8 relative`}>
          <div className="flex justify-between items-center mb-5 lg:mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800">Home</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* WELCOME CARD */}
            <AnimatedOutline width="w-full" height="h-70">
              <div className="px-5 py-10">
                <h2 className="text-3xl lg:text-6xl font-bold mb-1">Welcome back!</h2>
                <p className="text-[#E4FE62] text-sm lg:text-lg font-semibold ml-1 lg:ml-2">
                  Kickstart your productivity, Sprout your first task today!
                </p>
                <button 
                  onClick={() => router.push('/dashboard/grow')}
                  className="text-[#0c342c] bg-[#e3ef26] w-30 my-4 p-2 rounded-full text-base lg:text-lg font-bold hover:bg-[#E4FE62] hover:shadow-[0_0_20px_#E4FE62] hover:scale-110 transition-all duration-300 transform hover:animate-pulse cursor-pointer"
                >
                  Grow
                </button>
              </div>
            </AnimatedOutline>

            {/* PROFILE CARD */}
            <div className="w-full md:w-180 bg-white rounded-2xl shadow-lg flex flex-row items-center justify-start p-6 md:p-10 min-w-0 gap-4">
              {profileLoading ? (
                <div className="w-30 h-30 md:w-50 md:h-50 bg-gray-200 rounded-xl flex-shrink-0 animate-pulse" />
              ) : profile && profile.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt={profile.username}
                  className="w-30 h-30 md:w-50 md:h-50 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-30 h-30 md:w-50 md:h-50 bg-gray-300 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl font-bold text-green-900">
                  {profile ? getInitials(profile.username) : '?'}
                </div>
              )}
              <div className="flex flex-col justify-center min-w-0">
                <div className="text-green-900 font-bold text-lg md:text-2xl truncate">
                  {profile ? profile.username : 'Username'}
                </div>
                <div className="text-[#e3ef26] mb-2 text-sm md:text-base">
                  Level {/* You can add real level here if available */}
                </div>
                <div className="text-gray-700 text-xs md:text-sm mb-1">
                  Coins: <span className="font-bold">{profile ? profile.currentCoins : '--'}</span>
                </div>
                <button 
                  onClick={() => router.push('/dashboard/profile')}
                  className="flex-1 text-white font-bold px-5 py-1 text-[10px] lg:text-lg lg:px-10 lg:py-2 rounded-sm lg:rounded-xl border-none cursor-pointer 
                        bg-[#9E1F1F] shadow-sm
                        hover:scale-105 hover:bg-red-600
                        transition-transform duration-300 ease-in-out" 
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Daily Rewards - Updated with connected circle design */}
          <div className="p-6">
            <h3 className="text-lg md:text-xl font-bold text-green-800 mb-1">Daily Rewards</h3>
            
            {/* Connected reward circles */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center overflow-x-auto p-5">
                {Array.from({ length: REWARD_DAYS }, (_, i) => {
                  const day = i + 1;
                  const state = getRewardState(day);
                  const isCurrent = state === 'current';
                  const isClaimed = state === 'claimed';
                  const isLocked = state === 'locked';
                  const isClaimedToday = (dailyRewards.claimedDays || []).includes(getTodayStr());
                  
                  return (
                    <div key={day} className="flex items-center">
                      {/* Reward Circle */}
                      <div className="flex flex-col items-center min-w-[80px] md:min-w-[96px]">
                        <button
                          disabled={claiming}
                          onClick={() => handleDayClick(day)}
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex flex-col items-center justify-center transition-all duration-300 font-bold text-xs
                            ${isClaimed || (isCurrent && isClaimedToday) ? 'bg-yellow-400 text-white shadow-yellow-200 cursor-pointer hover:scale-105' : ''}
                            ${isCurrent && !isClaimedToday ? 'bg-yellow-400 text-white hover:scale-110 cursor-pointer shadow-yellow-200 animate-pulse' : ''}
                            ${isLocked ? 'bg-gray-300 text-gray-500 cursor-pointer hover:scale-105' : ''}
                            ${claiming && isCurrent ? 'animate-spin' : ''}
                          `}
                        >
                          {isClaimed || (isCurrent && isClaimedToday) ? (
                            <>
                              <FaCoins className="text-white text-lg md:text-xl" />
                            </>
                          ) : isCurrent ? (
                            <>
                              <FaGift className="text-white text-lg md:text-xl" />
                            </>
                          ) : (
                            <>
                              <FaLock className="text-gray-400 text-lg md:text-xl" />
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Connection Line */}
                      {i < REWARD_DAYS - 1 && (
                        <div className={`w-8 md:w-20 h-1 lg:h-2 mx-1 rounded-full transition-colors duration-300 ${
                          day < (dailyRewards.claimedDays || []).length + 1 ? 'bg-yellow-400' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Timer - only shows when user clicks an unlocked day */}
            {showTimer && (
              <div className="w-full flex justify-center">
                <div className="text-base text-red-700 font-bold bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-lg border border-red-300 opacity-0 animate-pulse">
                  Next reward in: {timer || '00:00:00'}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 m-2 ">

            {/* RECENT */}
            <RecentCard percentage="58%" plant="Wild Cactus" />

            {/* LEADERBOARD*/}
            <div className="w-full md:w-150 bg-white rounded-2xl shadow-lg flex flex-col p-4 md:p-6 min-w-0">
              <h4 className="text-green-800 font-bold text-base md:text-xl mb-4">Leaderboard</h4>
              {leaderboardLoading ? (
                <div className="text-gray-400">Loading...</div>
              ) : leaderboardError ? (
                <div className="text-red-500">{leaderboardError}</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-gray-400">No leaderboard data</div>
              ) : (
                leaderboard.slice(0, 3).map((user, i) => {
                  const yellowShades = ['#fef08a', '#fde047', '#facc15'];
                  const bgColor = i < 3 ? yellowShades[i] : '#fef9c3';
                  return (
                    <div
                      key={user.name}
                      style={{ backgroundColor: bgColor }}
                      className={`
                        flex items-center rounded-2xl p-2 md:p-3 mb-3 last:mb-0
                        transform transition-all duration-300 cursor-pointer
                        hover:scale-105 hover:shadow-[0_0_15px_#fde047]
                      `}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full mr-3 md:mr-4 flex items-center justify-center font-bold text-lg md:text-2xl overflow-hidden">
                        {user.profilePictureUrl ? (
                          <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-green-900 text-base md:text-xl">{user.name}</div>
                        <div className="text-xs text-gray-700">XP: {user.xp}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div className="flex justify-center mt-2 lg:mt-8">
                <button
                  onClick={() => router.push('/dashboard/leaderboard')}
                  className="
                    text-white font-bold text-xs md:text-sm lg:text-base 
                    px-4 py-1 md:px-6 md:py-2 
                    rounded-md lg:rounded-xl 
                    bg-[#9E1F1F] shadow-sm
                    hover:scale-105 hover:bg-red-600
                    transition-transform duration-300 ease-in-out cursor-pointer
                  "
                >
                  View all
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 m-2">
          {/* Shop */}
          <div
            className="flex items-start bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push('/dashboard/shop')}
          >
            <div className="text-green-900 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mr-4 text-xl md:text-2xl">
              <FiShoppingBag className="h-full w-auto" />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-green-900 text-base md:text-lg">Shop</div>
              <div className="text-gray-700 text-sm md:text-base">
                New boosters and seed packs are in stock. Check it out now!
              </div>
            </div>
          </div>

          {/* Focus */}
          <div
            className="flex items-start bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push('/dashboard/focus')}
          >
            <div className="text-green-900 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mr-4 text-xl md:text-2xl">
              <FiTarget className="h-full w-auto" />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-green-900 text-base md:text-lg">Focus</div>
              <div className="text-gray-700 text-sm md:text-base">
                Start a productive day with focus sessions and task management.
              </div>
            </div>
          </div>

          {/* My Plants */}
          <div
            className="flex items-start bg-white rounded-xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push('/dashboard/my_plants')}
          >
            <div className="text-green-900 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mr-4 text-xl md:text-2xl">
              <ImLeaf  className="h-full w-auto"/>
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-green-900 text-base md:text-lg">My Plants</div>
              <div className="text-gray-700 text-sm md:text-base">
                View your plant collection.
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}