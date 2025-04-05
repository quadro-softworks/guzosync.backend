import { BusDriverId, BusId, UserId } from '@core/domain/valueObjects';

export interface BusDriver {
  busDriverId: BusDriverId;
  userId: UserId;
  // --- BusDriver Specific Fields ---
  assignedBusId?: BusId; // Reference to Bus ID
  // routeHistory?: RouteId[]; // Route history might be complex, potentially separate model
}
