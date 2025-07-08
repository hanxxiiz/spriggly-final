import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import BoosterInventory from '@/models/BoosterInventory';
import BoosterTemplate from '@/models/BoosterTemplate';
import mongoose from 'mongoose';
import SeedInventory from '@/models/SeedInventory';
// import PlantInventory and PlantTemplate if you have them

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { itemType, templateId, price } = await req.json();
  const user = await User.findOne({ email: session.user.email });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.currentCoins < price) return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });

  user.currentCoins -= price;
  user.totalCoinsSpent += price;

  // Add to inventory
  if (itemType === 'booster') {
    let inventory = await BoosterInventory.findOne({
      userId: new mongoose.Types.ObjectId(String(user._id)),
      boosterTemplateId: new mongoose.Types.ObjectId(String(templateId))
    });
    if (inventory) {
      inventory.quantity += 1;
      await inventory.save();
      console.log('[BoosterInventory] Updated:', {
        _id: String(inventory._id),
        userId: String(user._id),
        boosterTemplateId: String(templateId),
        quantity: inventory.quantity,
        action: 'updated',
      });
    } else {
      const created = await BoosterInventory.create({
        userId: new mongoose.Types.ObjectId(String(user._id)),
        boosterTemplateId: new mongoose.Types.ObjectId(String(templateId)),
        quantity: 1
      });
      console.log('[BoosterInventory] Created:', {
        _id: String(created._id),
        userId: String(user._id),
        boosterTemplateId: String(templateId),
        quantity: 1,
        action: 'created',
      });
    }
  }
  else if (itemType === 'seed') {
    let inventory = await SeedInventory.findOne({
      userId: new mongoose.Types.ObjectId(String(user._id)),
      seedTemplateId: new mongoose.Types.ObjectId(String(templateId))
    });
    if (inventory) {
      inventory.quantity += 1;
      await inventory.save();
      console.log('[SeedInventory] Updated:', {
        _id: String(inventory._id),
        userId: String(user._id),
        seedTemplateId: String(templateId),
        quantity: inventory.quantity,
        action: 'updated',
      });
    } else {
      const created = await SeedInventory.create({
        userId: new mongoose.Types.ObjectId(String(user._id)),
        seedTemplateId: new mongoose.Types.ObjectId(String(templateId)),
        quantity: 1
      });
      console.log('[SeedInventory] Created:', {
        _id: String(created._id),
        userId: String(user._id),
        seedTemplateId: String(templateId),
        quantity: 1,
        action: 'created',
      });
    }
  }
  // else if (itemType === 'seed') { ... } // Add similar logic for seeds if you have PlantInventory

  await user.save();

  return NextResponse.json({ coins: user.currentCoins });
} 