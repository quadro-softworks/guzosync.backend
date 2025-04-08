import mongoose, { Schema, Document } from 'mongoose';
import { ITrip } from '@core/domain/models/trip.model';
import { TripStatus } from '@core/domain/enums/trip-status.enum';

// Applied the reversed Omit pattern here
export interface ITripDocument extends Omit<Document, 'id'>, ITrip {}

const TripSchema = new Schema<ITripDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
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
      type: String, // Assuming Schedule ID in the domain model is string
      // If Schedule ID is ObjectId, change type: Schema.Types.ObjectId and ref: 'Schedule'
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
        type: Schema.Types.ObjectId, // Assuming Feedback ID is ObjectId
        ref: 'Feedback',
      },
    ],
    // waypoints: [LocationSchema], // Uncomment and define LocationSchema if needed
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
