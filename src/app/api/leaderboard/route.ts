import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export async function GET() {
  await connectDB();
  const users = await User.find({}, 'name').lean();
  return NextResponse.json({ users });
} 