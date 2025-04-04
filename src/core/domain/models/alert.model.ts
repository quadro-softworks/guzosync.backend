import { AlertSeverity } from '@core/domain/enums/alert-severity.enum';
import { AlertId, RouteId, UserId } from '@core/domain/valueObjects';

export interface Alert {
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
