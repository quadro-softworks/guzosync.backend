import { plainToClass } from 'class-transformer';
import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { Location } from '@core/domain/valueObjects/location.vo';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import {
  IETAServiceMeta,
  IETAService,
} from '@modules/busRouteManagement/services/eta.service';
import { injectable, inject } from 'tsyringe';
import { BusLocationUpdateResult } from '@core/app/dtos/bus-location-update-result.dto';

export interface ITrackingService {
  getBusUpdatesForRoute(routeId: string): Promise<BusLocationUpdateResult[]>;
  getBusDetailsWithETA(busId: string): Promise<BusLocationUpdateResult | null>; // For REST API
}

export const ITrackingServiceMeta = { name: 'ITrackingService' };

@injectable()
export class TrackingService implements ITrackingService {
  constructor(@inject(IETAServiceMeta.name) private etaService: IETAService) {}

  async getBusUpdatesForRoute(
    routeId: string,
  ): Promise<BusLocationUpdateResult[]> {
    // Find active buses currently assigned to this route
    const buses = await BusModel.find({
      assignedRouteId: routeId,
      busStatus: BusStatus.Active, // Only track active buses
      currentLocation: { $ne: null }, // Only buses with a location
    }).select('currentLocation assignedRouteId busStatus'); // Select necessary fields

    const updates: BusLocationUpdateResult[] = [];
    for (const bus of buses) {
      if (bus.currentLocation && bus.assignedRouteId && bus.currentLocation) {
        const etas = await this.etaService.calculateRouteETAs(
          bus.assignedRouteId.toString(),
          bus.currentLocation,
        );
        updates.push({
          ...plainToClass(BusLocationUpdateResult, bus),
          etas,
        });
      }
    }
    return updates;
  }

  async getBusDetailsWithETA(
    busId: string,
  ): Promise<BusLocationUpdateResult | null> {
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

    return { ...plainToClass(BusLocationUpdateResult, bus), etas };
  }
}
