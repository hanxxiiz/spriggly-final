import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';

// POST - Complete a task
export async function POST(request: NextRequest) {
  try {
    console.log('Complete Task API: Starting POST request...');
    
    const session = await getServerSession(authOptions);
    console.log('Complete Task API: Session:', session);

    if (!session?.user?.id) {
      console.log('Complete Task API: No session or user ID found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId } = body;

    console.log('Complete Task API: Request body:', body);

    if (!taskId) {
      return NextResponse.json({ 
        error: 'Missing required field: taskId' 
      }, { status: 400 });
    }

    await connectDB();
    console.log('Complete Task API: Database connected');

    // Find the task
    const task = await Task.findOne({ 
      _id: taskId, 
      userId: session.user.id,
      completedAt: null // Only incomplete tasks
    });

    if (!task) {
      return NextResponse.json({ 
        error: 'Task not found or already completed' 
      }, { status: 404 });
    }

    const now = new Date();
    const isPastDeadline = now > task.dueDate;
    
    // Calculate rewards based on priority (only when completing)
    const rewards = {
      low: { xp: 10, coins: 15 },
      medium: { xp: 25, coins: 40 },
      high: { xp: 50, coins: 80 }
    };
    
    let finalXp = rewards[task.priority as keyof typeof rewards].xp;
    let finalCoins = rewards[task.priority as keyof typeof rewards].coins;
    
    // Apply 50% penalty if past deadline
    if (isPastDeadline) {
      finalXp = Math.floor(finalXp * 0.5);
      finalCoins = Math.floor(finalCoins * 0.5);
    }

    // Update task as completed
    task.completedAt = now;
    task.earnedXp = finalXp;
    task.earnedCoins = finalCoins;
    await task.save();

    // Update user stats
    const user = await User.findById(session.user.id);
    if (user) {
      user.userCurrentXp += finalXp;
      user.currentCoins += finalCoins;
      user.totalCoinsEarned += finalCoins;
      user.tasksCompleted += 1;
      await user.save();
    }

    console.log('Complete Task API: Task completed:', {
      taskId,
      finalXp,
      finalCoins,
      isPastDeadline
    });

    return NextResponse.json({
      success: true,
      task: task,
      earnedXp: finalXp,
      earnedCoins: finalCoins,
      isPastDeadline
    });
  } catch (error: any) {
    console.error('Complete Task API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 