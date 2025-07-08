import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import mongoose from 'mongoose';

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log('Session:', session);
  if (!session?.user?.id) {
    console.log('No session user id');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  let userObjectId;
  try {
    userObjectId = new mongoose.Types.ObjectId(session.user.id);
  } catch (e) {
    console.log('Invalid user id:', session.user.id);
    return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
  }
  console.log('Querying notifications for userId:', userObjectId);
  const notifications = await Notification.find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .select('_id userId type title message isRead createdAt')
    .lean();
  console.log('Notifications found:', notifications);
  return NextResponse.json({ notifications });
} 