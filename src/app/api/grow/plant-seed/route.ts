import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const UserPlants = mongoose.models.UserPlants || mongoose.model('UserPlants', new mongoose.Schema({
  userId: String,
  plantTemplateId: String,
  plantLevel: Number,
  plantCurrentXp: Number,
  level: Number,
  xp: Number,
}));

const SeedInventory = mongoose.models.SeedInventory || mongoose.model('SeedInventory', new mongoose.Schema({
  userId: String,
  plantTemplateId: String,
  quantity: Number,
}));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received plant-seed payload:', body);
    const { userId, plantTemplateId } = body;
    if (!userId || !plantTemplateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const query = {
      userId: String(userId),
      plantTemplateId: new mongoose.Types.ObjectId(plantTemplateId),
    };
    console.log('Querying SeedInventory with:', query);
    const seedInv = await SeedInventory.findOne(query);
    if (!seedInv || seedInv.quantity < 1) {
      return NextResponse.json({ error: 'Seed not available in inventory' }, { status: 400 });
    }

    // Decrement seed inventory
    seedInv.quantity -= 1;
    if (seedInv.quantity <= 0) {
      await seedInv.deleteOne();
    } else {
      await seedInv.save();
    }

    // Add new plant to UserPlants
    const newPlant = await UserPlants.create({
      userId: String(userId),
      plantTemplateId: String(plantTemplateId),
      plantLevel: 1,
      plantCurrentXp: 0,
      level: 1,
      xp: 0,
    });

    // Return updated userPlants and seedInventory
    const userPlants = await UserPlants.find({ userId: String(userId) }).lean();
    const seedInventory = await SeedInventory.find({ userId: String(userId) }).lean();
    return NextResponse.json({
      userPlants,
      seedInventory,
      newPlant,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
} 