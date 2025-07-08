'use client';

import React, { useState, useEffect } from 'react';
import ShopNavbar from '../../../components/ShopNavbar';
import { useSession } from 'next-auth/react';

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  averageFocusTime: string;
  profilePictureUrl: string | null;
}

function getInitials(name: string) {
  return name && name.length > 0 ? name[0].toUpperCase() : '';
}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <ShopNavbar />
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <ShopNavbar />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ShopNavbar />
      <div className="flex flex-col items-center pt-12">
        <div className="w-full max-w-4xl px-4">
          {/* Header */}
          <div className="rounded-t-2xl px-6 py-4 bg-gradient-to-r from-yellow-200 to-lime-200 shadow flex items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <span className="text-2xl font-bold text-lime-700">Leaderboard</span>
            </div>
          </div>

          {/* Top 3 Cards */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-8 mb-8 w-full">
            {topThree.map((user, idx) => (
              <div
                key={user.rank}
                className={`relative flex flex-col items-center bg-white rounded-2xl shadow-lg px-6 py-5 sm:px-8 sm:py-6 border-4 w-full sm:w-auto mx-auto ${
                  idx === 0
                    ? 'border-yellow-300 z-20 sm:scale-110'
                    : idx === 1
                    ? 'border-lime-300 z-10'
                    : 'border-green-200 z-10'
                }`}
                style={{ minWidth: 0, maxWidth: 220 }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div
                    className={`rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-md border-4 ${
                      idx === 0
                        ? 'bg-yellow-200 border-yellow-300 text-yellow-700'
                        : idx === 1
                        ? 'bg-lime-200 border-lime-300 text-lime-700'
                        : 'bg-green-100 border-green-200 text-green-700'
                    }`}
                  >
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                  </div>
                </div>
                <div className="mt-8 mb-3">
                  <div className="w-16 h-16 rounded-full bg-lime-400 border-4 border-white flex items-center justify-center text-2xl font-bold text-white shadow">
                    {user.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                </div>
                <div className="text-lg font-bold text-lime-700 mb-1 text-center break-words">@{user.name}</div>
                <div className="text-sm text-gray-500 mb-2 text-center">
                  XP: <span className="font-semibold text-green-800">{user.xp}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Avg Focus: <span className="font-semibold">{user.averageFocusTime}</span>
                </div>
              </div>
            ))}
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
                        <span className="truncate max-w-[120px]">@{user.name}</span>
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
    </div>
  );
};

export default LeaderboardPage; 