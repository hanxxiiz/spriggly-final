import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BoosterTemplate from '@/models/BoosterTemplate';
import BoosterInventory from '@/models/BoosterInventory';

const UserPlants = mongoose.models.UserPlants || mongoose.model('UserPlants', new mongoose.Schema({
  userId: String,
  plantTemplateId: String,
  plantLevel: Number,
  plantCurrentXp: Number,
  level: Number,
  xp: Number,
}));

export async function POST(req: NextRequest) {
  try {
    const { userId, plantId, boosterId } = await req.json();
    console.log('Received use-booster payload:', { userId, plantId, boosterId });
    if (!userId || !plantId || !boosterId) {
      console.error('Missing required fields', { userId, plantId, boosterId });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Debug: Log all BoosterInventory documents
    const allBoosters = await BoosterInventory.find({}).lean();
    console.log('ALL BOOSTER INVENTORY DOCUMENTS:', allBoosters);
    console.log('Total BoosterInventory documents:', allBoosters.length);

    // Debug: Check if any documents match the user
    const userBoosters = allBoosters.filter(b => 
      String(b.userId) === String(userId) || 
      String(b.userId) === String(new mongoose.Types.ObjectId(userId))
    );
    console.log('User boosters found:', userBoosters);

    // Debug: Check if any documents match the booster
    const matchingBooster = allBoosters.find(b => 
      String(b.boosterTemplateId) === String(boosterId)
    );
    console.log('Matching booster template found:', matchingBooster);

    // Debug: Log exact userId values and types
    console.log('userId parameter:', userId, 'type:', typeof userId, 'length:', userId.length);
    console.log('userId as ObjectId:', new mongoose.Types.ObjectId(userId));
    console.log('userId as string:', String(userId));

    // Debug: Check the actual userId in the found document
    const foundDoc = await BoosterInventory.findOne({ boosterTemplateId: new mongoose.Types.ObjectId(boosterId) });
    if (foundDoc) {
      console.log('Found document userId:', foundDoc.userId, 'type:', typeof foundDoc.userId);
      console.log('userId comparison:', {
        'userId === foundDoc.userId': userId === foundDoc.userId,
        'String(userId) === String(foundDoc.userId)': String(userId) === String(foundDoc.userId),
        'new ObjectId(userId).equals(foundDoc.userId)': new mongoose.Types.ObjectId(userId).equals(foundDoc.userId)
      });
    }

    // Find booster inventory
    // Use the working approach: find by boosterTemplateId, then filter by userId
    const boosterInv = await BoosterInventory.findOne({ boosterTemplateId: new mongoose.Types.ObjectId(boosterId) });
    
    // Verify the document belongs to the correct user
    if (boosterInv && !new mongoose.Types.ObjectId(userId).equals(boosterInv.userId)) {
      console.log('Booster found but belongs to different user');
      return NextResponse.json({ error: 'Booster not available in inventory' }, { status: 400 });
    }

    console.log('BoosterInventory result:', boosterInv);
    if (!boosterInv || boosterInv.quantity < 1) {
      console.error('Booster not available in inventory', { boosterInv });
      return NextResponse.json({ error: 'Booster not available in inventory' }, { status: 400 });
    }

    // Find booster template
    const boosterTemplateQuery = { _id: new mongoose.Types.ObjectId(boosterId) };
    console.log('Querying BoosterTemplate with:', boosterTemplateQuery);
    const boosterTemplate: any = await BoosterTemplate.findOne(boosterTemplateQuery).lean();
    console.log('BoosterTemplate result:', boosterTemplate);
    if (!boosterTemplate || Array.isArray(boosterTemplate)) {
      console.error('Booster template not found', { boosterTemplate });
      return NextResponse.json({ error: 'Booster template not found' }, { status: 404 });
    }

    // Find plant
    console.log('Querying UserPlants with plantId:', plantId);
    const plant = await UserPlants.findById(plantId);
    console.log('UserPlants result:', plant);
    if (!plant) {
      console.error('Plant not found', { plantId });
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    // Fetch plant template for XP requirements
    interface PlantTemplateWithGrowthXp {
      growthXpRequirements?: Record<string, number>;
    }
    const plantTemplate = await mongoose.models.PlantTemplate.findById(plant.plantTemplateId).lean() as PlantTemplateWithGrowthXp | null;
    const growthXpRequirements = plantTemplate?.growthXpRequirements || {};

    // Apply booster effect
    let xp = plant.plantCurrentXp || plant.xp || 0;
    let level = plant.plantLevel || plant.level || 1;
    let updated = false;
    console.log('Applying booster effect:', boosterTemplate.effectType, { xp, level });
    switch (boosterTemplate.effectType) {
      case 'add10Xp':
        xp += 10;
        updated = true;
        break;
      case 'add25Xp':
        xp += 25;
        updated = true;
        break;
      case 'add30Xp':
        xp += 30;
        updated = true;
        break;
      case 'add50Xp':
        xp += 50;
        updated = true;
        break;
      case 'add15PercentXp':
        xp = Math.floor(xp + xp * 0.15);
        updated = true;
        break;
      case 'add30PercentXp':
        xp = Math.floor(xp + xp * 0.30);
        updated = true;
        break;
      case 'add50PercentXp':
        xp = Math.floor(xp + xp * 0.50);
        updated = true;
        break;
      case 'goToStage3':
        level = 3;
        xp = growthXpRequirements['sapling'] ?? xp;
        updated = true;
        break;
      case 'goToStage4':
        level = 4;
        xp = growthXpRequirements['mature'] ?? xp;
        updated = true;
        break;
      case 'goToStage5':
        level = 5;
        xp = growthXpRequirements['blooming'] ?? xp;
        updated = true;
        break;
      default:
        console.error('Unknown booster effect', { effectType: boosterTemplate.effectType });
        break;
    }
    console.log('After applying booster effect:', { xp, level });

    // Recalculate level based on XP and growthXpRequirements
    function getLevelFromXp(xp: number, growthXpRequirements: Record<string, number>): number {
      // Map stage names to levels
      const stages = [
        { key: 'seed', level: 1 },
        { key: 'sprout', level: 2 },
        { key: 'sapling', level: 3 },
        { key: 'mature', level: 4 },
        { key: 'blooming', level: 5 },
      ];
      let newLevel = 1;
      for (const stage of stages) {
        if (growthXpRequirements[stage.key] !== undefined && xp >= growthXpRequirements[stage.key]) {
          newLevel = stage.level;
        }
      }
      return newLevel;
    }
    level = getLevelFromXp(xp, growthXpRequirements);
    console.log('Level recalculated from XP:', { xp, level });

    if (!updated) {
      console.error('Unknown booster effect (not updated)', { effectType: boosterTemplate.effectType });
      return NextResponse.json({ error: 'Unknown booster effect' }, { status: 400 });
    }

    // Update plant
    plant.plantCurrentXp = xp;
    plant.xp = xp;
    plant.plantLevel = level;
    plant.level = level;
    await plant.save();
    console.log('Updated plant after booster:', plant);

    // Decrement booster inventory
    boosterInv.quantity -= 1;
    if (boosterInv.quantity <= 0) {
      await boosterInv.deleteOne();
      console.log('BoosterInventory deleted (quantity 0)');
    } else {
      await boosterInv.save();
      console.log('BoosterInventory decremented and saved:', boosterInv);
    }

    // Return updated plant and booster inventory
    const updatedBoosterInventory = await BoosterInventory.find({
      $or: [
        { userId: new mongoose.Types.ObjectId(userId) },
        { userId: String(userId) }
      ]
    }).lean();
    console.log('Returning updated plant and boosterInventory:', { plant, updatedBoosterInventory });
    return NextResponse.json({
      plant,
      boosterInventory: updatedBoosterInventory,
    });
  } catch (err) {
    console.error('Server error in use-booster:', err);
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
} 