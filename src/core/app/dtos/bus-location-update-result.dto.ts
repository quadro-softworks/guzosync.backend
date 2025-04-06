import { BusStatus } from '@core/domain/enums/bus-status.enum';

// Define the structure of the update payload
export interface IBusLocationUpdateResult {
  busId: string;
  location: Location | null; // Location might be null if bus inactive
  routeId: string | null;
  status: BusStatus;
  etas: { stopId: string; etaMinutes: number | null }[]; // Calculated ETAs for relevant stops
}

export class BusLocationUpdateResult implements IBusLocationUpdateResult {
  busId: string;
  location: Location | null;
  routeId: string | null;
  status: BusStatus;
  etas: { stopId: string; etaMinutes: number | null }[];

  constructor(
    busId: string,
    location: Location | null,
    routeId: string | null,
    status: BusStatus,
    etas: { stopId: string; etaMinutes: number | null }[] = [],
  ) {
    this.busId = busId;
    this.location = location;
    this.routeId = routeId;
    this.status = status;
    this.etas = etas;
  }
}
