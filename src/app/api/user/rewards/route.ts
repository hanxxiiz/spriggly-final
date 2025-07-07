import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/app/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  await connectDB;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ claimedDay: user.claimedDay, lastClaimDate: user.lastClaimDate });
}

export async function POST(req: Request) {
  await connectDB;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { claimedDay, lastClaimDate } = await req.json();
  const user = await User.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  user.claimedDay = claimedDay;
  user.lastClaimDate = lastClaimDate;
  await user.save();
  return NextResponse.json({ success: true });
} 