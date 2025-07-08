import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  hashedPassword: string;
  password?: string; // For backward compatibility with plain text passwords
  level: number;
  userCurrentXp: number;
  currentStreak: number;
  longestStreak: number;
  currentCoins: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  totalFocusHours: number;
  tasksCompleted: number;
  totalPlantsCollected: number;
  profilePictureUrl: string;
  currentPlantIds: mongoose.Types.ObjectId[];
  lastClaimedDate: Date;
  dailyStreakDay: number;
  claimedDays: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  hashedPassword: {
    type: String,
    required: false, // Make it optional for backward compatibility
    select: false,
  },
  password: {
    type: String,
    required: false, // For backward compatibility with plain text passwords
    select: false,
  },
  level: {
    type: Number,
    default: 1,
  },
  userCurrentXp: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  currentCoins: {
    type: Number,
    default: 0,
  },
  totalCoinsEarned: {
    type: Number,
    default: 0,
  },
  totalCoinsSpent: {
    type: Number,
    default: 0,
  },
  totalFocusHours: {
    type: Number,
    default: 0,
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  totalPlantsCollected: {
    type: Number,
    default: 0,
  },
  profilePictureUrl: {
    type: String,
    default: '',
  },
  currentPlantIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
  }],
  lastClaimedDate: {
    type: Date,
    default: Date.now,
  },
  dailyStreakDay: {
    type: Number,
    default: 0,
  },
  claimedDays: {
    type: [String],
    default: [],
  },
}, {
  collection: 'Users', // Specify the correct collection name
});

// 🔐 Hash the password before saving (only for new hashedPassword field)
userSchema.pre('save', async function (next) {
  if (!this.isModified('hashedPassword')) return next();

  const salt = await bcrypt.genSalt(10);
  this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);

  next();
});

// 🔍 Compare raw password to hashed one
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (this.hashedPassword) {
    return await bcrypt.compare(candidatePassword, this.hashedPassword);
  }
  return false;
};

// Export model safely
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
