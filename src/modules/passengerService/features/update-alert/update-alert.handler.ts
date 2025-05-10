import { injectable, inject } from 'tsyringe';
import { AlertModel } from '../../infrastructure/mongodb/schemas/alert.schema';
import { UpdateAlertCommand } from './update-alert.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { AlertResult } from '@core/app/dtos/alert-result.dto';
import { plainToClass } from 'class-transformer';

@injectable()
export class UpdateAlertHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: UpdateAlertCommand, userId: string): Promise<AlertResult> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to update alerts');
    }
    
    const { alertId, updates } = command;
    
    // Check if alert exists and belongs to the user
    const alert = await AlertModel.findById(alertId);
    
    if (!alert) {
      throw new NotFoundError(`Alert with ID ${alertId} not found`);
    }
    
    // Ensure user owns this alert
    if (alert.userId.toString() !== userId) {
      throw new UnauthorizedError('You do not have permission to update this alert');
    }
    
    // Apply updates
    const updatedAlert = await AlertModel.findByIdAndUpdate(
      alertId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedAlert) {
      throw new NotFoundError(`Alert with ID ${alertId} not found`);
    }
    
    // Transform to DTO
    const alertResult = plainToClass(AlertResult, updatedAlert.toJSON());
    
    // Publish event
    this.eventBus.publish({
      type: 'alert.updated',
      payload: alertResult,
      timestamp: new Date()
    });
    
    return alertResult;
  }
} 