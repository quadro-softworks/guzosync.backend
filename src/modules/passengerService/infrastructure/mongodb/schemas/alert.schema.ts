import mongoose, { Document, Schema } from 'mongoose';
import { AlertType } from '../../../../userManagement/features/create-alert/create-alert.command';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  alertType: AlertType;
  targetId: string; // Bus ID, Route ID, or Bus Stop ID
  targetType: 'BUS' | 'ROUTE' | 'BUS_STOP';
  threshold?: number; // For delay or ETA change in minutes
  message?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alertType: {
      type: String,
      enum: Object.values(AlertType),
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['BUS', 'ROUTE', 'BUS_STOP'],
      required: true,
    },
    threshold: {
      type: Number,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create a compound index to prevent duplicate alerts for the same user, target, and alert type
alertSchema.index(
  { userId: 1, targetId: 1, alertType: 1 },
  { unique: true }
);

export const AlertModel = mongoose.model<IAlert>('Alert', alertSchema); 