'use client';

import React from 'react';
import ShopNavbar from '../../../components/ShopNavbar';

const leaderboardData = [
  { rank: 1, name: 'Aaron', score: 1500 },
  { rank: 2, name: 'Hannah', score: 1200 },
  { rank: 3, name: 'Shayne', score: 1100 },
  { rank: 4, name: 'Rio', score: 950 },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const LeaderboardPage = () => {
  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gray-100">
      <ShopNavbar />
      <div className="flex flex-col items-center pt-12">
        <div className="w-full max-w-4xl">
          <div className="rounded-t-2xl px-6 py-3 bg-yellow-200 shadow flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-2xl font-bold text-lime-700">Leaderboard</span>
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
                <div className="mt-8 mb-2">
                  <div className="w-16 h-16 rounded-full bg-lime-400 border-4 border-white flex items-center justify-center text-3xl font-bold text-white shadow">
                    {getInitials(user.name)}
                  </div>
                </div>
                <div className="text-lg font-bold text-lime-700 mb-1 text-center break-words">{user.name}</div>
                <div className="text-sm text-gray-500 mb-2 text-center">Exp: <span className="font-semibold text-green-800">{user.score}</span></div>
              </div>
            ))}
          </div>
          {/* Rest of Leaderboard */}
          {rest.length > 0 && (
            <div className="bg-white rounded-b-2xl shadow px-2 sm:px-4 pb-6 pt-2 overflow-x-auto">
              <table className="w-full min-w-[340px] mt-6 text-sm sm:text-base">
                <thead>
                  <tr className="text-left text-green-800 font-bold border-b">
                    <th className="py-2">Rank</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Exp</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((user) => (
                    <tr key={user.rank} className="border-b last:border-b-0 hover:bg-lime-50 transition">
                      <td className="py-3 font-bold text-lg text-lime-700">{user.rank}</td>
                      <td className="py-3 text-gray-800 font-semibold flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-lime-200 flex items-center justify-center text-lg font-bold text-lime-700 mr-2">
                          {getInitials(user.name)}
                        </span>
                        <span className="truncate max-w-[100px] sm:max-w-none">{user.name}</span>
                      </td>
                      <td className="py-3 text-gray-800 font-semibold">{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 