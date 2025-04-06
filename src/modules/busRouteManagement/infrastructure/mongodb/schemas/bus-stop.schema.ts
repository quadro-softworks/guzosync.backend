import mongoose, { Schema, Document } from 'mongoose';
import { IBusStop } from '@core/domain/models/bus-stop.model';

export interface IBusStopDocument extends Document, Omit<IBusStop, 'id'> {}

const LocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false },
);

const BusStopSchema = new Schema<IBusStopDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: LocationSchema,
      required: true,
      index: '2dsphere',
    },
    capacity: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

export const BusStopModel = mongoose.model<IBusStopDocument>(
  'BusStop',
  BusStopSchema,
);
