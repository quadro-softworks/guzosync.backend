import { TripStatus } from '@core/domain/enums/trip-status.enum';
import { Trip } from '@core/domain/models/trip.model';
import {
  BusId,
  FeedbackId,
  RouteId,
  TripId,
  UserId,
} from '@core/domain/valueObjects';

export interface ITripResult extends Trip {}

export class TripResult implements ITripResult {
  id: TripId;
  busId: BusId;
  routeId: RouteId;
  driverId?: UserId;
  scheduleId?: string;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  estimatedArrivalTime?: Date;
  status: TripStatus;
  passengerIds?: UserId[];
  feedbackIds?: FeedbackId[];
  // waypoints?: LocationVO[];
  createdAt: Date;
  updatedAt: Date;

  constructor(trip: TripResult) {
    this.id = trip.id;
    this.busId = trip.busId;
    this.routeId = trip.routeId;
    this.driverId = trip.driverId;
    this.scheduleId = trip.scheduleId;
    this.actualDepartureTime = trip.actualDepartureTime;
    this.actualArrivalTime = trip.actualArrivalTime;
    this.estimatedArrivalTime = trip.estimatedArrivalTime;
    this.status = trip.status;
    this.passengerIds = trip.passengerIds;
    this.feedbackIds = trip.feedbackIds;
    // this.waypoints = trip.waypoints;
    this.createdAt = trip.createdAt;
    this.updatedAt = trip.updatedAt;
  }
}
