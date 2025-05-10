import { injectable, inject } from 'tsyringe';
import { FeedbackModel } from '../../infrastructure/mongodb/schemas/feedback.schema';
import { CreateFeedbackCommand } from './create-feedback.command';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { NotFoundError } from '@core/errors/not-found.error';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { FeedbackResult } from '@core/app/dtos/feedback-result.dto';
import { plainToClass } from 'class-transformer';

@injectable()
export class CreateFeedbackHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: CreateFeedbackCommand, userId: string): Promise<FeedbackResult> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to submit feedback');
    }
    
    // Validate bus exists
    const bus = await BusModel.findById(command.busId);
    if (!bus) {
      throw new NotFoundError(`Bus with ID ${command.busId} not found`);
    }
    
    // Validate route exists
    const route = await RouteModel.findById(command.routeId);
    if (!route) {
      throw new NotFoundError(`Route with ID ${command.routeId} not found`);
    }
    
    // Create new feedback
    const feedback = new FeedbackModel({
      userId,
      tripId: command.tripId,
      busId: command.busId,
      routeId: command.routeId,
      rating: command.rating,
      comments: command.comments,
      feedbackType: command.feedbackType,
      dateOfTrip: command.dateOfTrip,
    });
    
    // Save to database
    const savedFeedback = await feedback.save();
    
    // Transform to DTO
    const feedbackResult = plainToClass(FeedbackResult, savedFeedback.toJSON());
    
    // Publish event
    this.eventBus.publish({
      type: 'feedback.created',
      payload: feedbackResult,
      timestamp: new Date()
    });
    
    return feedbackResult;
  }
} 