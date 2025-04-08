import mongoose, { Schema, Document } from 'mongoose';
import { IQueueRegulator } from '@core/domain/models/queue-regulator.model';

// Applied the reversed Omit pattern here
export interface IQueueRegulatorDocument
  extends Omit<Document, 'id'>,
    IQueueRegulator {}

const QueueRegulatorSchema = new Schema<IQueueRegulatorDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Ensure one user cannot be a regulator multiple times
    },
    assignedStopId: {
      type: Schema.Types.ObjectId,
      ref: 'BusStop',
    },
    // incidentReports: [{ // Uncomment if IQueueRegulator defines this
    //  type: Schema.Types.ObjectId,
    //  ref: 'Incident',
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
