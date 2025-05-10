import { injectable, inject } from 'tsyringe';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { UpdateBusLocationMobileCommand } from './update-bus-location-mobile.command';
import { NotFoundError } from '@core/errors/not-found.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusLocationUpdatedEvent } from '@modules/busRouteManagement/constants/events';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';
import { plainToClass } from 'class-transformer';
import { Location } from '@core/domain/valueObjects/location.vo';

@injectable()
export class UpdateBusLocationMobileHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: UpdateBusLocationMobileCommand): Promise<BusLocationUpdateResult> {
    const { busId, latitude, longitude, accuracy, speed, heading, timestamp } = command;
    
    // Check if bus exists
    const bus = await BusModel.findById(busId);
    if (!bus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }
    
    // Create a properly formatted location for MongoDB geospatial storage
    const geoLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    
    // Transform the coordinates to match the Location vo format for domain usage
    const domainLocation: Location = {
      longitude,
      latitude
    };
    
    // Additional metadata from mobile device
    const locationMetadata = {
      accuracy,
      speed,
      heading,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    };
    
    // Update bus location
    const updatedBus = await BusModel.findByIdAndUpdate(
      busId,
      { 
        currentLocation: geoLocation,
        locationMetadata,
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
      etas: [], // We're not calculating ETAs here, that's done by the tracking service
      metadata: locationMetadata
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
