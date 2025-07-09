import mongoose from 'mongoose';

const UserPlantsSchema = new mongoose.Schema({
  userId: String,
  plantTemplateId: mongoose.Schema.Types.ObjectId,
  plantLevel: Number,
  plantCurrentXp: Number,
  level: Number, // optional, for legacy/compat
  xp: Number,    // optional, for legacy/compat
}, { collection: 'UserPlants' }); // Explicitly set collection name

export default mongoose.models.UserPlants ||
  mongoose.model('UserPlants', UserPlantsSchema); 