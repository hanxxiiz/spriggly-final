import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Get users with relevant fields for leaderboard
    const users = await User.find({}, 'username totalFocusHours tasksCompleted userCurrentXp profilePictureUrl')
      .sort({ userCurrentXp: -1, totalFocusHours: -1 }) // Sort by XP first, then focus hours
      .limit(50) // Limit to top 50 users
      .lean();

    // Calculate average focus time and format data
    const leaderboardData = users.map((user, index) => {
      const averageFocusTime = user.tasksCompleted > 0 
        ? user.totalFocusHours / user.tasksCompleted 
        : 0;

      // Format average focus time
      const formatAverageTime = (hours: number) => {
        if (hours === 0) return '0m';
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        
        if (wholeHours === 0) {
          return `${minutes}m`;
        } else if (minutes === 0) {
          return `${wholeHours}h`;
        } else {
          return `${wholeHours}h${minutes}m`;
        }
      };

      return {
        rank: index + 1,
        name: user.username,
        xp: user.userCurrentXp || 0,
        averageFocusTime: formatAverageTime(averageFocusTime),
        profilePictureUrl: user.profilePictureUrl || null,
      };
    });

    return NextResponse.json({ 
      leaderboard: leaderboardData,
      totalUsers: leaderboardData.length 
    });
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
} 