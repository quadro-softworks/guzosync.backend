import mongoose, { Schema, Document } from 'mongoose';
import { IAlert } from '@core/domain/models/alert.model';
import { AlertSeverity } from '@core/domain/enums/alert-severity.enum';

export interface IAlertDocument extends Document, Omit<IAlert, 'id'> {}

const AlertSchema = new Schema<IAlertDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
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
        type: String,
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
