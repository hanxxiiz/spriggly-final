import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Get all users (without hashedPassword for security)
    const users = await User.find({}, 'username email level userCurrentXp currentCoins createdAt').lean();
    
    return NextResponse.json({
      message: 'Users found',
      count: users.length,
      users: users
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 