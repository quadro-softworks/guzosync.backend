import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { BusType } from '@core/domain/enums/bus-type.enum';

export interface BusResult {
  _id: string;
  licensePlate: string; // Should be unique
  busType: BusType;
  capacity: number;
  currentLocation?: Location; // Embedded Location (updated frequently)
  assignedRouteId?: string; // Reference to the current Route ID
  assignedDriverId?: string; // Reference to the current Driver User ID
  busStatus: BusStatus;
  manufactureYear?: number;
  model?: string;
  createdAt: Date;
  updatedAt: Date;
}
