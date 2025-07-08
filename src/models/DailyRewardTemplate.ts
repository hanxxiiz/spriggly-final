// models/DailyRewardTemplate.ts
import { Schema, model } from 'mongoose';

const rewardSchema = new Schema({
  day: { type: Number, required: true, unique: true },
  rewards: {
    coins: { type: Number, required: true },
    boosterReward: {
      templateId: { type: Schema.Types.ObjectId, ref: 'BoosterTemplate' },
      quantity: { type: Number }
    },
    seedReward: {
      templateId: { type: Schema.Types.ObjectId, ref: 'PlantTemplate' },
      quantity: { type: Number },
    },
  },
}, {
  collection: 'DailyRewardTemplates',
});

export default model('DailyRewardTemplates', rewardSchema);