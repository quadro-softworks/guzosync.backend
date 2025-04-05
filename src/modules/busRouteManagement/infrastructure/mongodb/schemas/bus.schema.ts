import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';
import { Bus } from '@core/domain/models/bus.model';
import { Location } from '@core/domain/valueObjects/location.vo';
import mongoose, { Schema, Document } from 'mongoose';

export interface IBusDocument extends Omit<Bus, 'id' | 'currentLocation'> {
  currentLocation?: Location; // Define type for mongoose
}

// Re-use Location Schema Structure if not imported
const LocationSchemaStructure: Record<keyof Location, any> = {
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
  // timestamp: { type: Date } // If location has timestamp
};
const LocationSchema = new Schema(LocationSchemaStructure, { _id: false });

const BusSchema = new Schema<IBusDocument>(
  {
    licensePlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    busType: { type: String, enum: Object.values(BusType), required: true },
    capacity: { type: Number, required: true, min: 0 },
    currentLocation: { type: LocationSchema }, // Embedded Location
    assignedRouteId: { type: Schema.Types.ObjectId, ref: 'Route' },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference User (driver)
    busStatus: {
      type: String,
      enum: Object.values(BusStatus),
      required: true,
      default: BusStatus.Inactive,
      index: true,
    },
    manufactureYear: { type: Number },
    model: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const BusModel = mongoose.model<IBusDocument>('Bus', BusSchema);
