import { IBus } from '@core/domain/models/bus.model';
import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';
import mongoose, { Schema, Document } from 'mongoose';

export interface IBusDocument extends Document, Omit<IBus, 'id'> {}

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

const BusSchema = new Schema<IBusDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    busType: {
      type: String,
      enum: Object.values(BusType),
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 120,
    },
    currentLocation: LocationSchema,
    assignedRouteId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
    },
    assignedDriverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    busStatus: {
      type: String,
      enum: Object.values(BusStatus),
      required: true,
    },
    manufactureYear: {
      type: Number,
    },
    busModel: {
      type: String,
      trim: true,
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

export const BusModel = mongoose.model<IBusDocument>('Bus', BusSchema);
