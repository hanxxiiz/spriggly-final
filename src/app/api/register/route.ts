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

    // Check if user already exists by email or name (username)
    const existingUser = await User.findOne({ $or: [ { email }, { name } ] });
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      } else if (existingUser.name === name) {
        return NextResponse.json(
          { error: 'Username already in use' },
          { status: 400 }
        );
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: 'User created successfully', user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 