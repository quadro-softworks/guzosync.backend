import { BusStopId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

export interface BusStop {
  id: BusStopId;
  name: string; // e.g., "Central Station", "Market Square"
  location: Location; // Embedded Location
  capacity?: number; // Max number of buses that can wait (relevant for regulators?)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
