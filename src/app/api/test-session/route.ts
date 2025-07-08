import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      sessionData: session,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userEmail: session?.user?.email,
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Session test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 