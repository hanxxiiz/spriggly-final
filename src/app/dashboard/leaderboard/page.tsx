'use client';

import React from 'react';
import ShopNavbar from '../../../components/ShopNavbar';

const leaderboardData = [
  { rank: 1, name: 'Aaron', score: 1500 },
  { rank: 2, name: 'Hannah', score: 1200 },
  { rank: 3, name: 'Shayne', score: 1100 },
  { rank: 4, name: 'Rio', score: 950 },
];

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ShopNavbar />
      <div className="flex justify-center items-start pt-12">
        <div className="w-full max-w-2xl">
          <div className="rounded-t-2xl px-6 py-3 bg-yellow-200 shadow flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span className="text-2xl font-bold text-lime-700">Leaderboard</span>
          </div>
          <div className="bg-white rounded-b-2xl shadow px-4 pb-6 pt-2">
            <table className="w-full mt-6">
              <thead>
                <tr className="text-left text-green-800 font-bold border-b">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Exp</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <tr key={user.rank} className="border-b last:border-b-0 hover:bg-lime-50 transition">
                    <td className="py-3 font-bold text-lg text-lime-700">{user.rank}</td>
                    <td className="py-3 text-gray-800 font-semibold">{user.name}</td>
                    <td className="py-3 text-gray-800 font-semibold">{user.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 