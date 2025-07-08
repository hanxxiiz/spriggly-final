'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaLeaf } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/components/NavigationBar';
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

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
        credentials: 'include',
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
      // Dispatch event so other pages can refresh profile
      window.dispatchEvent(new CustomEvent('profileUpdated'));

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
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Navigation Bar */}
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6b942e] mb-4 sm:mb-6 mt-2">Settings</h2>
        
        {/* Current User Info */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 mb-4 sm:mb-6 max-w-2xl mx-auto border border-gray-300" style={{boxShadow: '0 2px 8px #b6d36b33'}}>
          <h3 className="text-lg sm:text-xl font-semibold text-[#6b942e] mb-3 sm:mb-4">Current Information</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Username:</span>
              <span className="text-[#6b942e] font-semibold text-sm sm:text-base">{session?.user?.name || 'Not set'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Email:</span>
              <span className="text-[#6b942e] font-semibold text-sm sm:text-base break-all">{session?.user?.email || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border border-gray-300" style={{boxShadow: '0 2px 8px #b6d36b33'}}>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-[#6b942e] font-medium text-sm sm:text-base">Username</label>
              <input
                type="text"
                className="border border-[#6b942e] rounded-md px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-sm sm:text-base bg-white text-[#222] placeholder-[#b6d36b]"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-[#6b942e] font-medium text-sm sm:text-base">Current Password</label>
              <input
                type="password"
                className="border border-[#6b942e] rounded-md px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-sm sm:text-base"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter current password to change password"
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-[#6b942e] font-medium text-sm sm:text-base">New Password</label>
              <input
                type="password"
                className="border border-[#6b942e] rounded-md px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-sm sm:text-base"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (optional)"
                minLength={6}
              />
            </div>
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-[#6b942e] font-medium text-sm sm:text-base">Confirm New Password</label>
              <input
                type="password"
                className="border border-[#6b942e] rounded-md px-3 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-[#b6d36b] transition w-full text-sm sm:text-base"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 sm:mt-4 bg-gradient-to-b from-[#8dbb2b] to-[#b6d36b] text-white font-extrabold py-2 sm:py-3 rounded-lg shadow-md text-sm sm:text-base transition hover:brightness-105"
              disabled={loading}
              style={{boxShadow: '0 4px 8px #b6d36b55'}}
            >
              {loading ? 'Saving...' : 'Confirm Changes'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 text-center font-semibold text-sm sm:text-base p-3 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 mt-4 sm:mt-6 max-w-2xl mx-auto border border-red-200" style={{boxShadow: '0 2px 8px #b6d36b33'}}>
          <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-3 sm:mb-4">Account Actions</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h4 className="text-[#6b942e] font-medium text-sm sm:text-base">Sign Out</h4>
                <p className="text-xs sm:text-sm text-gray-600">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
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