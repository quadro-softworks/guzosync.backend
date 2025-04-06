import mongoose, { Schema, Document } from 'mongoose';
import { IBusDriver } from '@core/domain/models/bus-driver.model';

export interface IBusDriverDocument extends Document, Omit<IBusDriver, 'id'> {}

const BusDriverSchema = new Schema<IBusDriverDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    assignedBusId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
    },
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
