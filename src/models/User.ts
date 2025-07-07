import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  claimedDay: number;
  lastClaimDate: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  claimedDay: {
    type: Number,
    default: 0,
  },
  lastClaimDate: {
    type: String,
    default: '',
  },
});

// 🔐 Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔍 Compare raw password to hashed one
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export model safely
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
