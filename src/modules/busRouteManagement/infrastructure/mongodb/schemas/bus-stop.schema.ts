import { BusStop } from '@core/domain/models/bus-stop.model';
import { Location } from '@core/domain/valueObjects/location.vo';
import mongoose, { Schema, Document } from 'mongoose';

export interface IBusStopDocument
  extends Omit<BusStop, 'id' | 'location'>,
    Document {
  location: Location; // Define type for mongoose
}

// Re-use Location Schema Structure
const LocationSchemaStructure: Record<keyof Location, any> = {
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
};
const LocationSchema = new Schema(LocationSchemaStructure, { _id: false });

const BusStopSchema: Schema<IBusStopDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: LocationSchema, required: true }, // Embedded Location
    capacity: { type: Number }, // Max waiting buses
    isActive: { type: Boolean, default: true, index: true },
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

// Add 2dsphere index for geospatial queries on location
BusStopSchema.index({ location: '2dsphere' });

export const BusStopModel = mongoose.model<IBusStopDocument>(
  'BusStop',
  BusStopSchema,
);
