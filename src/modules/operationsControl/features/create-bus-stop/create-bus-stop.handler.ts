import { injectable, inject } from 'tsyringe';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { CreateBusStopCommand } from './create-bus-stop.command';
import { ConflictError } from '@core/errors/conflict.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusStopCreatedEvent } from '@modules/busRouteManagement/constants/events';

@injectable()
export class CreateBusStopHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: CreateBusStopCommand): Promise<any> {
    // Check if a bus stop with the same name already exists
    const existingBusStop = await BusStopModel.findOne({
      name: command.name,
    });

    if (existingBusStop) {
      throw new ConflictError(
        `Bus stop with name ${command.name} already exists.`
      );
    }

    // Create new bus stop
    const newBusStop = new BusStopModel({
      name: command.name,
      location: command.location,
      capacity: command.capacity,
      isActive: command.isActive,
    });

    // Save to database
    const savedBusStop = await newBusStop.save();

    // Publish event for other modules to react to
    this.eventBus.publish({
      type: BusStopCreatedEvent,
      payload: savedBusStop.toJSON(),
      timestamp: new Date()
    });

    // Return bus stop data
    return savedBusStop.toJSON();
  }
} 