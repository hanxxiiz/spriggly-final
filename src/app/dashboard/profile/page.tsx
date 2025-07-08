'use client'

import React, { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileStatCard from '../../../components/profile-page/ProfileStatCard';
import { ImCamera } from "react-icons/im";

interface UserStats {
  username: string;
  totalFocusTime: string;
  tasksCompleted: number;
  plantsCollected: number;
  totalCoinsEarned: number;
  longestStreak: number;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (session?.user?.id) {
        try {
          console.log('Profile page: Fetching user stats for user ID:', session.user.id);
          const response = await fetch('/api/profile');
          console.log('Profile page: Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Profile page: Received data:', data);
            setUserStats(data);
          } else {
            const errorData = await response.json();
            console.error('Profile page: Failed to fetch user stats:', errorData);
          }
        } catch (error) {
          console.error('Profile page: Error fetching user stats:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Profile page: No session or user ID available');
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [session?.user?.id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // You can handle the file upload here (e.g., send to server)
      alert(`Selected file: ${file.name}`);
    }
  };

  const username = userStats?.username || session?.user?.name || 'User';
  const displayName = username;

  // Default stats while loading or if data is not available
  const stats = [
    { title: 'Total Focus Time', value: userStats?.totalFocusTime || '0h0m', highlight: true },
    { title: 'Tasks Completed', value: userStats?.tasksCompleted || 0 },
    { title: 'Plants Collected', value: userStats?.plantsCollected || 0 },
    { title: 'Total Coins Earned', value: userStats?.totalCoinsEarned || 0 },
    { title: 'Longest Streak', value: userStats?.longestStreak || 0 },
  ];

  return (
    <div className="bg-white min-h-screen w-full flex">
      {/* Left Gray Rectangle */}
      <div className="hidden lg:block w-[140px] bg-gray-200" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col">
          <div className="h-3 flex items-center px-4">
            {/* Optional Nav Component */}
          </div>

          {/* Profile Banner */}
          <div className="mx-6 mb-8">
            <div className="relative rounded-2xl overflow-hidden h-60 w-full">
              <div
                className="absolute inset-0 bg-gradient-to-br from-lime-300 to-green-400 z-0"
                style={{
                  background: 'linear-gradient(to right, #669524 10%, #85AF34 35%, #A5C943 49%)',
                }}
              >
                {/* Decorative Circles */}
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 220,
                    height: 220,
                    left: 30,
                    top: -100,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 95,
                    height: 95,
                    left: 10,
                    top: 140,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 60,
                    height: 60,
                    left: 200,
                    top: 130,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 180,
                    height: 180,
                    left: 310,
                    top: 180,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 200,
                    height: 200,
                    left: 720,
                    top: -65,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 300,
                    height: 300,
                    left: 600,
                    top: 120,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 170,
                    height: 170,
                    left: 400,
                    top: -100,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 80,
                    height: 80,
                    left: 530,
                    top: 10,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 110,
                    height: 110,
                    left: 1050,
                    top: 90,
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Avatar and Info */}
          <div className="flex items-center gap-6 px-8 z-10 -mt-30">
            <div className="relative">
              <div className="ml-13 w-52 h-52 rounded-full bg-black border-8 border-white flex items-center justify-center text-7xl font-bold overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white">{getInitials(username)}</span>
                )}
              </div>
              <label className="cursor-pointer absolute bottom-2 right-4" htmlFor="avatar-upload">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
                <div
                  className="bg-lime-400 border-4 border-white w-12 h-12 rounded-full flex items-center shadow-md justify-center hover:bg-lime-500 transition"
                >
                  <ImCamera className="text-white" />
                </div>
              </label>
            </div>
            <div className="flex flex-col gap-2 relative mt-5">
              <span className="-ml-4 text-3xl font-black text-green-900">@{displayName}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="-ml-5 flex gap-10 mt-12 justify-center flex-wrap px-8">
          {stats.map((stat, idx) => (
            <ProfileStatCard key={idx} title={stat.title} value={stat.value} highlight={stat.highlight} />
          ))}
        </div>
      </div>

      {/* Right Gray Rectangle */}
      <div className="hidden lg:block w-[140px] bg-gray-200" />
    </div>
  );
};

export default ProfilePage;
