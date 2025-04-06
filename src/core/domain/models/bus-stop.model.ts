import { BusStopId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

export interface IBusStop {
  id: BusStopId;
  name: string; // e.g., "Central Station", "Market Square"
  location: Location; // Embedded Location
  capacity?: number; // Max number of buses that can wait (relevant for regulators?)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class BusStop {
  id: BusStopId;
  name: string;
  location: Location;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(busStop: IBusStop) {
    this.id = busStop.id;
    this.name = busStop.name;
    this.location = busStop.location;
    this.capacity = busStop.capacity;
    this.isActive = busStop.isActive;
    this.createdAt = busStop.createdAt;
    this.updatedAt = busStop.updatedAt;
  }
}
