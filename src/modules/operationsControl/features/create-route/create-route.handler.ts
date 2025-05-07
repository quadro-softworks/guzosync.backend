import { injectable, inject } from 'tsyringe';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { CreateRouteCommand } from './create-route.command';
import { ConflictError } from '@core/errors/conflict.error';
import { NotFoundError } from '@core/errors/not-found.error';
import { IEventBus } from '@core/events/event-bus';
import { RouteCreatedEvent } from '@modules/busRouteManagement/constants/events';

@injectable()
export class CreateRouteHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: CreateRouteCommand): Promise<any> {
    // Check if a route with the same name already exists
    const existingRoute = await RouteModel.findOne({
      name: command.name,
    });

    if (existingRoute) {
      throw new ConflictError(
        `Route with name ${command.name} already exists.`
      );
    }

    // Validate that all bus stops exist
    const { stopIds } = command;
    const busStopsCount = await BusStopModel.countDocuments({
      _id: { $in: stopIds }
    });

    if (busStopsCount !== stopIds.length) {
      throw new NotFoundError('One or more bus stops do not exist');
    }

    // Create new route
    const newRoute = new RouteModel({
      name: command.name,
      description: command.description,
      stopIds: command.stopIds,
      totalDistance: command.totalDistance,
      estimatedDuration: command.estimatedDuration,
      isActive: command.isActive,
    });

    // Save to database
    const savedRoute = await newRoute.save();

    // Publish event for other modules to react to
    this.eventBus.publish({
      type: RouteCreatedEvent,
      payload: savedRoute.toJSON(),
      timestamp: new Date()
    });

    // Return route data
    return savedRoute.toJSON();
  }
} 