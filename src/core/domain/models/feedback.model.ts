import { FeedbackId, UserId } from '@core/domain/valueObjects';

export interface Feedback {
  id: FeedbackId;
  submittedByUserId: UserId; // Reference to the User who submitted
  content: string;
  rating?: number; // Optional rating
  relatedTripId?: string; // Optional reference to a Trip
  relatedBusId?: string; // Optional reference to a Bus
  createdAt: Date;
  updatedAt: Date;
}
