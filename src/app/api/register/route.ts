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

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [ { email }, { username: name } ] });
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      } else if (existingUser.username === name) {
        return NextResponse.json(
          { error: 'Username already in use' },
          { status: 400 }
        );
      }
    }

    // Create new user with all fields initialized to proper defaults
    const user = await User.create({
      username: name, // Map 'name' from form to 'username' in database
      email,
      hashedPassword: password, // Map 'password' from form to 'hashedPassword' in database
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

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: { 
          id: user._id, 
          username: user.username, 
          email: user.email,
          level: user.level,
          currentCoins: user.currentCoins
        } 
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 