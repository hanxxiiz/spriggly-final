'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.error || 'Update failed.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]" style={{borderRadius: '20px'}}>
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl flex flex-col items-center" style={{borderRadius: '20px', border: 'none'}}>
        <h2 className="text-4xl font-extrabold text-center text-[#6b942e] mb-10" style={{fontFamily: 'inherit'}}>Settings</h2>
        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[#6b942e] font-medium ml-2">Username</label>
            <input
              type="text"
              className="border border-[#6b942e] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#6b942e] font-medium ml-2">Email</label>
            <input
              type="email"
              className="border border-[#6b942e] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#6b942e] font-medium ml-2">Password</label>
            <input
              type="password"
              className="border border-[#6b942e] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=""
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-b from-[#8dbb2b] to-[#d3e86b] text-white font-extrabold py-3 rounded-lg shadow-md text-lg transition hover:brightness-105"
            disabled={loading}
            style={{boxShadow: '0 4px 8px #b6d36b55'}}
          >
            {loading ? 'Saving...' : 'Confirm Changes'}
          </button>
        </form>
        <button
          onClick={handleSignOut}
          className="w-full mt-4 bg-gradient-to-b from-[#8dbb2b] to-[#d3e86b] text-white font-extrabold py-3 rounded-lg shadow-md text-lg transition hover:brightness-105"
          style={{boxShadow: '0 4px 8px #b6d36b55'}}
        >
          Sign Out
        </button>
        {message && <div className="mt-4 text-center text-[#6b942e] font-semibold">{message}</div>}
      </div>
    </div>
  );
}