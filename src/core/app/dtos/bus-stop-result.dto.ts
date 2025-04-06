import { BusStop } from '@core/domain/models/bus-stop.model';
import { BusStopId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

export interface IBusStopResult extends BusStop {}

export class BusStopResult implements IBusStopResult {
  id: BusStopId;
  name: string;
  location: Location;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(busStop: BusStopResult) {
    this.id = busStop.id;
    this.name = busStop.name;
    this.location = busStop.location;
    this.capacity = busStop.capacity;
    this.isActive = busStop.isActive;
    this.createdAt = busStop.createdAt;
    this.updatedAt = busStop.updatedAt;
  }
}
