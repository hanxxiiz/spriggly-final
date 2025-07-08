import mongoose, { Document, Model } from 'mongoose';

interface IBoosterTemplate extends Document {
  name: string;
  description: string;
  effectType: string;
  price: number;
  itemImageUrl: string;
}

const BoosterTemplateSchema = new mongoose.Schema<IBoosterTemplate>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  effectType: { type: String, required: true },
  price: { type: Number, required: true },
  itemImageUrl: { type: String, required: true },
});

const BoosterTemplate: Model<IBoosterTemplate> = mongoose.models.BoosterTemplate || mongoose.model<IBoosterTemplate>('BoosterTemplate', BoosterTemplateSchema);
export default BoosterTemplate; 