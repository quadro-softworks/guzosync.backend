import { TripStatus } from '@core/domain/enums/trip-status.enum';
import {
  TripId,
  BusId,
  RouteId,
  FeedbackId,
  UserId,
} from '@core/domain/valueObjects';

export interface Trip {
  id: TripId;
  busId: BusId;
  routeId: RouteId;
  driverId?: UserId; // Driver assigned for this specific trip
  scheduleId?: string; // Optional link to the base Schedule
  actualDepartureTime?: Date; // When the trip actually started
  actualArrivalTime?: Date; // When the trip actually ended
  estimatedArrivalTime?: Date; // Dynamically updated ETA for the final stop
  status: TripStatus;
  passengerIds?: UserId[]; // List of passengers (might be large, consider alternatives if needed)
  feedbackIds?: FeedbackId[]; // Feedback related to this specific trip
  // Could store waypoints for historical tracking if needed
  // waypoints?: LocationVO[];
  createdAt: Date;
  updatedAt: Date;
}
