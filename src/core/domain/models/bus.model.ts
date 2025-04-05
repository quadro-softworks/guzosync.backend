import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';
import { BusId, RouteId, UserId } from '@core/domain/valueObjects';

export interface Bus {
  id: BusId;
  licensePlate: string; // Should be unique
  busType: BusType;
  capacity: number;
  currentLocation?: Location; // Embedded Location (updated frequently)
  assignedRouteId?: RouteId; // Reference to the current Route ID
  assignedDriverId?: UserId; // Reference to the current Driver User ID
  busStatus: BusStatus;
  manufactureYear?: number;
  model?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DefaultBusCapacity = 120;
