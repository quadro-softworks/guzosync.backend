import { injectable, inject } from 'tsyringe';
import { UpdateDriverLocationCommand } from './update-driver-location.command';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { NotFoundError } from '@core/errors/not-found.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { BusLocationUpdatedEvent } from '@modules/busRouteManagement/constants/events';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';
import { plainToClass } from 'class-transformer';
import { IMapService, IMapServiceMeta } from '@modules/busRouteManagement/services/map.service';

@injectable()
export class UpdateDriverLocationHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus,
    @inject(IMapServiceMeta.name) private mapService: IMapService
  ) {}

  async execute(command: UpdateDriverLocationCommand): Promise<BusLocationUpdateResult> {
    const { location, busId, driverId, heading, speed, accuracy } = command;
    
    // Create GeoJSON location for MongoDB
    const geoLocation = {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    };
    
    // Try to find bus or resolve it from driver
    let bus;
    if (busId) {
      bus = await BusModel.findById(busId);
      if (!bus) {
        throw new NotFoundError(`Bus with ID ${busId} not found`);
      }
    } else if (driverId) {
      // Find driver and their assigned bus
      const driver = await UserModel.findById(driverId);
      if (!driver) {
        throw new NotFoundError(`Driver with ID ${driverId} not found`);
      }
      
      // Find bus associated with this driver
      bus = await BusModel.findOne({ assignedDriverId: driverId });
      if (!bus) {
        throw new NotFoundError(`No bus assigned to driver with ID ${driverId}`);
      }
    } else {
      throw new Error('Either busId or driverId must be provided');
    }
    
    // Try to get address from coordinates
    let address;
    try {
      address = await this.mapService.reverseGeocode(location);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
    
    // Update bus location with all available data
    const updateData: any = {
      currentLocation: geoLocation,
      lastLocationUpdate: new Date(),
    };
    
    // Add optional fields if present
    if (heading !== undefined) updateData.heading = heading;
    if (speed !== undefined) updateData.speed = speed;
    if (accuracy !== undefined) updateData.locationAccuracy = accuracy;
    if (address) updateData.currentAddress = address;
    
    // Update the bus record
    const updatedBus = await BusModel.findByIdAndUpdate(
      bus._id,
      updateData,
      { new: true }
    ).populate('assignedRouteId');
    
    if (!updatedBus) {
      throw new NotFoundError(`Bus with ID ${bus._id} not found`);
    }
    
    // Create properly typed result object
    const result = plainToClass(BusLocationUpdateResult, {
      busId: updatedBus._id?.toString(),
      location: location,
      routeId: updatedBus.assignedRouteId ? updatedBus.assignedRouteId.toString() : null,
      status: updatedBus.busStatus,
      etas: [],
      heading: updatedBus.heading,
      speed: updatedBus.speed,
      accuracy: updatedBus.locationAccuracy,
      address: updatedBus.currentAddress
    });
    
    // Publish event for websocket broadcasts and other consumers
    this.eventBus.publish({
      type: BusLocationUpdatedEvent,
      payload: result,
      timestamp: new Date()
    });
    
    return result;
  }
} 