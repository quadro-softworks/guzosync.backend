import mongoose, { Schema, Document } from 'mongoose';
import { IBus } from '@core/domain/models/bus.model';
import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';

// Applied the reversed Omit pattern here
export interface IBusDocument extends Omit<Document, 'id'>, IBus {}

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
      // Make optional if location isn't always known/required
      required: false,
    },
  },
  { _id: false },
);

const BusSchema = new Schema<IBusDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
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
    currentLocation: {
      type: LocationSchema, // Embed the location sub-schema
      index: '2dsphere', // Geospatial index if querying by location often
    },
    lastLocationUpdate: {
      type: Date,
    },
    heading: {
      type: Number, // Direction in degrees (0-360)
      min: 0,
      max: 360,
    },
    speed: {
      type: Number, // Speed in km/h
      min: 0,
    },
    locationAccuracy: {
      type: Number, // Accuracy in meters
      min: 0,
    },
    currentAddress: {
      type: String,
      trim: true,
    },
    assignedRouteId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
    },
    assignedDriverId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assumes driver is linked via User ID
    },
    busStatus: {
      type: String,
      enum: Object.values(BusStatus),
      required: true,
      index: true,
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

export const BusModel = mongoose.model<IBusDocument>('Bus', BusSchema);
