import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch leaderboard data');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <p className="text-lg font-medium text-gray-900 mb-2">All users:</p>
          <ul className="list-disc pl-6">
            {users.map((user) => (
              <li key={user._id} className="text-base text-gray-800">{user.name}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-500">Total: <span className="font-bold">{users.length}</span></p>
        </div>
      )}
    </div>
  );
} 