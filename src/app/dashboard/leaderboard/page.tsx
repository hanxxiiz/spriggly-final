'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/NavigationBar';
import { useSession } from 'next-auth/react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  averageFocusTime: string;
  profilePictureUrl: string | null;
}

interface LeaderboardCardProps {
  user: LeaderboardUser;
  size?: 'small' | 'large';
  hoverColor?: 'gold' | 'silver' | 'bronze';
}

function getInitials(name: string) {
  return name && name.length > 0 ? name[0].toUpperCase() : '';
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ user, size = 'small', hoverColor = 'gold' }) => {
  const isLarge = size === 'large';
  
  const hoverColorClasses = {
    gold: 'hover:border-yellow-400 hover:shadow-yellow-400/30',
    silver: 'hover:border-gray-400 hover:shadow-gray-400/30',
    bronze: 'hover:border-amber-600 hover:shadow-amber-600/30'
  };

  const rankIcons = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  return (
    <div
      className={`
        box-border bg-white/60 border border-white shadow-lg backdrop-blur-md rounded-2xl
        text-center cursor-pointer transition-all duration-500 flex flex-col items-center justify-center
        select-none font-bold text-black active:scale-95 active:rotate-1
        ${isLarge ? 'w-48 h-64 scale-110' : 'w-44 h-56'}
        ${hoverColorClasses[hoverColor]}
        hover:scale-105 hover:shadow-xl
      `}
    >
      {/* Rank Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <div className={`
          rounded-full flex items-center justify-center text-2xl font-bold shadow-md border-2 bg-white
          ${isLarge ? 'w-12 h-12' : 'w-10 h-10'}
          ${hoverColor === 'gold' ? 'border-yellow-400 text-yellow-600' : 
            hoverColor === 'silver' ? 'border-gray-400 text-gray-600' : 
            'border-amber-600 text-amber-600'}
        `}>
          {rankIcons[user.rank as keyof typeof rankIcons]}
        </div>
      </div>

      {/* Profile Picture */}
      <div className={`
        rounded-full bg-emerald-900 flex items-center justify-center
        text-white shadow-md font-bold mb-3 mt-4
        ${isLarge ? 'w-25 h-25 text-xl' : 'w-20 h-20 text-lg'}
      `}>
        {user.profilePictureUrl ? (
          <img 
            src={user.profilePictureUrl} 
            alt={user.name} 
            className="w-full h-full object-cover rounded-full" 
          />
        ) : (
          getInitials(user.name)
        )}
      </div>

      {/* User Name */}
      <div className={`
        text-slate-900 text-center break-words px-2 font-bold
        ${isLarge ? 'text-lg' : 'text-base'}
      `}>
        @{user.name}
      </div>

      {/* XP */}
      <div className={`
        text-[#e3ef26] mb-1 text-center font-semibold
        ${isLarge ? 'text-sm' : 'text-xs'}
      `}>
        XP: <span className="text-green-800">{user.xp}</span>
      </div>

      {/* Average Focus Time */}
      <div className={`
        text-gray-500 text-center font-medium
        ${isLarge ? 'text-xs' : 'text-xs'}
      `}>
        Avg: <span className="font-medium">{user.averageFocusTime}</span>
      </div>
    </div>
  );
};

const LeaderboardPage = () => {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  if (error) {
    return (
      <>
        <Navbar />
        <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen pt-18 py-4 px-4 sm:px-6 lg:px-8 relative`}>
          <div className="flex items-center justify-center pt-20">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Error loading leaderboard</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchLeaderboard}
                className="mt-4 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen pt-18 py-4 px-4 sm:px-6 lg:px-8 relative`}>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl px-4">
            {/* Header */}
            <div className="rounded-t-2xl px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-800 shadow flex items-center justify-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white">Leaderboard</span>
              </div>
            </div>

            {/* Top 3 Cards */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-15 mt-12 mb-12 w-full">
              {topThree.length >= 2 && (
                <div className="relative">
                  <LeaderboardCard 
                    user={topThree[1]} 
                    size="small" 
                    hoverColor="silver"
                  />
                </div>
              )}
              
              {topThree.length >= 1 && (
                <div className="relative">
                  <LeaderboardCard 
                    user={topThree[0]} 
                    size="large" 
                    hoverColor="gold"
                  />
                </div>
              )}
              
              {topThree.length >= 3 && (
                <div className="relative">
                  <LeaderboardCard 
                    user={topThree[2]} 
                    size="small" 
                    hoverColor="bronze"
                  />
                </div>
              )}
            </div>

            {/* Rest of Leaderboard */}
            {rest.length > 0 && (
              <div className="bg-white rounded-b-2xl shadow px-2 sm:px-4 pb-6 pt-2 overflow-x-auto">
                <table className="w-full min-w-[400px] mt-6 text-sm sm:text-base">
                  <thead>
                    <tr className="text-left text-green-800 font-bold border-b">
                      <th className="py-3 px-2">Rank</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">XP</th>
                      <th className="py-3 px-2">Avg Focus Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((user) => (
                      <tr key={user.rank} className="border-b last:border-b-0 hover:bg-lime-50 transition">
                        <td className="py-3 px-2 font-bold text-lg text-lime-700">{user.rank}</td>
                        <td className="py-3 px-2 text-gray-800 font-semibold flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-lime-200 flex items-center justify-center text-sm font-bold text-lime-700">
                            {user.profilePictureUrl ? (
                              <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              getInitials(user.name)
                            )}
                          </span>
                          <span className="truncate max-w-full">@{user.name}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-800 font-semibold">{user.xp}</td>
                        <td className="py-3 px-2 text-gray-800 font-semibold">{user.averageFocusTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {leaderboardData.length === 0 && !loading && (
              <div className="bg-white rounded-b-2xl shadow px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">No leaderboard data available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default LeaderboardPage;