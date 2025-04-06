import mongoose, { Schema, Document } from 'mongoose';
import { IFeedback } from '@core/domain/models/feedback.model';

export interface IFeedbackDocument extends Document, Omit<IFeedback, 'id'> {}

const FeedbackSchema = new Schema<IFeedbackDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true,
    },
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
      type: String,
      ref: 'Trip',
    },
    relatedBusId: {
      type: String,
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
