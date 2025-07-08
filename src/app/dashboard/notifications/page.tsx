'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/NavigationBar';
import NotificationCard from '../../../components/NotificationCard';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    // Optionally, implement a PATCH/PUT request to mark all as read in the DB
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex justify-center items-start pt-12">
        <div className="w-full max-w-3xl">
          {/* Notification Header */}
          <div className="flex items-center justify-between rounded-t-2xl px-6 py-3 bg-yellow-200 shadow">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔔</span>
              <span className="text-2xl font-bold text-lime-700">Notifications</span>
            </div>
            <button
              className="bg-lime-200 text-lime-700 px-4 py-1 rounded-full font-semibold text-sm hover:bg-lime-300 transition"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>

          {/* Notification List */}
          <div className="bg-white rounded-b-2xl shadow px-4 pb-6 pt-2">
            {loading && <div className="text-center text-gray-400 py-12">Loading...</div>}
            {!loading && notifications.length === 0 && (
              <div className="text-center text-gray-400 py-12">No notifications</div>
            )}
            {notifications.map((notif) => (
              <NotificationCard
                key={notif._id}
                type={notif.type}
                message={notif.message}
                time={new Date(notif.createdAt).toLocaleString()}
                icon={notif.icon}
                color={notif.color}
                read={notif.read}
              />
            ))}
            {/* Empty notification cards for design, if needed */}
            {notifications.length < 4 &&
              Array.from({ length: 4 - notifications.length }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-8 mt-4 bg-gray-50 shadow-sm"></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 