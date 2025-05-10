import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  tripId?: string;
  busId: string;
  routeId: string;
  rating: number;
  comments?: string;
  feedbackType?: 'SERVICE' | 'CLEANLINESS' | 'PUNCTUALITY' | 'SAFETY' | 'OTHER';
  dateOfTrip: Date;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tripId: {
      type: String,
      default: null,
    },
    busId: {
      type: String,
      required: true,
    },
    routeId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      default: null,
    },
    feedbackType: {
      type: String,
      enum: ['SERVICE', 'CLEANLINESS', 'PUNCTUALITY', 'SAFETY', 'OTHER'],
      default: 'OTHER',
    },
    dateOfTrip: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);
