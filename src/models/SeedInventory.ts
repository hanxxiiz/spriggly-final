import mongoose, { Document, Model } from 'mongoose';

interface ISeedInventory extends Document {
  userId: mongoose.Types.ObjectId;
  seedTemplateId: mongoose.Types.ObjectId; // or plantTemplateId if you use PlantTemplate
  quantity: number;
}

const SeedInventorySchema = new mongoose.Schema<ISeedInventory>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seedTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlantTemplate', // or 'SeedTemplate' if you have that
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  collection: 'SeedInventory'
});

const SeedInventory: Model<ISeedInventory> = mongoose.models.SeedInventory || mongoose.model<ISeedInventory>('SeedInventory', SeedInventorySchema);
export default SeedInventory; 