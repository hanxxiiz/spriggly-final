import mongoose, { Document, Model } from 'mongoose';

interface IFocusSession extends Document {
  userId: mongoose.Types.ObjectId;
  durationMinutes: number;
  earnedXp: number;
  earnedCoins: number;
  completedAt: Date;
  surrendered: boolean;
}

const focusSessionSchema = new mongoose.Schema<IFocusSession>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  earnedXp: {
    type: Number,
    required: true,
    default: 0,
  },
  earnedCoins: {
    type: Number,
    required: true,
    default: 0,
  },
  completedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  surrendered: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  collection: 'FocusSessions',
});

// Export model safely
const FocusSession: Model<IFocusSession> = mongoose.models.FocusSession || mongoose.model<IFocusSession>('FocusSession', focusSessionSchema);
export default FocusSession; 