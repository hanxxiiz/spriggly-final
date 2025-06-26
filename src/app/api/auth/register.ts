import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('loginApp'); // Update if your DB name is different
    const users = db.collection('users');

    const userExists = await users.findOne({ email });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // ❗️Saving password as-is (not secure for real use)
    await users.insertOne({ email, password });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
