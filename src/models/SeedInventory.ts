import mongoose from 'mongoose';

const SeedInventorySchema = new mongoose.Schema({
  userId: String,
  plantTemplateId: mongoose.Schema.Types.ObjectId, // Use ObjectId type
  quantity: Number,
}, { collection: 'SeedInventory' }); // Explicitly set collection name

export default mongoose.models.SeedInventory ||
  mongoose.model('SeedInventory', SeedInventorySchema); 