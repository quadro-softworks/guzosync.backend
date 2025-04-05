import { TripStatus } from '@core/domain/enums/trip-status.enum';
import { Trip } from '@core/domain/models/trip.model';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITripDocument extends Omit<Trip, 'id'>, Document {}

// Optional: If storing waypoints
// const LocationSchemaStructure: Record<keyof LocationVO, any> = { ... };
// const LocationSchema = new Schema(LocationSchemaStructure, { _id: false });

const TripSchema = new Schema<ITripDocument>(
  {
    busId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
      index: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
      index: true,
    },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule', index: true },
    actualDepartureTime: { type: Date },
    actualArrivalTime: { type: Date },
    estimatedArrivalTime: { type: Date },
    status: {
      type: String,
      enum: TripStatus,
      required: true,
      default: TripStatus.Scheduled,
      index: true,
    },
    passengerIds: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References users
    feedbackIds: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
    // waypoints: [LocationSchema], // Optional: store GPS trail
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

export const TripModel = mongoose.model<ITripDocument>('Trip', TripSchema);
