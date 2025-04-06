import { BusStopId, RouteId } from '@core/domain/valueObjects';

export interface IRoute {
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

export class Route {
  id: RouteId;
  name: string;
  description?: string;
  stopIds: BusStopId[];
  totalDistance?: number;
  estimatedDuration?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(route: IRoute) {
    this.id = route.id;
    this.name = route.name;
    this.description = route.description;
    this.stopIds = route.stopIds;
    this.totalDistance = route.totalDistance;
    this.estimatedDuration = route.estimatedDuration;
    this.isActive = route.isActive;
    this.createdAt = route.createdAt;
    this.updatedAt = route.updatedAt;
  }
}
