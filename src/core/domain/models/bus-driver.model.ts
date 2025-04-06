import { BusDriverId, BusId, UserId } from '@core/domain/valueObjects';

export interface IBusDriver {
  id: BusDriverId;
  userId: UserId; // Reference to User ID
  assignedBusId?: BusId; // Reference to Bus ID
  // routeHistory?: RouteId[]; // Route history might be complex, potentially separate model
}

export class BusDriver {
  id: BusDriverId;
  userId: UserId;
  assignedBusId?: BusId;

  constructor(busDriver: IBusDriver) {
    this.id = busDriver.id;
    this.userId = busDriver.userId;
    this.assignedBusId = busDriver.assignedBusId;
  }
}
