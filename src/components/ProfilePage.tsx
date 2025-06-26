import React from 'react';

interface ProfilePageProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    // Add other fields as needed
  };
}

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Name:</p>
          <p className="text-lg font-medium text-gray-900">{user?.name || 'Unknown User'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email:</p>
          <p className="text-lg font-medium text-gray-900">{user?.email || 'No email provided'}</p>
        </div>
        {/* Optionally display user image if available */}
        {user?.image && (
          <div>
            <img src={user.image} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          </div>
        )}
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
} 