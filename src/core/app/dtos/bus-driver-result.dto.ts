import { IUserResult, UserResult } from '@core/app/dtos/user-result.dto';
import { BusDriver } from '@core/domain/models/bus-driver.model';
import { BusDriverId, BusId, UserId } from '@core/domain/valueObjects';

export interface IBusDriverResult extends Omit<BusDriver, 'userId'> {}

export class BusDriverResult extends UserResult implements IBusDriverResult {
  busDriverId: BusDriverId;
  assignedBusId?: BusId;
  /**
   *
   */
  constructor(user: IUserResult, busDriver: IBusDriverResult) {
    super(user);
    this.busDriverId = busDriver.id;
    this.assignedBusId = busDriver.assignedBusId;
  }
}
