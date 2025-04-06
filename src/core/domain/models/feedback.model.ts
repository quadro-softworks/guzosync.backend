import { FeedbackId, UserId } from '@core/domain/valueObjects';

export interface IFeedback {
  id: FeedbackId;
  submittedByUserId: UserId; // Reference to the User who submitted
  content: string;
  rating?: number; // Optional rating
  relatedTripId?: string; // Optional reference to a Trip
  relatedBusId?: string; // Optional reference to a Bus
  createdAt: Date;
  updatedAt: Date;
}

export class Feedback {
  id: FeedbackId;
  submittedByUserId: UserId;
  content: string;
  rating?: number;
  relatedTripId?: string;
  relatedBusId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(feedback: IFeedback) {
    this.id = feedback.id;
    this.submittedByUserId = feedback.submittedByUserId;
    this.content = feedback.content;
    this.rating = feedback.rating;
    this.relatedTripId = feedback.relatedTripId;
    this.relatedBusId = feedback.relatedBusId;
    this.createdAt = feedback.createdAt;
    this.updatedAt = feedback.updatedAt;
  }
}
