import { injectable } from 'tsyringe';
import { Location } from '@core/domain/valueObjects/location.vo';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as turf from '@turf/turf';

export interface IMapService {
  estimateTravelTimeBetweenPoints(origin: Location, destination: Location): Promise<number | null>;
  reverseGeocode(location: Location): Promise<string | null>;
  calculateDistanceKm(origin: Location, destination: Location): number;
  findNearestPointOnRoute(routeGeometry: any, location: Location): Location | null;
}

export const IMapServiceMeta = { name: 'IMapService' };

@injectable()
export class MapBoxService implements IMapService {
  private directionsClient;
  private geocodingClient;
  private mapboxToken: string;

  constructor() {
    // Ideally, load from environment or configuration service
    this.mapboxToken = process.env.MAPBOX_TOKEN || '';
    
    if (!this.mapboxToken) {
      console.warn('MapBox token not provided! Map functionality will be limited');
    }
    
    this.directionsClient = mbxDirections({ accessToken: this.mapboxToken });
    this.geocodingClient = mbxGeocoding({ accessToken: this.mapboxToken });
  }

  /**
   * Estimate travel time between two points using the Mapbox Directions API
   * @param origin Starting location
   * @param destination Ending location
   * @returns Estimated travel time in minutes, or null if unable to calculate
   */
  async estimateTravelTimeBetweenPoints(
    origin: Location,
    destination: Location
  ): Promise<number | null> {
    try {
      // Check if token exists
      if (!this.mapboxToken) {
        return this.estimateTravelTimeBasic(origin, destination);
      }

      const response = await this.directionsClient.getDirections({
        profile: 'driving',
        waypoints: [
          { coordinates: [origin.longitude, origin.latitude] },
          { coordinates: [destination.longitude, destination.latitude] }
        ],
        geometries: 'geojson'
      }).send();

      const data = response.body;
      if (data.routes && data.routes.length > 0) {
        // Return duration in minutes
        return Math.round(data.routes[0].duration / 60);
      }
      
      return null;
    } catch (error) {
      console.error('Error calculating travel time:', error);
      // Fallback to basic calculation if API fails
      return this.estimateTravelTimeBasic(origin, destination);
    }
  }

  /**
   * Simple fallback calculation assuming straight line distance and fixed speed
   * @param origin Starting point
   * @param destination Ending point
   * @returns Estimated time in minutes
   */
  private estimateTravelTimeBasic(origin: Location, destination: Location): number {
    const distanceKm = this.calculateDistanceKm(origin, destination);
    // Assume average speed of 25 km/h in Addis Ababa traffic
    const averageSpeedKmh = 25;
    // Convert to minutes
    return Math.round((distanceKm / averageSpeedKmh) * 60);
  }

  /**
   * Reverse geocode a location to get a human-readable address
   * @param location The location to reverse geocode
   * @returns Address string or null if geocoding fails
   */
  async reverseGeocode(location: Location): Promise<string | null> {
    try {
      if (!this.mapboxToken) {
        return null;
      }
      
      const response = await this.geocodingClient
        .reverseGeocode({
          query: [location.longitude, location.latitude],
          limit: 1,
          countries: ['ET'], // Ethiopia
          types: ['address', 'poi', 'neighborhood']
        })
        .send();

      const features = response.body.features;
      if (features && features.length > 0) {
        return features[0].place_name;
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Calculate the distance between two points using the Haversine formula
   * @param origin Starting point
   * @param destination Ending point
   * @returns Distance in kilometers
   */
  calculateDistanceKm(origin: Location, destination: Location): number {
    const from = turf.point([origin.longitude, origin.latitude]);
    const to = turf.point([destination.longitude, destination.latitude]);
    // Calculate distance in kilometers
    return turf.distance(from, to);
  }

  /**
   * Find the nearest point on a route to a given location
   * @param routeGeometry GeoJSON LineString of the route
   * @param location Current location
   * @returns Nearest location on the route
   */
  findNearestPointOnRoute(routeGeometry: any, location: Location): Location | null {
    try {
      const point = turf.point([location.longitude, location.latitude]);
      const nearestPoint = turf.nearestPointOnLine(routeGeometry, point);
      
      if (nearestPoint && nearestPoint.geometry && nearestPoint.geometry.coordinates) {
        return {
          longitude: nearestPoint.geometry.coordinates[0],
          latitude: nearestPoint.geometry.coordinates[1]
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error finding nearest point on route:', error);
      return null;
    }
  }
} 