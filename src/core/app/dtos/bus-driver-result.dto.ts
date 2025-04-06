import { BusDriver } from '@core/domain/models/bus-driver.model';
import { BusDriverId, BusId, UserId } from '@core/domain/valueObjects';

export interface IBusDriverResult extends BusDriver {}

export class BusDriverResult implements IBusDriverResult {
  id: BusDriverId;
  userId: UserId;
  assignedBusId?: BusId;

  constructor(busDriver: BusDriverResult) {
    this.id = busDriver.id;
    this.userId = busDriver.userId;
    this.assignedBusId = busDriver.assignedBusId;
  }
}
