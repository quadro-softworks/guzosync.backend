import { BusId, RouteId, ScheduleId, UserId } from '@core/domain/valueObjects';

export interface ISchedule {
  id: ScheduleId;
  routeId: RouteId; // The route this schedule applies to
  // Defines the pattern, e.g., 'WEEKDAYS', 'WEEKENDS', 'MON', 'TUE', specific dates?
  schedulePattern: string;
  departureTimes: string[]; // Array of departure times from the *first* stop (e.g., "08:00", "08:30")
  // Or maybe define stop timings relative to departure?
  // stopTimings: { stopId: BusStopId, offsetMinutes: number }[];
  assignedBusId?: BusId; // Sometimes a specific bus is assigned long-term
  assignedDriverId?: UserId; // Sometimes a specific driver
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Schedule {
  id: ScheduleId;
  routeId: RouteId;
  schedulePattern: string;
  departureTimes: string[];
  assignedBusId?: BusId;
  assignedDriverId?: UserId;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(schedule: ISchedule) {
    this.id = schedule.id;
    this.routeId = schedule.routeId;
    this.schedulePattern = schedule.schedulePattern;
    this.departureTimes = schedule.departureTimes;
    this.assignedBusId = schedule.assignedBusId;
    this.assignedDriverId = schedule.assignedDriverId;
    this.validFrom = schedule.validFrom;
    this.validUntil = schedule.validUntil;
    this.isActive = schedule.isActive;
    this.createdAt = schedule.createdAt;
    this.updatedAt = schedule.updatedAt;
  }
}
