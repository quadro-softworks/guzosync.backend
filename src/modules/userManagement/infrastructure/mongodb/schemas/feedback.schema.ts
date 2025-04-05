import { Feedback } from '@core/domain/models/feedback.model';
import { UserId } from '@core/domain/valueObjects';
import mongoose, { Schema, Document } from 'mongoose';

const feedbackSchema = new Schema<Feedback>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      auto: true, // Auto-generate ObjectId if not provided
    },
    submittedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5, // Assuming rating is between 1 and 5
      default: null,
    },
    relatedTripId: {
      type: String,
      default: null,
    },
    relatedBusId: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically manage `createdAt` and `updatedAt` fields
  },
);

const FeedbackModel = mongoose.model<Feedback>('Feedback', feedbackSchema);

export default FeedbackModel;
