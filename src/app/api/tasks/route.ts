import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';

// GET - Fetch all tasks for the user
export async function GET() {
  try {
    console.log('Tasks API: Starting GET request...');
    
    const session = await getServerSession(authOptions);
    console.log('Tasks API: Session:', session);

    if (!session?.user?.id) {
      console.log('Tasks API: No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    console.log('Tasks API: User ID from session:', session.user.id);

    await connectDB();
    console.log('Tasks API: Database connected');

    const tasks = await Task.find({})
      .sort({ priority: -1, dueDate: 1 })
      .lean();

    console.log('Tasks API: Tasks found:', tasks.length);

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Tasks API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Create a new task
export async function POST(request: NextRequest) {
  try {
    console.log('Tasks API: Starting POST request...');
    
    const session = await getServerSession(authOptions);
    console.log('Tasks API: Session:', session);

    if (!session?.user?.id) {
      console.log('Tasks API: No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    const body = await request.json();
    const { taskName, description, priority, dueDate } = body;

    console.log('Tasks API: Request body:', body);

    // Validate required fields
    if (!taskName || !priority || !dueDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: taskName, priority, dueDate' 
      }, { status: 400 });
    }

    // Validate priority
    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json({ 
        error: 'Invalid priority. Must be low, medium, or high' 
      }, { status: 400 });
    }

    await connectDB();
    console.log('Tasks API: Database connected');

    const newTask = new Task({
      userId: session.user.id,
      taskName,
      description: description || '',
      priority,
      dueDate: new Date(dueDate),
      earnedXp: 0, // Only set rewards when completed
      earnedCoins: 0, // Only set rewards when completed
    });

    const savedTask = await newTask.save();
    console.log('Tasks API: Task created:', savedTask);

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error: any) {
    console.error('Tasks API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 