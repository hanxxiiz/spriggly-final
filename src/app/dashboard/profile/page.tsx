'use client'

import React, { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileStatCard from '../../../components/profile-page/ProfileStatCard';
import { ImCamera } from "react-icons/im";
import { FaClock, FaCheckCircle, FaSeedling, FaCoins, FaFire } from "react-icons/fa";
import Navbar from '@/components/NavigationBar';
import { Poppins } from 'next/font/google';
import ProfileBanner from '@/components/ProfileBanner';
import AnimatedOutline from '@/components/AnimatedOutlineCard';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ProfilePage = () => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileStats, setProfileStats] = useState<{
    totalFocusTime: string;
    tasksCompleted: number;
    plantsCollected: number;
    totalCoinsEarned: number;
    longestStreak: number;
    username: string;
  } | null>(null);

  // Fetch profile stats and image
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profilePictureUrl);
          setProfileStats({
            totalFocusTime: data.totalFocusTime,
            tasksCompleted: data.tasksCompleted,
            plantsCollected: data.plantsCollected,
            totalCoinsEarned: data.totalCoinsEarned,
            longestStreak: data.longestStreak,
            username: data.username,
          });
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
      }
    };

    loadProfileData();

    // Listen for task completion events from Focus page
    const handleTaskCompleted = () => {
      console.log('Profile page: Task completed event received, refreshing data...');
      loadProfileData();
    };

    window.addEventListener('taskCompleted', handleTaskCompleted);

    // Cleanup event listener
    return () => {
      window.removeEventListener('taskCompleted', handleTaskCompleted);
    };
  }, [session?.user?.id]);

  const getInitials = (name: string) => {
    return name && name.length > 0 ? name[0].toUpperCase() : '';
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Upload the file to the server
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload-profile', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        setProfileImage(data.profilePictureUrl);
        
        // Clean up the preview URL
        URL.revokeObjectURL(imageUrl);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
        // Revert to the previous image or initials
        setProfileImage(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const username = session?.user?.name || 'User';
  const displayName = username;

  return (
     <>
      <Navbar />
      <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen pt-18 py-4 px-4 sm:px-6 lg:px-8 relative`}>
      
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
            <div className="mx-2 sm:mx-4 md:mx-6 mb-4 sm:mb-6 md:mb-8">
              <ProfileBanner
              />
            </div>

            {/* Avatar and Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 z-10 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-30">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full bg-black border-4 sm:border-6 md:border-8 border-white flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white">{getInitials(username)}</span>
                  )}
                </div>
                <label className={`absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-2 md:right-4 ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`} htmlFor="avatar-upload">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    disabled={isUploading}
                  />
                  <div
                    className={`border-2 sm:border-3 md:border-4 border-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center shadow-md justify-center transition ${
                      isUploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-lime-400 hover:bg-lime-500 cursor-pointer'
                    }`}
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 border-b-2 border-white"></div>
                    ) : (
                      <ImCamera className="text-white text-xs sm:text-sm md:text-base" />
                    )}
                  </div>
                </label>
              </div>
              <div className="flex flex-col relative sm:mt-3 md:mt-20 text-center sm:text-left">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-green-900">
                  @{displayName}
                </span>
                <span className="text-sm sm:text-base text-yellow-300 font-medium">
                  Level {'2'} • {'9'} XP
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards using AnimatedOutline */}
          <div className="flex gap-5 mb-10 sm:gap-8 md:gap-10 mt-8 sm:mt-10 md:mt-12 justify-center flex-wrap px-6 sm:px-8 md:px-10 lg:px-12">
            {profileStats && (
              <>
                <AnimatedOutline width="w-60" height="h-40">
                  <div className="flex items-center justify-start h-full text-left px-4">
                    <FaClock className="text-[#E4FE62] text-5xl mr-4 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-[#E4FE62] mb-1">
                        {profileStats.totalFocusTime}
                      </div>
                      <div className="text-sm text-white/80">
                        Total Focus Time
                      </div>
                    </div>
                  </div>
                </AnimatedOutline>

                <AnimatedOutline width="w-60" height="h-40">
                  <div className="flex items-center justify-start h-full text-left px-4">
                    <FaCheckCircle className="text-[#E4FE62] text-5xl mr-4 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-[#E4FE62] mb-1">
                        {profileStats.tasksCompleted}
                      </div>
                      <div className="text-sm text-white/80">
                        Tasks Completed
                      </div>
                    </div>
                  </div>
                </AnimatedOutline>

                <AnimatedOutline width="w-60" height="h-40">
                  <div className="flex items-center justify-start h-full text-left px-4">
                    <FaSeedling className="text-[#E4FE62] text-5xl mr-4 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-[#E4FE62] mb-1">
                        {profileStats.plantsCollected}
                      </div>
                      <div className="text-sm text-white/80">
                        Plants Collected
                      </div>
                    </div>
                  </div>
                </AnimatedOutline>

                <AnimatedOutline width="w-60" height="h-40">
                  <div className="flex items-center justify-start h-full text-left px-4">
                    <FaCoins className="text-[#E4FE62] text-5xl mr-4 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-[#E4FE62] mb-1">
                        {profileStats.totalCoinsEarned}
                      </div>
                      <div className="text-sm text-white/80">
                        Total Coins Earned
                      </div>
                    </div>
                  </div>
                </AnimatedOutline>

                <AnimatedOutline width="w-60" height="h-40">
                  <div className="flex items-center justify-start h-full text-left px-4">
                    <FaFire className="text-[#E4FE62] text-5xl mr-4 flex-shrink-0" />
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-[#E4FE62] mb-1">
                        {profileStats.longestStreak}
                      </div>
                      <div className="text-sm text-white/80">
                        Longest Streak
                      </div>
                    </div>
                  </div>
                </AnimatedOutline>
              </>
            )}
          </div>
        </div>

        {/* Right Gray Rectangle */}
        <div className="hidden lg:block w-[140px] bg-gray-200" />
      </main>
    </>
  );
};

export default ProfilePage;