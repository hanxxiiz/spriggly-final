import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET() {
  try {
    console.log('Debug Tasks API: Starting request...');
    
    await connectDB();
    console.log('Debug Tasks API: Database connected');

    // Get all tasks without any filtering
    const allTasks = await Task.find({}).lean();
    console.log('Debug Tasks API: All tasks found:', allTasks.length);

    // Log the first few tasks to see their structure
    const sampleTasks = allTasks.slice(0, 3);
    console.log('Debug Tasks API: Sample tasks:', JSON.stringify(sampleTasks, null, 2));

    // Check for different possible field names
    const tasksWithCompletedAt = allTasks.filter(task => task.completedAt);
    const tasksWithCompleted = allTasks.filter(task => (task as any).completed);
    const tasksWithStatus = allTasks.filter(task => (task as any).status);

    console.log('Debug Tasks API: Tasks with completedAt:', tasksWithCompletedAt.length);
    console.log('Debug Tasks API: Tasks with completed:', tasksWithCompleted.length);
    console.log('Debug Tasks API: Tasks with status:', tasksWithStatus.length);

    return NextResponse.json({
      totalTasks: allTasks.length,
      sampleTasks,
      tasksWithCompletedAt: tasksWithCompletedAt.length,
      tasksWithCompleted: tasksWithCompleted.length,
      tasksWithStatus: tasksWithStatus.length,
      allTasks
    });
  } catch (error: any) {
    console.error('Debug Tasks API: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 