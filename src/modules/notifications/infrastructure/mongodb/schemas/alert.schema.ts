import { AlertSeverity } from '@core/domain/enums/alert-severity.enum';
import { Alert } from '@core/domain/models/alert.model';
import mongoose, { Schema, Document } from 'mongoose';

export interface IAlertDocument extends Omit<Alert, 'id'>, Document {}

const AlertSchema = new Schema<IAlertDocument>(
  {
    title: { type: String, required: true },
    severity: {
      type: String,
      enum: AlertSeverity,
      required: true,
      default: AlertSeverity.INFO,
    },
    description: { type: String, required: true },
    affectedRouteIds: [{ type: Schema.Types.ObjectId, ref: 'Route' }],
    affectedBusStopIds: [{ type: Schema.Types.ObjectId, ref: 'BusStop' }],
    activeFrom: { type: Date, required: true, default: Date.now },
    activeUntil: { type: Date }, // Optional expiry
    createdByUserId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional: who created it
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

export const AlertModel = mongoose.model<IAlertDocument>('Alert', AlertSchema);
