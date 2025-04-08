import mongoose, { Schema, Document } from 'mongoose';
import { IPassenger } from '@core/domain/models/passenger.model';

// Applied the reversed Omit pattern here
export interface IPassengerDocument extends Omit<Document, 'id'>, IPassenger {}

const PassengerSchema = new Schema<IPassengerDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    // userId is likely needed here, assuming Passenger relates to a User
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Ensure one user cannot be a passenger multiple times in this specific table
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    // personalizedAlerts: [{ // Uncomment if IPassenger defines this
    //  type: String, // Or ObjectId depending on relation
    // }],
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

export const PassengerModel = mongoose.model<IPassengerDocument>(
  'Passenger',
  PassengerSchema,
);
