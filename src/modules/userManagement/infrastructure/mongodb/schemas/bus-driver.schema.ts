import mongoose, { Schema, Document } from 'mongoose';
import { IBusDriver } from '@core/domain/models/bus-driver.model';

// Applied the reversed Omit pattern here
export interface IBusDriverDocument extends Omit<Document, 'id'>, IBusDriver {}

const BusDriverSchema = new Schema<IBusDriverDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Ensure one user cannot be a driver multiple times
    },
    assignedBusId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
    },
    // Add other driver-specific fields from IBusDriver like licenseNumber if needed
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const BusDriverModel = mongoose.model<IBusDriverDocument>(
  'BusDriver',
  BusDriverSchema,
);
