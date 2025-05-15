import { injectable, inject } from 'tsyringe';
import { AlertModel } from '../../../passengerService/infrastructure/mongodb/schemas/alert.schema';
import { CreateAlertCommand } from './create-alert.command';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { NotFoundError } from '@core/errors/not-found.error';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { ConflictError } from '@core/errors/conflict.error';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { AlertResult } from '@core/app/dtos/alert-result.dto';
import { plainToClass } from 'class-transformer';
import { IEventBus } from '@core/events/event-bus.interface';

@injectable()
export class CreateAlertHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: CreateAlertCommand, userId: string): Promise<AlertResult> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to create alerts');
    }
    
    // Validate user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    // Validate target exists based on targetType
    await this.validateTarget(command.targetId, command.targetType);
    
    // Check if a similar alert already exists
    const existingAlert = await AlertModel.findOne({
      userId,
      targetId: command.targetId,
      alertType: command.alertType,
      isActive: true
    });
    
    if (existingAlert) {
      throw new ConflictError('An active alert with the same parameters already exists');
    }
    
    // Create the alert
    const alert = new AlertModel({
      userId,
      alertType: command.alertType,
      targetId: command.targetId,
      targetType: command.targetType,
      threshold: command.threshold,
      message: command.message,
      isActive: command.isActive ?? true
    });
    
    // Save to database
    const savedAlert = await alert.save();
    
    // Transform to DTO
    const alertResult = plainToClass(AlertResult, savedAlert.toJSON());
    
    // Publish event - could be used for notifications or other integrations
    this.eventBus.publish({
      type: 'alert.created',
      payload: alertResult,
      timestamp: new Date()
    });
    
    return alertResult;
  }
  
  private async validateTarget(targetId: string, targetType: string): Promise<void> {
    let exists = false;
    
    switch (targetType) {
      case 'BUS':
        exists = !!(await BusModel.findById(targetId));
        break;
      case 'ROUTE':
        exists = !!(await RouteModel.findById(targetId));
        break;
      case 'BUS_STOP':
        exists = !!(await BusStopModel.findById(targetId));
        break;
      default:
        throw new Error(`Invalid target type: ${targetType}`);
    }
    
    if (!exists) {
      throw new NotFoundError(`${targetType} with ID ${targetId} not found`);
    }
  }
} 