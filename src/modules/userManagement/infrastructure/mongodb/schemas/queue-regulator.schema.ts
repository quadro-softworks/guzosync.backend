import mongoose, { Schema, Document } from 'mongoose';
import { IQueueRegulator } from '@core/domain/models/queue-regulator.model';

export interface IQueueRegulatorDocument
  extends Document,
    Omit<IQueueRegulator, 'id'> {}

const QueueRegulatorSchema = new Schema<IQueueRegulatorDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    assignedStopId: {
      type: Schema.Types.ObjectId,
      ref: 'BusStop',
    },
    // incidentReports: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'Incident',
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

export const QueueRegulatorModel = mongoose.model<IQueueRegulatorDocument>(
  'QueueRegulator',
  QueueRegulatorSchema,
);
