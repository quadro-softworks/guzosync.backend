import mongoose, { Schema, Document } from 'mongoose';
import { IFeedback } from '@core/domain/models/feedback.model';

// Applied the reversed Omit pattern here
export interface IFeedbackDocument extends Omit<Document, 'id'>, IFeedback {}

const FeedbackSchema = new Schema<IFeedbackDocument>(
  {
    // id is managed by Mongoose (_id) and transforms
    submittedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    relatedTripId: {
      type: Schema.Types.ObjectId, // Change if Trip ID is string in domain
      ref: 'Trip',
    },
    relatedBusId: {
      type: Schema.Types.ObjectId, // Change if Bus ID is string in domain
      ref: 'Bus',
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

export const FeedbackModel = mongoose.model<IFeedbackDocument>(
  'Feedback',
  FeedbackSchema,
);
