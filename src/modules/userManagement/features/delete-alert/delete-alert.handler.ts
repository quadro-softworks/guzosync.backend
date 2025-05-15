import { injectable, inject } from 'tsyringe';
import { AlertModel } from '../../../passengerService/infrastructure/mongodb/schemas/alert.schema';
import { DeleteAlertCommand } from './delete-alert.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { IEventBus } from '@core/events/event-bus.interface';

@injectable()
export class DeleteAlertHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: DeleteAlertCommand, userId: string): Promise<{ success: boolean; message: string }> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to delete alerts');
    }
    
    const { alertId } = command;
    
    // Check if alert exists and belongs to the user
    const alert = await AlertModel.findById(alertId);
    
    if (!alert) {
      throw new NotFoundError(`Alert with ID ${alertId} not found`);
    }
    
    // Ensure user owns this alert
    if (alert.userId.toString() !== userId) {
      throw new UnauthorizedError('You do not have permission to delete this alert');
    }
    
    // Delete the alert
    const result = await AlertModel.findByIdAndDelete(alertId);
    
    if (!result) {
      throw new NotFoundError(`Alert with ID ${alertId} not found`);
    }
    
    // Publish event
    this.eventBus.publish({
      type: 'alert.deleted',
      payload: { id: alertId },
      timestamp: new Date()
    });
    
    return {
      success: true,
      message: `Alert with ID ${alertId} has been deleted successfully`,
    };
  }
} 