import { injectable, inject } from 'tsyringe';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { DeleteBusStopCommand } from './delete-bus-stop.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusStopDeletedEvent } from '@modules/busRouteManagement/constants/events';

@injectable()
export class DeleteBusStopHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: DeleteBusStopCommand): Promise<{ success: boolean; message: string }> {
    const { busStopId } = command;
    
    // Check if bus stop exists before attempting to delete
    const busStop = await BusStopModel.findById(busStopId);
    if (!busStop) {
      throw new NotFoundError(`Bus stop with ID ${busStopId} not found`);
    }
    
    // Delete the bus stop
    const result = await BusStopModel.findByIdAndDelete(busStopId);
    
    if (!result) {
      throw new NotFoundError(`Bus stop with ID ${busStopId} not found`);
    }
    
    // Publish event
    this.eventBus.publish({
      type: BusStopDeletedEvent,
      payload: { id: busStopId },
      timestamp: new Date()
    });
    
    return {
      success: true,
      message: `Bus stop with ID ${busStopId} has been deleted successfully`,
    };
  }
} 