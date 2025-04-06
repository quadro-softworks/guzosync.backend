import { Feedback } from '@core/domain/models/feedback.model';
import { FeedbackId, UserId } from '@core/domain/valueObjects';

export interface IFeedbackResult extends Feedback {}

export class FeedbackResult implements IFeedbackResult {
  id: FeedbackId;
  submittedByUserId: UserId;
  content: string;
  rating?: number;
  relatedTripId?: string;
  relatedBusId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(feedback: FeedbackResult) {
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
