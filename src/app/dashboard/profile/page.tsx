'use client'

import React, { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileStatCard from '../../../components/profile-page/ProfileStatCard';
import { ImCamera } from "react-icons/im";

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

    fetchUserStats();

    // Listen for task completion events from Focus page
    const handleTaskCompleted = () => {
      console.log('Profile page: Task completed event received, refreshing data...');
      fetchUserStats();
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
          <div className="mx-2 sm:mx-4 md:mx-6 mb-4 sm:mb-6 md:mb-8">
            <div className="relative rounded-2xl overflow-hidden h-32 sm:h-40 md:h-48 lg:h-60 w-full">
              <div
                className="absolute inset-0 bg-gradient-to-br from-lime-300 to-green-400 z-0"
                style={{
                  background: 'linear-gradient(to right, #669524 10%, #85AF34 35%, #A5C943 49%)',
                }}
              >
                {/* Decorative Circles - Responsive positioning */}
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 'clamp(80px, 15vw, 220px)',
                    height: 'clamp(80px, 15vw, 220px)',
                    left: 'clamp(10px, 5vw, 30px)',
                    top: 'clamp(-60px, -15vw, -100px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 'clamp(40px, 8vw, 95px)',
                    height: 'clamp(40px, 8vw, 95px)',
                    left: 'clamp(5px, 2vw, 10px)',
                    top: 'clamp(80px, 25vw, 140px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100"
                  style={{
                    width: 'clamp(30px, 5vw, 60px)',
                    height: 'clamp(30px, 5vw, 60px)',
                    left: 'clamp(100px, 25vw, 200px)',
                    top: 'clamp(70px, 20vw, 130px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100 hidden md:block"
                  style={{
                    width: 'clamp(90px, 12vw, 180px)',
                    height: 'clamp(90px, 12vw, 180px)',
                    left: 'clamp(155px, 25vw, 310px)',
                    top: 'clamp(90px, 30vw, 180px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100 hidden lg:block"
                  style={{
                    width: 'clamp(100px, 15vw, 200px)',
                    height: 'clamp(100px, 15vw, 200px)',
                    left: 'clamp(360px, 50vw, 720px)',
                    top: 'clamp(-40px, -10vw, -65px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100 hidden lg:block"
                  style={{
                    width: 'clamp(150px, 20vw, 300px)',
                    height: 'clamp(150px, 20vw, 300px)',
                    left: 'clamp(300px, 40vw, 600px)',
                    top: 'clamp(60px, 20vw, 120px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100 hidden xl:block"
                  style={{
                    width: 'clamp(85px, 12vw, 170px)',
                    height: 'clamp(85px, 12vw, 170px)',
                    left: 'clamp(200px, 30vw, 400px)',
                    top: 'clamp(-60px, -15vw, -100px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100 hidden xl:block"
                  style={{
                    width: 'clamp(40px, 6vw, 80px)',
                    height: 'clamp(40px, 6vw, 80px)',
                    left: 'clamp(265px, 35vw, 530px)',
                    top: 'clamp(5px, 2vw, 10px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
                <div
                  className="absolute bg-lime-400 rounded-full opacity-100 hidden 2xl:block"
                  style={{
                    width: 'clamp(55px, 8vw, 110px)',
                    height: 'clamp(55px, 8vw, 110px)',
                    left: 'clamp(525px, 70vw, 1050px)',
                    top: 'clamp(45px, 15vw, 90px)',
                    background: 'linear-gradient(110deg, #EFE842 30%, #669524 80%)',
                  }}
                />
              </div>
            </div>
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
            <div className="flex flex-col gap-2 relative mt-2 sm:mt-3 md:mt-5 text-center sm:text-left">
              <span className="text-xl sm:text-2xl md:text-3xl font-black text-green-900">@{displayName}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-12 mt-8 sm:mt-10 md:mt-12 justify-center flex-wrap px-6 sm:px-8 md:px-10 lg:px-12">
          {profileStats && (
            <>
              <ProfileStatCard title="Total Focus Time" value={profileStats.totalFocusTime} highlight />
              <ProfileStatCard title="Tasks Completed" value={profileStats.tasksCompleted} />
              <ProfileStatCard title="Plants Collected" value={profileStats.plantsCollected} />
              <ProfileStatCard title="Total Coins Earned" value={profileStats.totalCoinsEarned} />
              <ProfileStatCard title="Longest Streak" value={profileStats.longestStreak} />
            </>
          )}
        </div>
      </div>

      {/* Right Gray Rectangle */}
      <div className="hidden lg:block w-[140px] bg-gray-200" />
    </div>
  );
};

export default ProfilePage;
