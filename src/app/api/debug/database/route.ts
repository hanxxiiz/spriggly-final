import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    // Try to get users from different possible collection names
    const usersCollection = db.collection('Users');
    const usersLowercase = db.collection('users');
    
    let usersData: any[] = [];
    let usersLowercaseData: any[] = [];
    
    try {
      usersData = await usersCollection.find({}).limit(5).toArray();
    } catch (e) {
      console.log('Users collection not found');
    }
    
    try {
      usersLowercaseData = await usersLowercase.find({}).limit(5).toArray();
    } catch (e) {
      console.log('users collection not found');
    }
    
    return NextResponse.json({
      message: 'Database debug info',
      databaseName: db.databaseName,
      collections: collections.map(c => c.name),
      usersInUsersCollection: usersData.length,
      usersInUsersLowercaseCollection: usersLowercaseData.length,
      sampleUsersFromUsers: usersData.slice(0, 2).map(u => ({
        _id: u._id,
        username: u.username,
        email: u.email,
        level: u.level
      })),
      sampleUsersFromUsersLowercase: usersLowercaseData.slice(0, 2).map(u => ({
        _id: u._id,
        username: u.username,
        email: u.email,
        level: u.level
      }))
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 