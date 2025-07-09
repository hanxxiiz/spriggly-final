import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BoosterTemplate from '@/models/BoosterTemplate';
import BoosterInventory from '@/models/BoosterInventory';
import User from '@/models/User';
import PlantTemplate from '@/models/PlantTemplate';
import SeedInventory from '@/models/SeedInventory';
import UserPlants from '@/models/UserPlants';

// These models may need to be created if not present:
// import UserPlants from '@/models/UserPlants';
// import SeedInventory from '@/models/SeedInventory';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // Connect to DB if not already
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  // Debug: log all raw DB data
  const allUserPlants = await UserPlants.find({}).lean();
  const allSeedInventory = await SeedInventory.find({}).lean();
  const allBoosterInventory = await BoosterInventory.find({}).lean();
  console.log('All UserPlants:', allUserPlants);
  console.log('All SeedInventory:', allSeedInventory);
  console.log('All BoosterInventory:', allBoosterInventory);

  // Fetch all user plants for the user
  const userPlants = allUserPlants.filter(p => String(p.userId) === String(userId));
  // Fetch all plant templates from the database (declare only once)
  const plantTemplatesDb = await PlantTemplate.find().lean();
  // Join user plants with plant templates, always provide a valid sceneUrl
  const userPlantsWithTemplate = userPlants.map(plant => {
    const template = plantTemplatesDb.find(
      t => String(t._id) === String(plant.plantTemplateId?._id || plant.plantTemplateId)
    );
    let sceneUrl = '';
    if (template) {
      sceneUrl = template.sceneUrl || template.modelUrl || '';
    }
    return {
      ...plant,
      template: {
        ...template,
        sceneUrl,
      },
    };
  });
  console.log('userPlantsWithTemplate:', userPlantsWithTemplate);

  // Fetch all seed inventory for the user
  const seedInventory = allSeedInventory.filter(s => String(s.userId) === String(userId));
  // Join seed inventory with plant templates (reuse plantTemplatesDb)
  const seedInventoryWithTemplate = seedInventory.map(seed => {
    const template = plantTemplatesDb.find(
      t => String(t._id) === String(seed.seedTemplateId)
    );
    return { ...seed, template };
  });
  console.log('plantTemplates:', plantTemplatesDb);
  console.log('seedInventoryWithTemplate:', seedInventoryWithTemplate);

  // Fetch booster inventory (compare userId as string, handle ObjectId or string)
  const boosterInventory = allBoosterInventory.filter(b => String(b.userId) === String(userId));
  // Fetch all booster templates
  const boosterTemplates = await BoosterTemplate.find().lean();
  const boosterInventoryWithTemplate = boosterInventory.map(booster => {
    const template = boosterTemplates.find(
      t => String(t._id) === String(booster.boosterTemplateId)
    );
    return { ...booster, template };
  });

  // Debug: log what will be returned
  console.log('boosterTemplates:', boosterTemplates);
  console.log('boosterInventory:', boosterInventory);
  console.log('boosterInventoryWithTemplate:', boosterInventoryWithTemplate);

  return NextResponse.json({
    userPlants: userPlantsWithTemplate,
    seedInventory: seedInventoryWithTemplate,
    boosterInventory: boosterInventoryWithTemplate,
  });
} 