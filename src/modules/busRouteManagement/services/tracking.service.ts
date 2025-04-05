import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { Location } from '@core/domain/valueObjects/location.vo';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import {
  IETAServiceMeta,
  IETAService,
} from '@modules/busRouteManagement/services/eta.service';
import { injectable, inject } from 'tsyringe';

// Define the structure of the update payload
export interface BusLocationUpdate {
  busId: string;
  location: Location | null; // Location might be null if bus inactive
  routeId: string | null;
  status: BusStatus;
  etas: { stopId: string; etaMinutes: number | null }[]; // Calculated ETAs for relevant stops
}

export interface ITrackingService {
  getBusUpdatesForRoute(routeId: string): Promise<BusLocationUpdate[]>;
  getBusDetailsWithETA(busId: string): Promise<BusLocationUpdate | null>; // For REST API
}

export const ITrackingServiceMeta = { name: 'ITrackingService' };

@injectable()
export class TrackingService implements ITrackingService {
  constructor(@inject(IETAServiceMeta.name) private etaService: IETAService) {}

  async getBusUpdatesForRoute(routeId: string): Promise<BusLocationUpdate[]> {
    // Find active buses currently assigned to this route
    const buses = await BusModel.find({
      assignedRouteId: routeId,
      busStatus: BusStatus.Active, // Only track active buses
      currentLocation: { $ne: null }, // Only buses with a location
    }).select('currentLocation assignedRouteId busStatus'); // Select necessary fields

    const updates: BusLocationUpdate[] = [];
    for (const bus of buses) {
      if (bus.currentLocation && bus.assignedRouteId) {
        const etas = await this.etaService.calculateRouteETAs(
          bus.assignedRouteId.toString(),
          bus.currentLocation,
        );
        updates.push({
          busId: bus._id.toString(),
          location: bus.currentLocation,
          routeId: bus.assignedRouteId.toString(),
          status: bus.busStatus,
          etas: etas,
        });
      }
    }
    return updates;
  }

  async getBusDetailsWithETA(busId: string): Promise<BusLocationUpdate | null> {
    const bus = await BusModel.findById(busId).select(
      'currentLocation assignedRouteId busStatus',
    );
    if (!bus) {
      return null;
    }

    let etas: { stopId: string; etaMinutes: number | null }[] = [];
    if (
      bus.currentLocation &&
      bus.assignedRouteId &&
      bus.busStatus === BusStatus.Active
    ) {
      etas = await this.etaService.calculateRouteETAs(
        bus.assignedRouteId.toString(),
        bus.currentLocation,
      );
    }

    return {
      busId: bus._id.toString(),
      location: bus.currentLocation ?? null,
      routeId: bus.assignedRouteId?.toString() ?? null,
      status: bus.busStatus,
      etas: etas,
    };
  }
}
