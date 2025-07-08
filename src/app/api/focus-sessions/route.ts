import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import FocusSession from '@/models/FocusSession';
import User from '@/models/User';

// GET - Fetch focus sessions for the user
export async function GET() {
  try {
    console.log('Focus Sessions API: Starting GET request...');
    
    const session = await getServerSession(authOptions);
    console.log('Focus Sessions API: Session:', session);

    if (!session?.user?.id) {
      console.log('Focus Sessions API: No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    console.log('Focus Sessions API: User ID from session:', session.user.id);

    await connectDB();
    console.log('Focus Sessions API: Database connected');

    const focusSessions = await FocusSession.find({ userId: session.user.id })
      .sort({ completedAt: -1 })
      .limit(10) // Get last 10 sessions
      .lean();

    console.log('Focus Sessions API: Sessions found:', focusSessions.length);

    return NextResponse.json(focusSessions);
  } catch (error: any) {
    console.error('Focus Sessions API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Complete a focus session
export async function POST(request: NextRequest) {
  try {
    console.log('Focus Sessions API: Starting POST request...');
    
    const session = await getServerSession(authOptions);
    console.log('Focus Sessions API: Session:', session);

    if (!session?.user?.id) {
      console.log('Focus Sessions API: No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    const body = await request.json();
    const { durationMinutes, surrendered } = body;

    console.log('Focus Sessions API: Request body:', body);

    if (durationMinutes === undefined || surrendered === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: durationMinutes, surrendered' 
      }, { status: 400 });
    }

    await connectDB();
    console.log('Focus Sessions API: Database connected');

    // Calculate rewards: (2 x minutes) for both XP and coins if not surrendered
    let earnedXp = 0;
    let earnedCoins = 0;
    
    if (!surrendered) {
      earnedXp = durationMinutes * 2;
      earnedCoins = durationMinutes * 2;
    }

    // Create focus session record
    const newFocusSession = new FocusSession({
      userId: session.user.id,
      durationMinutes,
      earnedXp,
      earnedCoins,
      completedAt: new Date(),
      surrendered,
    });

    const savedSession = await newFocusSession.save();

    // Update user stats if not surrendered
    if (!surrendered) {
      const user = await User.findById(session.user.id);
      if (user) {
        user.userCurrentXp += earnedXp;
        user.currentCoins += earnedCoins;
        user.totalCoinsEarned += earnedCoins;
        user.totalFocusHours += durationMinutes / 60; // Convert minutes to hours
        await user.save();
      }
    }

    console.log('Focus Sessions API: Session completed:', {
      sessionId: savedSession._id,
      durationMinutes,
      earnedXp,
      earnedCoins,
      surrendered
    });

    return NextResponse.json({
      success: true,
      session: savedSession,
      earnedXp,
      earnedCoins
    }, { status: 201 });
  } catch (error: any) {
    console.error('Focus Sessions API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 