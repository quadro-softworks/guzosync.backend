import { BusStopId, RouteId } from '@core/domain/valueObjects';

export interface Route {
  id: RouteId;
  name: string; // e.g., "Route 45 - Downtown Express"
  description?: string;
  stopIds: BusStopId[]; // Ordered list of BusStop IDs
  totalDistance?: number; // In meters or kilometers
  estimatedDuration?: number; // In minutes (typical duration)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
