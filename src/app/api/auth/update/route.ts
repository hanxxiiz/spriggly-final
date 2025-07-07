import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, currentPassword, newPassword } = await req.json();

    await connectDB();

    const user = await User.findById(session.user.id).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name && name !== user.name) {
      user.name = name;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email is already taken' }, { status: 400 });
      }
      user.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }

      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      user.password = newPassword;
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Claim daily reward
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    let claimedDays = user.dailyRewards?.claimedDays || [];
    let lastClaimed = user.dailyRewards?.lastClaimed ? new Date(user.dailyRewards.lastClaimed) : null;
    let reset = false;

    // If today is already claimed, do not update
    if (claimedDays.includes(todayStr)) {
      // Calculate streak
      let streak = 1;
      for (let i = claimedDays.length - 2; i >= 0; i--) {
        const prev = new Date(claimedDays[i]);
        const next = new Date(claimedDays[i + 1]);
        prev.setHours(0,0,0,0);
        next.setHours(0,0,0,0);
        if ((next.getTime() - prev.getTime()) === 86400000) {
          streak++;
        } else {
          break;
        }
      }
      return NextResponse.json({
        dailyRewards: {
          currentDay: streak,
          lastClaimed,
          reset,
          alreadyClaimed: true,
          claimedDays,
        },
      });
    }

    // If this is the first claim or streak is broken
    if (!lastClaimed || (lastClaimed && Math.floor((now.setHours(0,0,0,0) - lastClaimed.setHours(0,0,0,0)) / (1000*60*60*24)) > 1)) {
      claimedDays = [todayStr];
      lastClaimed = now;
      reset = true;
      user.dailyRewards = {
        currentDay: 1,
        lastClaimed: now,
        claimedDays,
      };
      await user.save();
      return NextResponse.json({
        dailyRewards: {
          currentDay: 1,
          lastClaimed: now,
          reset,
          alreadyClaimed: false,
          claimedDays,
        },
      });
    }

    // Continue streak
    claimedDays.push(todayStr);
    // Calculate streak
    let streak = 1;
    for (let i = claimedDays.length - 2; i >= 0; i--) {
      const prev = new Date(claimedDays[i]);
      const next = new Date(claimedDays[i + 1]);
      prev.setHours(0,0,0,0);
      next.setHours(0,0,0,0);
      if ((next.getTime() - prev.getTime()) === 86400000) {
        streak++;
      } else {
        break;
      }
    }
    user.dailyRewards = {
      currentDay: streak,
      lastClaimed: now,
      claimedDays,
    };
    await user.save();
    return NextResponse.json({
      dailyRewards: {
        currentDay: streak,
        lastClaimed: now,
        reset,
        alreadyClaimed: false,
        claimedDays,
      },
    });
  } catch (error) {
    console.error('Daily rewards error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      dailyRewards: user.dailyRewards || {
        currentDay: 1,
        lastClaimed: null,
        claimedDays: [],
      },
    });
  } catch (error) {
    console.error('Daily rewards GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
