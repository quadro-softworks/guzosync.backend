import { AlertSeverity } from '@core/domain/enums/alert-severity.enum';
import { Alert } from '@core/domain/models/alert.model';
import { AlertId, RouteId, UserId } from '@core/domain/valueObjects';

export interface IAlertResult extends Alert {}

export class AlertResult implements IAlertResult {
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

  constructor(alert: AlertResult) {
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
