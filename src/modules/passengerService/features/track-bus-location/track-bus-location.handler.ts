import { injectable, inject } from 'tsyringe';
import { TrackBusLocationQuery } from './track-bus-location.query';
import { NotFoundError } from '@core/errors/not-found.error';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { plainToClass } from 'class-transformer';
import { ITrackingService, ITrackingServiceMeta } from '@modules/busRouteManagement/services/tracking.service';

@injectable()
export class TrackBusLocationHandler {
  constructor(
    @inject(ITrackingServiceMeta.name) private trackingService: ITrackingService
  ) {}

  async execute(query: TrackBusLocationQuery): Promise<BusLocationUpdateResult> {
    const { busId } = query;
    
    // First, check if the bus exists
    const bus = await BusModel.findById(busId);
    if (!bus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }

    // Use the tracking service to get detailed bus information with ETAs
    const busWithEta = await this.trackingService.getBusDetailsWithETA(busId);
    
    if (!busWithEta) {
      // If bus exists but tracking service couldn't get details, return basic info
      return plainToClass(BusLocationUpdateResult, {
        busId: bus._id?.toString() || busId,
        location: bus.currentLocation,
        routeId: bus.assignedRouteId?.toString() || null,
        status: bus.busStatus,
        etas: []
      });
    }
    
    return busWithEta;
  }
} 