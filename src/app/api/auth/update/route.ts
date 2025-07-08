import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';
import BoosterInventory from '@/models/BoosterInventory';
import DailyRewardTemplate from '@/models/DailyRewardTemplate';

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

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

    if (name && name !== user.username) {
      user.username = name;
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
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  console.log('PATCH handler reached');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    if (!session?.user?.id) {
      console.log('No session user id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    console.log('Connected to DB');

    const user = await User.findById(session.user.id);
    console.log('User:', user);
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = getTodayStr();
    const claimedDays = user.claimedDays || [];
    console.log('Today:', today, 'ClaimedDays:', claimedDays);

    // Already claimed
    if (claimedDays.includes(today)) {
      console.log('Already claimed today');
      return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
    }

    const lastClaimedDate = user.lastClaimedDate
      ? new Date(user.lastClaimedDate).toISOString().slice(0, 10)
      : null;
    console.log('LastClaimedDate:', lastClaimedDate);

    // Reset streak if skipped a day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const continueStreak = lastClaimedDate === yesterdayStr;
    console.log('Yesterday:', yesterdayStr, 'ContinueStreak:', continueStreak);

    if (!continueStreak && claimedDays.length > 0) {
      claimedDays.length = 0;
      user.dailyStreakDay = 1;
      console.log('Streak reset');
    } else {
      // Cycle back to day 1 after day 7
      user.dailyStreakDay = user.dailyStreakDay >= 7 ? 1 : user.dailyStreakDay + 1;
      console.log('Streak incremented/cycled:', user.dailyStreakDay);
    }

    claimedDays.push(today);
    user.claimedDays = claimedDays;
    user.lastClaimedDate = new Date();
    console.log('Updated claimedDays and lastClaimedDate');

    // Fetch reward from DailyRewardTemplate
    const rewardTemplate = await DailyRewardTemplate.findOne({ day: user.dailyStreakDay });
    console.log('RewardTemplate:', rewardTemplate);
    if (!rewardTemplate) {
      console.log('Reward not found for this streak day');
      return NextResponse.json({ error: 'Reward not found for this streak day' }, { status: 500 });
    }

    const rewards: any = rewardTemplate.rewards ?? {};
    const coins = rewards.coins ?? 0;
    const boosterReward = rewards.boosterReward;
    const seedReward = rewards.seedReward;
    console.log('Rewards:', rewards);

    // Apply coins to user
    user.currentCoins += coins;
    user.totalCoinsEarned += coins;
    user.userCurrentXp += 0; // No xp in reward template, keep for future
    console.log('Updated user coins and xp');

    // Handle booster reward
    let updatedBoosterInventory = null;
    if (boosterReward && boosterReward.templateId && boosterReward.quantity) {
      updatedBoosterInventory = await BoosterInventory.findOne({
        userId: user._id,
        boosterTemplateId: boosterReward.templateId,
      });
      if (updatedBoosterInventory) {
        updatedBoosterInventory.quantity += boosterReward.quantity;
        await updatedBoosterInventory.save();
        console.log('Updated existing booster inventory');
      } else {
        updatedBoosterInventory = await BoosterInventory.create({
          userId: user._id,
          boosterTemplateId: boosterReward.templateId,
          quantity: boosterReward.quantity,
        });
        console.log('Created new booster inventory');
      }
    }

    // (Optional) Handle seedReward here if you want to implement plant inventory

    await user.save();
    console.log('User saved');

    return NextResponse.json({
      message: 'Reward claimed',
      rewards: {
        coins,
        xp: 0, // xp is not in reward template, so it's 0
        boosterReward,
        seedReward,
      },
      dailyRewards: {
        currentDay: user.dailyStreakDay,
        lastClaimed: today,
        alreadyClaimed: true,
        reset: !continueStreak,
        claimedDays,
      },
      user: {
        _id: user._id,
        currentCoins: user.currentCoins,
        totalCoinsEarned: user.totalCoinsEarned,
        userCurrentXp: user.userCurrentXp,
        dailyStreakDay: user.dailyStreakDay,
        claimedDays: user.claimedDays,
      },
      boosterInventory: updatedBoosterInventory,
    });
  } catch (error) {
    console.error('Error in PATCH /api/auth/update:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
