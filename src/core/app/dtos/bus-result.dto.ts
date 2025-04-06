import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';
import { Bus } from '@core/domain/models/bus.model';
import { BusId, RouteId, UserId } from '@core/domain/valueObjects';

export interface IBusResult extends Bus {}

export class BusResult implements IBusResult {
  id: BusId;
  licensePlate: string;
  busType: BusType;
  capacity: number;
  currentLocation?: Location;
  assignedRouteId?: RouteId;
  assignedDriverId?: UserId;
  busStatus: BusStatus;
  manufactureYear?: number;
  model?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(bus: BusResult) {
    this.id = bus.id;
    this.licensePlate = bus.licensePlate;
    this.busType = bus.busType;
    this.capacity = bus.capacity;
    this.currentLocation = bus.currentLocation;
    this.assignedRouteId = bus.assignedRouteId;
    this.assignedDriverId = bus.assignedDriverId;
    this.busStatus = bus.busStatus;
    this.manufactureYear = bus.manufactureYear;
    this.model = bus.model;
    this.createdAt = bus.createdAt;
    this.updatedAt = bus.updatedAt;
  }
}
