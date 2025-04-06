import mongoose, { Schema, Document } from 'mongoose';
import { IPassenger } from '@core/domain/models/passenger.model';

export interface IPassengerDocument extends Document, Omit<IPassenger, 'id'> {}

const PassengerSchema = new Schema<IPassengerDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    // personalizedAlerts: [{
    //   type: String,
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
