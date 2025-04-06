import { AlertSeverity } from '@core/domain/enums/alert-severity.enum';
import { AlertId, RouteId, UserId } from '@core/domain/valueObjects';

export interface IAlert {
  id: AlertId;
  title: string;
  severity: AlertSeverity; // Example severity levels
  description: string;
  affectedRouteIds?: RouteId[]; // Routes affected by this alert
  affectedBusStopIds?: string[]; // Stops affected
  activeFrom: Date;
  activeUntil?: Date; // Optional expiry
  createdByUserId?: UserId; // Who issued the alert
  createdAt: Date;
  updatedAt: Date;
}

export class Alert {
  id: AlertId;
  title: string;
  severity: AlertSeverity;
  description: string;
  affectedRouteIds?: RouteId[];
  affectedBusStopIds?: string[];
  activeFrom: Date;
  activeUntil?: Date;
  createdByUserId?: UserId;
  createdAt: Date;
  updatedAt: Date;

  constructor(alert: IAlert) {
    this.id = alert.id;
    this.title = alert.title;
    this.severity = alert.severity;
    this.description = alert.description;
    this.affectedRouteIds = alert.affectedRouteIds;
    this.affectedBusStopIds = alert.affectedBusStopIds;
    this.activeFrom = alert.activeFrom;
    this.activeUntil = alert.activeUntil;
    this.createdByUserId = alert.createdByUserId;
    this.createdAt = alert.createdAt;
    this.updatedAt = alert.updatedAt;
  }
}
