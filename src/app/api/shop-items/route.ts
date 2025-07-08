import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const boosters = await db.collection('BoosterTemplate').find({}).toArray();
    const seedPacks = await db.collection('PlantTemplates').find({}).toArray();
    return NextResponse.json({ boosters, seedPacks });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
} 