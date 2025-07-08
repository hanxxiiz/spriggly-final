import mongoose, { Document, Model } from 'mongoose';

interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  taskName: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  completedAt?: Date;
  earnedXp: number;
  earnedCoins: number;
}

const taskSchema = new mongoose.Schema<ITask>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    default: null,
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
}, {
  collection: 'Tasks',
});

// Export model safely
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);
export default Task; 