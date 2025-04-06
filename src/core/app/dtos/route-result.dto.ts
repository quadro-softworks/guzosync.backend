import { Route } from '@core/domain/models/route.model';
import { BusStopId, RouteId } from '@core/domain/valueObjects';

export interface IRouteResult extends Route {}

export class RouteResult implements IRouteResult {
  id: RouteId;
  name: string;
  description?: string;
  stopIds: BusStopId[];
  totalDistance?: number;
  estimatedDuration?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(route: RouteResult) {
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
