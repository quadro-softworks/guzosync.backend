import mongoose, { Schema, Document } from 'mongoose';
import { ISchedule } from '@core/domain/models/schedule.model';

export interface IScheduleDocument extends Document, Omit<ISchedule, 'id'> {}

const ScheduleSchema = new Schema<IScheduleDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
      index: true,
    },
    schedulePattern: {
      type: String,
      required: true,
    },
    departureTimes: [
      {
        type: String,
        required: true,
      },
    ],
    assignedBusId: {
      type: Schema.Types.ObjectId,
      ref: 'Bus',
    },
    assignedDriverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

export const ScheduleModel = mongoose.model<IScheduleDocument>(
  'Schedule',
  ScheduleSchema,
);
