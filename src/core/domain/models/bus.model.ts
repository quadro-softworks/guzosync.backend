import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';
import { BusId, RouteId, UserId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

export interface IBus {
  id: BusId;
  licensePlate: string; // Should be unique
  busType: BusType;
  capacity: number;
  currentLocation?: Location; // Embedded Location (updated frequently)
  lastLocationUpdate?: Date; // When the location was last updated
  heading?: number; // Direction in degrees (0-360)
  speed?: number; // Speed in km/h
  locationAccuracy?: number; // Accuracy in meters
  currentAddress?: string; // Reverse geocoded address
  assignedRouteId?: RouteId; // Reference to the current Route ID
  assignedDriverId?: UserId; // Reference to the current Driver User ID
  busStatus: BusStatus;
  manufactureYear?: number;
  busModel?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Bus {
  id: BusId;
  licensePlate: string;
  busType: BusType;
  capacity: number;
  currentLocation?: Location;
  assignedRouteId?: RouteId;
  assignedDriverId?: UserId;
  busStatus: BusStatus;
  manufactureYear?: number;
  busModel?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(bus: IBus) {
    this.id = bus.id;
    this.licensePlate = bus.licensePlate;
    this.busType = bus.busType;
    this.capacity = bus.capacity;
    this.currentLocation = bus.currentLocation;
    this.assignedRouteId = bus.assignedRouteId;
    this.assignedDriverId = bus.assignedDriverId;
    this.busStatus = bus.busStatus;
    this.manufactureYear = bus.manufactureYear;
    this.busModel = bus.busModel;
    this.createdAt = bus.createdAt;
    this.updatedAt = bus.updatedAt;
  }

  static readonly DefaultCapacity = 120;
}
