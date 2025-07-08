import mongoose from 'mongoose';

const PlantTemplateSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  sceneUrl: String,
}, { collection: 'PlantTemplates' }); // Explicitly set collection name

export default mongoose.models.PlantTemplate ||
  mongoose.model('PlantTemplate', PlantTemplateSchema); 