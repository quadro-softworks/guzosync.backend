import { Location } from '@core/domain/valueObjects/location.vo';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { StopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/stop.schema';
import { injectable, inject } from 'tsyringe';
import { IMapService, IMapServiceMeta } from './map.service';

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
export class ETAService implements IETAService {
  constructor(
    @inject(IMapServiceMeta.name) private mapService: IMapService
  ) {}

  async calculateRouteETAs(
    routeId: string,
    currentBusLocation: Location,
  ): Promise<{ stopId: string; etaMinutes: number | null }[]> {
    const route = await RouteModel.findById(routeId);
    if (!route || !Array.isArray(route.stopIds) || route.stopIds.length === 0) {
      return [];
    }

    // Get all stops for this route
    const stops = await StopModel.find({
      _id: { $in: route.stopIds }
    });

    if (!stops || stops.length === 0) {
      return [];
    }

    // Sort stops by sequence in the route
    const sortedStops = stops.sort((a: any, b: any) => {
      const aIndex = route.stopIds.findIndex((id: any) => id.toString() === a._id.toString());
      const bIndex = route.stopIds.findIndex((id: any) => id.toString() === b._id.toString());
      return aIndex - bIndex;
    });

    // Find current position in route
    // Get nearest point on route if route has geometry data
    let nearestPointOnRoute = currentBusLocation;
    
    // Check if route has geometry data (added as any to bypass TypeScript error)
    const routeWithGeometry = route as any;
    if (routeWithGeometry.geometry) {
      const result = this.mapService.findNearestPointOnRoute(
        routeWithGeometry.geometry, 
        currentBusLocation
      );
      if (result) {
        nearestPointOnRoute = result;
      }
    }

    // Calculate ETAs for each upcoming stop
    const etas: { stopId: string; etaMinutes: number | null }[] = [];
    
    // Convert stop locations to proper Location objects
    for (const stop of sortedStops) {
      // Cast stop to any to bypass TypeScript errors
      const typedStop = stop as any;
      if (!typedStop.location) continue;
      
      const stopLocation: Location = {
        latitude: typedStop.location.coordinates[1],
        longitude: typedStop.location.coordinates[0]
      };
      
      try {
        // Calculate time using Map Service
        const etaMinutes = await this.mapService.estimateTravelTimeBetweenPoints(
          nearestPointOnRoute,
          stopLocation
        );
        
        etas.push({
          stopId: typedStop._id.toString(),
          etaMinutes
        });
        
        // Update the reference point for next calculation
        nearestPointOnRoute = stopLocation;
      } catch (error) {
        console.error(`Error calculating ETA for stop ${typedStop._id}:`, error);
        etas.push({
          stopId: typedStop._id.toString(),
          etaMinutes: null
        });
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
}
