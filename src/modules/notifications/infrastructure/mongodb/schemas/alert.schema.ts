import mongoose, { Schema, Document } from 'mongoose';
import { IAlert } from '@core/domain/models/alert.model';
import { AlertSeverity } from '@core/domain/enums/alert-severity.enum';

// Applied the reversed Omit pattern here
export interface IAlertDocument extends Omit<Document, 'id'>, IAlert {}

const AlertSchema = new Schema<IAlertDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: Object.values(AlertSeverity),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    affectedRouteIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
    affectedBusStopIds: [
      {
        type: String, // Consider changing to ObjectId if BusStop IDs are ObjectIds
      },
    ],
    activeFrom: {
      type: Date,
      required: true,
    },
    activeUntil: {
      type: Date,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

export const AlertModel = mongoose.model<IAlertDocument>('Alert', AlertSchema);
