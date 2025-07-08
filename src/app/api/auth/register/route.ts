import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = db.collection('users');

    const userExists = await users.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // ⚠️ Storing plain password for learning purposes only
    await users.insertOne({ email, password });

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error.message);
    console.error(error.stack);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
