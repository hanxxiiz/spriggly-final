'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaLeaf } from 'react-icons/fa';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      // Validate password change if new password is provided
      if (newPassword) {
        if (!password) {
          setMessage('Current password is required to change password');
          setLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setMessage('New passwords do not match');
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          setMessage('New password must be at least 6 characters long');
          setLoading(false);
          return;
        }
      }

      const updateData: any = {
        name: username,
        email: email,
      };

      if (newPassword) {
        updateData.currentPassword = password;
        updateData.newPassword = newPassword;
      }

      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      
      // Clear password fields after successful update
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Update session data if needed
      if (data.user) {
        // You might want to refresh the session here
        // For now, we'll just show success message
      }

    } catch (error: any) {
      setMessage(error.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback redirect
      router.push('/');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="text-[#6b942e] text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-300 rounded-t-2xl px-6 py-3 flex justify-between items-center" style={{borderTopLeftRadius: '16px', borderTopRightRadius: '16px'}}>
        <div className="flex items-center gap-2">
          <FaLeaf className="text-[#8dbb2b] text-2xl" />
          <span className="text-2xl font-extrabold text-[#6b942e]">Spriggly</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex gap-8 items-center font-semibold text-[#6b942e]">
            <Link href="/dashboard" className="hover:text-[#8dbb2b] transition">Home</Link>
            <Link href="/dashboard?tab=grow" className="hover:text-[#8dbb2b] transition">Grow</Link>
            <Link href="/dashboard?tab=plants" className="hover:text-[#8dbb2b] transition">My Plants</Link>
            <Link href="/dashboard?tab=shop" className="hover:text-[#8dbb2b] transition">Shop</Link>
            <span className="hover:text-[#8dbb2b] transition cursor-pointer">Notifications</span>
            <span className="hover:text-[#8dbb2b] transition cursor-pointer">Profile</span>
            <Link href="/dashboard/settings" className="hover:text-[#8dbb2b] transition font-bold">Settings</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Add icon here if needed */}
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#6b942e] mb-6 mt-2">Settings</h2>
        
        {/* Current User Info */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 max-w-xl mx-auto border border-gray-300" style={{boxShadow: '0 2px 8px #b6d36b33'}}>
          <h3 className="text-xl font-semibold text-[#6b942e] mb-4">Current Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Username:</span>
              <span className="text-[#6b942e] font-semibold">{session?.user?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-[#6b942e] font-semibold">{session?.user?.email || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Member since:</span>
              <span className="text-[#6b942e] font-semibold">
                {session?.user?.id ? 'Active' : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="bg-white rounded-2xl shadow p-8 max-w-xl mx-auto border border-gray-300" style={{boxShadow: '0 2px 8px #b6d36b33'}}>
          <form onSubmit={handleUpdate} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-[#6b942e] font-medium text-base">Username</label>
              <input
                type="text"
                className="border border-[#6b942e] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-base bg-white text-[#222] placeholder-[#b6d36b]"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#6b942e] font-medium text-base">Email</label>
              <input
                type="email"
                className="border border-[#6b942e] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-base"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#6b942e] font-medium text-base">Current Password</label>
              <input
                type="password"
                className="border border-[#6b942e] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-base"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter current password to change password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#6b942e] font-medium text-base">New Password</label>
              <input
                type="password"
                className="border border-[#6b942e] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-base"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (optional)"
                minLength={6}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#6b942e] font-medium text-base">Confirm New Password</label>
              <input
                type="password"
                className="border border-[#6b942e] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-base"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-b from-[#8dbb2b] to-[#b6d36b] text-white font-extrabold py-3 rounded-lg shadow-md text-base transition hover:brightness-105"
              disabled={loading}
              style={{boxShadow: '0 4px 8px #b6d36b55'}}
            >
              {loading ? 'Saving...' : 'Confirm Changes'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 text-center font-semibold text-base p-3 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow p-6 mt-6 max-w-xl mx-auto border border-red-200" style={{boxShadow: '0 2px 8px #b6d36b33'}}>
          <h3 className="text-xl font-semibold text-red-600 mb-4">Account Actions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[#6b942e] font-medium">Sign Out</h4>
                <p className="text-sm text-gray-600">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}