import { Location } from '@core/domain/valueObjects/location.vo';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { injectable, inject } from 'tsyringe';

export interface IETAService {
  // Calculate ETAs for upcoming stops on a route given current bus location
  calculateRouteETAs(
    routeId: string,
    currentBusLocation: Location,
  ): Promise<{ stopId: string; etaMinutes: number | null }[]>;
  // Calculate ETA for a specific stop
  calculateStopETA(
    routeId: string,
    stopId: string,
    currentBusLocation: Location,
  ): Promise<number | null>;
}

export const IETAServiceMeta = { name: 'IETAService' };

@injectable()
export class SimpleETAService implements IETAService {
  // TODO: Inject Route/Stop services if needed instead of direct models
  constructor() {}

  // VERY Basic Placeholder - Real implementation needs geometry, avg speeds etc.
  async calculateRouteETAs(
    routeId: string,
    currentBusLocation: Location,
  ): Promise<{ stopId: string; etaMinutes: number | null }[]> {
    console.warn(
      `[ETAService] Calculating basic ETAs for route ${routeId}. Needs proper implementation.`,
    );
    const route = await RouteModel.findById(routeId).populate('stopIds'); // Populate is inefficient, better fetch stops separately if needed
    if (!route || !Array.isArray(route.stopIds) || route.stopIds.length === 0) {
      return [];
    }

    // Placeholder: Find rough position and estimate based on fixed speed
    // In reality: determine which stop is next, calculate distance along route polyline, use avg speed/traffic
    const averageSpeedKmph = 30; // km/h - placeholder
    const etas: { stopId: string; etaMinutes: number | null }[] = [];

    // This is NOT accurate - just assigns increasing dummy ETAs
    let dummyMinutes = 5;
    for (const stopRef of route.stopIds) {
      // Mongoose returns populated docs or just IDs - handle both cases
      const stopId =
        typeof stopRef === 'object' && '_id' in stopRef
          ? (stopRef as any)._id.toString()
          : stopRef?.toString();
      if (stopId) {
        etas.push({ stopId: stopId, etaMinutes: dummyMinutes });
        dummyMinutes += 5; // Increment dummy ETA
      }
    }

    return etas;
  }

  async calculateStopETA(
    routeId: string,
    stopId: string,
    currentBusLocation: Location,
  ): Promise<number | null> {
    const routeETAs = await this.calculateRouteETAs(
      routeId,
      currentBusLocation,
    );
    const stopETA = routeETAs.find((eta) => eta.stopId === stopId);
    return stopETA?.etaMinutes ?? null;
  }

  // --- Helper for distance (Haversine formula - basic) ---
  private calculateDistanceKm(loc1: Location, loc2: Location): number {
    // ... implementation of Haversine ... Placeholder returns dummy
    return Math.random() * 5 + 1; // Dummy distance
  }
}
