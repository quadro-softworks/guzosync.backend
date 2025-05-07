import { injectable, inject } from 'tsyringe';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { UpdateBusStopCommand } from './update-bus-stop.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { ConflictError } from '@core/errors/conflict.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusStopUpdatedEvent } from '@modules/busRouteManagement/constants/events';

@injectable()
export class UpdateBusStopHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: UpdateBusStopCommand): Promise<any> {
    const { busStopId, updates } = command;
    
    // Check if bus stop exists
    const busStop = await BusStopModel.findById(busStopId);
    if (!busStop) {
      throw new NotFoundError(`Bus stop with ID ${busStopId} not found`);
    }
    
    // If name is being updated, check for duplicates
    if (updates.name) {
      const existingBusStop = await BusStopModel.findOne({
        name: updates.name,
        _id: { $ne: busStopId } // Exclude the current bus stop
      });
      
      if (existingBusStop) {
        throw new ConflictError(`Bus stop with name ${updates.name} already exists`);
      }
    }
    
    // Apply updates
    const updatedBusStop = await BusStopModel.findByIdAndUpdate(
      busStopId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    // Check if update was successful
    if (!updatedBusStop) {
      throw new NotFoundError(`Bus stop with ID ${busStopId} not found`);
    }
    
    // Publish event
    this.eventBus.publish({
      type: BusStopUpdatedEvent,
      payload: updatedBusStop.toJSON(),
      timestamp: new Date()
    });
    
    return updatedBusStop.toJSON();
  }
} 