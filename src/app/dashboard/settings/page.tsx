'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

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
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-2 sm:px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-3 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center border-2 border-[#b6d36b]" style={{borderRadius: '20px', border: '2px solid #b6d36b', boxShadow: '0 8px 24px #b6d36b33'}}>
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-3 right-3 text-[#6b942e] hover:text-[#8dbb2b] text-xl font-bold focus:outline-none"
          aria-label="Back to dashboard"
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center text-[#6b942e] mb-4 sm:mb-6 md:mb-8" style={{fontFamily: 'inherit'}}>Settings</h2>
        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[#6b942e] font-medium ml-1 sm:ml-2 text-xs sm:text-sm">Username</label>
            <input
              type="text"
              className="border border-[#6b942e] rounded-md px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-xs sm:text-sm bg-white text-[#222] placeholder-[#b6d36b]"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[#6b942e] font-medium ml-1 sm:ml-2 text-xs sm:text-sm">Email</label>
            <input
              type="email"
              className="border border-[#6b942e] rounded-md px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-xs sm:text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[#6b942e] font-medium ml-1 sm:ml-2 text-xs sm:text-sm">Password</label>
            <input
              type="password"
              className="border border-[#6b942e] rounded-md px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-xs sm:text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=""
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 sm:mt-3 bg-gradient-to-b from-[#8dbb2b] to-[#d3e86b] text-white font-extrabold py-2 sm:py-2.5 rounded-lg shadow-md text-sm sm:text-base transition hover:brightness-105"
            disabled={loading}
            style={{boxShadow: '0 4px 8px #b6d36b55'}}
          >
            {loading ? 'Saving...' : 'Confirm Changes'}
          </button>
        </form>
        <button
          onClick={handleSignOut}
          className="w-full mt-2 sm:mt-3 bg-gradient-to-b from-[#8dbb2b] to-[#d3e86b] text-white font-extrabold py-2 sm:py-2.5 rounded-lg shadow-md text-sm sm:text-base transition hover:brightness-105"
          style={{boxShadow: '0 4px 8px #b6d36b55'}}
        >
          Sign Out
        </button>
        {message && <div className="mt-2 sm:mt-3 text-center text-[#6b942e] font-semibold text-xs sm:text-sm">{message}</div>}
      </div>
    </div>
  );
}