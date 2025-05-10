import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { Location } from '@core/domain/valueObjects/location.vo';

// Define the structure of the update payload
export interface IBusLocationUpdateResult {
  busId: string;
  location: Location | null; // Location might be null if bus inactive
  routeId: string | null;
  status: BusStatus;
  etas: { stopId: string; etaMinutes: number | null }[]; // Calculated ETAs for relevant stops
  heading?: number;
  speed?: number;
  accuracy?: number;
  address?: string;
  lastUpdate?: Date;
}

export class BusLocationUpdateResult implements IBusLocationUpdateResult {
  busId: string;
  location: Location | null;
  routeId: string | null;
  status: BusStatus;
  etas: { stopId: string; etaMinutes: number | null }[];
  heading?: number;
  speed?: number;
  accuracy?: number;
  address?: string;
  lastUpdate?: Date;

  constructor(
    busId: string,
    location: Location | null,
    routeId: string | null,
    status: BusStatus,
    etas: { stopId: string; etaMinutes: number | null }[] = [],
    heading?: number,
    speed?: number,
    accuracy?: number,
    address?: string,
    lastUpdate?: Date,
  ) {
    this.busId = busId;
    this.location = location;
    this.routeId = routeId;
    this.status = status;
    this.etas = etas;
    this.heading = heading;
    this.speed = speed;
    this.accuracy = accuracy;
    this.address = address;
    this.lastUpdate = lastUpdate;
  }
}
