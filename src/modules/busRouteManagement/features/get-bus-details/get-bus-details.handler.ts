import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';
import { Bus } from '@core/domain/models/bus.model';
import { NotFoundError } from '@core/errors/not-found.error';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import {
  ITrackingServiceMeta,
  ITrackingService,
} from '@modules/busRouteManagement/services/tracking.service';
import { injectable, inject } from 'tsyringe';

// Define combined response type
export type BusDetailsResponse = Omit<Bus, 'id'> & {
  id: string;
  routeName?: string;
  etaInfo?: Omit<BusLocationUpdateResult, 'busId' | 'routeId' | 'status'>; // Reuse location/ETA structure
};

@injectable()
export class GetBusDetailsHandler {
  constructor(
    @inject(ITrackingServiceMeta.name)
    private trackingService: ITrackingService,
  ) {}

  async execute(busId: string): Promise<BusDetailsResponse> {
    const bus = await BusModel.findById(busId).populate(
      'assignedRouteId',
      'name',
    ); // Populate route name

    if (!bus) {
      throw new NotFoundError('Bus not found.');
    }

    // Fetch location/ETA info using the tracking service method
    const trackingInfo = await this.trackingService.getBusDetailsWithETA(busId);

    // Combine data
    const response: BusDetailsResponse = {
      ...(bus.toJSON() as any), // Use transformed bus data
      id: bus.id.toString(),
      routeName: (bus.assignedRouteId as any)?.name ?? undefined, // Extract populated name safely
      etaInfo: trackingInfo
        ? { location: trackingInfo.location, etas: trackingInfo.etas }
        : undefined,
      // Ensure required fields from Bus interface are present if not in toJSON
      licensePlate: bus.licensePlate,
      busType: bus.busType,
      capacity: bus.capacity,
      busStatus: bus.busStatus,
      createdAt: bus.createdAt,
      updatedAt: bus.updatedAt,
    };

    return response;
  }
}
