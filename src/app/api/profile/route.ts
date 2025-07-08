import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('Profile API: Starting request...');
    
    const session = await getServerSession(authOptions);
    console.log('Profile API: Session:', session);

    if (!session?.user?.id) {
      console.log('Profile API: No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    console.log('Profile API: User ID from session:', session.user.id);

    await connectDB();
    console.log('Profile API: Database connected');

    const user = await User.findById(session.user.id).select(
      'username totalFocusHours tasksCompleted totalPlantsCollected totalCoinsEarned longestStreak'
    );

    console.log('Profile API: User found:', user);

    if (!user) {
      console.log('Profile API: User not found in database');
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Convert totalFocusHours (in hours) to hours:minutes format
    const formatFocusTime = (hours: number) => {
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

    const responseData = {
      username: user.username,
      totalFocusTime: formatFocusTime(user.totalFocusHours || 0),
      tasksCompleted: user.tasksCompleted || 0,
      plantsCollected: user.totalPlantsCollected || 0,
      totalCoinsEarned: user.totalCoinsEarned || 0,
      longestStreak: user.longestStreak || 0,
    };

    console.log('Profile API: Returning data:', responseData);

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Profile API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 