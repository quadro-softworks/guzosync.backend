import { injectable } from 'tsyringe';
import { Location } from '@core/domain/valueObjects/location.vo';
import axios from 'axios';
import * as turf from '@turf/turf';
import { IMapService, IMapServiceMeta } from './map.service';

@injectable()
export class GoogleMapsService implements IMapService {
  private googleMapsApiKey: string;

  constructor() {
    // Load from environment variable
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    
    if (!this.googleMapsApiKey) {
      console.warn('Google Maps API key not provided! Map functionality will be limited');
    }
  }

  /**
   * Estimate travel time between two points using Google Maps Directions API
   * @param origin Starting location
   * @param destination Ending location
   * @returns Estimated travel time in minutes, or null if unable to calculate
   */
  async estimateTravelTimeBetweenPoints(
    origin: Location,
    destination: Location
  ): Promise<number | null> {
    try {
      // Check if API key exists
      if (!this.googleMapsApiKey) {
        return this.estimateTravelTimeBasic(origin, destination);
      }

      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          mode: 'driving',
          key: this.googleMapsApiKey
        }
      });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        // Get the first leg of the first route
        const leg = response.data.routes[0].legs[0];
        
        // Return duration in minutes
        return Math.round(leg.duration.value / 60);
      }
      
      // Fallback to basic calculation if no routes found
      return this.estimateTravelTimeBasic(origin, destination);
    } catch (error) {
      console.error('Error calculating travel time with Google Maps:', error);
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
    // Assume average speed of 20 km/h in Addis Ababa traffic
    const averageSpeedKmh = 20;
    // Convert to minutes
    return Math.round((distanceKm / averageSpeedKmh) * 60);
  }

  /**
   * Reverse geocode a location to get a human-readable address using Google Maps
   * @param location The location to reverse geocode
   * @returns Address string or null if geocoding fails
   */
  async reverseGeocode(location: Location): Promise<string | null> {
    try {
      if (!this.googleMapsApiKey) {
        return null;
      }
      
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${location.latitude},${location.longitude}`,
          key: this.googleMapsApiKey,
          language: 'en',
          result_type: 'street_address|route|neighborhood'
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding with Google Maps:', error);
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
