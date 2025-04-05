import { Schedule } from '@core/domain/models/schedule.model';
import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduleDocument extends Omit<Schedule, 'id'>, Document {}

const ScheduleSchema: Schema<IScheduleDocument> = new Schema(
  {
    routeId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
      index: true,
    },
    // Example: 'WEEKDAYS', 'WEEKENDS', 'MON', '2025-12-25'
    schedulePattern: { type: String, required: true, index: true },
    // Example: ["08:00", "08:30", "09:00"] (Timezone assumed UTC or server default)
    departureTimes: [{ type: String, required: true }],
    assignedBusId: { type: Schema.Types.ObjectId, ref: 'Bus' },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User' },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
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

export const ScheduleModel = mongoose.model<IScheduleDocument>(
  'Schedule',
  ScheduleSchema,
);
