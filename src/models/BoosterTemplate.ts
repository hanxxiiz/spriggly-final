import mongoose from 'mongoose';

const BoosterTemplateSchema = new mongoose.Schema({
  name: String,
  description: String,
  effectType: String,
  price: Number,
  itemImageUrl: String,
}, { collection: 'BoosterTemplate' }); // Explicitly set collection name

export default mongoose.models.BoosterTemplate ||
  mongoose.model('BoosterTemplate', BoosterTemplateSchema); 