import { Schedule } from '@core/domain/models/schedule.model';
import { BusId, RouteId, ScheduleId, UserId } from '@core/domain/valueObjects';

export interface IScheduleResult extends Schedule {}

export class ScheduleResult implements IScheduleResult {
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

  constructor(schedule: ScheduleResult) {
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
