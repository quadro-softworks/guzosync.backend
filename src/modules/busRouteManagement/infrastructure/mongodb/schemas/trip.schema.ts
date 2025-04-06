import mongoose, { Schema, Document } from 'mongoose';
import { ITrip } from '@core/domain/models/trip.model';
import { TripStatus } from '@core/domain/enums/trip-status.enum';

export interface ITripDocument extends Document, Omit<ITrip, 'id'> {}

const TripSchema = new Schema<ITripDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
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
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    scheduleId: {
      type: String,
      ref: 'Schedule',
    },
    actualDepartureTime: {
      type: Date,
    },
    actualArrivalTime: {
      type: Date,
    },
    estimatedArrivalTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(TripStatus),
      required: true,
      index: true,
    },
    passengerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    feedbackIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
      },
    ],
    // waypoints: [LocationSchema],
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

export const TripModel = mongoose.model<ITripDocument>('Trip', TripSchema);
