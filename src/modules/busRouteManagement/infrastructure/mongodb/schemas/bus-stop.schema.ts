import mongoose, { Schema, Document } from 'mongoose';
import { IBusStop } from '@core/domain/models/bus-stop.model';

// Applied the reversed Omit pattern here
export interface IBusStopDocument extends Omit<Document, 'id'>, IBusStop {}

// Define LocationSchema for reuse if not already globally defined
const LocationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false },
);

const BusStopSchema = new Schema<IBusStopDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: LocationSchema, // Embed the location sub-schema
      required: true,
      index: '2dsphere', // Geospatial index
    },
    capacity: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Add other fields from IBusStop like amenities if needed
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Optionally transform location coordinates if needed
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Optionally transform location coordinates if needed
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
