import { injectable, inject } from 'tsyringe';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { AssignBusToRouteCommand } from './assign-bus-to-route.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { IEventBus } from '@core/events/event-bus';
import { BusUpdatedEvent } from '@modules/busRouteManagement/constants/events';

@injectable()
export class AssignBusToRouteHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: AssignBusToRouteCommand): Promise<any> {
    const { busId, routeId } = command;
    
    // Check if bus exists
    const bus = await BusModel.findById(busId);
    if (!bus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }
    
    // Check if route exists
    const route = await RouteModel.findById(routeId);
    if (!route) {
      throw new NotFoundError(`Route with ID ${routeId} not found`);
    }
    
    // Update bus with assigned route using findByIdAndUpdate to avoid type issues
    const updatedBus = await BusModel.findByIdAndUpdate(
      busId,
      { assignedRouteId: routeId },
      { new: true }
    );
    
    if (!updatedBus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }
    
    // Publish event
    this.eventBus.publish({
      type: BusUpdatedEvent,
      payload: {
        ...updatedBus.toJSON(),
        routeAssigned: true,
        routeId
      },
      timestamp: new Date()
    });
    
    return {
      ...updatedBus.toJSON(),
      route: route.toJSON()
    };
  }
} 