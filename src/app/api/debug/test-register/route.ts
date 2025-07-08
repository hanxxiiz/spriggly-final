import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username: name }] });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user with all fields initialized to proper defaults
    const user = await User.create({
      username: name,
      email,
      hashedPassword: password,
      // Initialize all numeric fields to 0
      level: 1,
      userCurrentXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      currentCoins: 0,
      totalCoinsEarned: 0,
      totalCoinsSpent: 0,
      totalFocusHours: 0,
      tasksCompleted: 0,
      totalPlantsCollected: 0,
      profilePictureUrl: '',
      currentPlantIds: [],
      lastClaimedDate: new Date(),
      dailyStreakDay: 0,
    });

    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        currentCoins: user.currentCoins,
        userCurrentXp: user.userCurrentXp,
        currentStreak: user.currentStreak
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 