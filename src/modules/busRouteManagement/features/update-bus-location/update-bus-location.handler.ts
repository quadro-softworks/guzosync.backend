import { injectable, inject } from 'tsyringe';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { UpdateBusLocationCommand } from './update-bus-location.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusLocationUpdatedEvent } from '@modules/busRouteManagement/constants/events';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';
import { plainToClass } from 'class-transformer';
import { Location } from '@core/domain/valueObjects/location.vo';

@injectable()
export class UpdateBusLocationHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: UpdateBusLocationCommand): Promise<BusLocationUpdateResult> {
    const { busId, location } = command;
    
    // Check if bus exists
    const bus = await BusModel.findById(busId);
    if (!bus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }
    
    // Create a properly formatted location for MongoDB geospatial storage
    const geoLocation = {
      type: 'Point',
      coordinates: location.coordinates
    };
    
    // Transform the coordinates to match the Location vo format for domain usage
    const domainLocation: Location = {
      longitude: location.coordinates[0],
      latitude: location.coordinates[1]
    };
    
    // Update bus location
    const updatedBus = await BusModel.findByIdAndUpdate(
      busId,
      { 
        currentLocation: geoLocation,
        lastLocationUpdate: new Date()
      },
      { new: true }
    ).populate('assignedRouteId');
    
    if (!updatedBus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }
    
    // Create a properly typed result object
    const result = plainToClass(BusLocationUpdateResult, {
      busId: updatedBus._id?.toString() || busId,
      location: domainLocation,
      routeId: updatedBus.assignedRouteId ? updatedBus.assignedRouteId.toString() : null,
      status: updatedBus.busStatus,
      etas: [] // We're not calculating ETAs here, that's done by the tracking service
    });
    
    // Publish event for other modules (including websocket broadcast)
    this.eventBus.publish({
      type: BusLocationUpdatedEvent,
      payload: result,
      timestamp: new Date()
    });
    
    return result;
  }
} 