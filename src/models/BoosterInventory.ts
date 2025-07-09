import mongoose, { Document, Model } from 'mongoose';

interface IBoosterInventory extends Document {
  userId: mongoose.Types.ObjectId;
  boosterTemplateId: mongoose.Types.ObjectId;
  quantity: number;
}

const BoosterInventorySchema = new mongoose.Schema<IBoosterInventory>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boosterTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BoosterTemplate',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  collection: 'BoosterInventory'
});

const BoosterInventory: Model<IBoosterInventory> = mongoose.models.BoosterInventory || mongoose.model<IBoosterInventory>('BoosterInventory', BoosterInventorySchema);
export default BoosterInventory; 