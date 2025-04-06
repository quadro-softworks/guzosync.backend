import { IncidentSeverity } from '@core/domain/enums/incident-severity.enum';
import { Incident } from '@core/domain/models/incident.model';
import { BusId, IncidentId, RouteId, UserId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

export interface IIncidentResult extends Incident {}

export class IncidentResult implements IIncidentResult {
  id: IncidentId;
  reportedByUserId: UserId;
  description: string;
  location?: Location;
  relatedBusId?: BusId;
  relatedRouteId?: RouteId;
  isResolved: boolean;
  resolutionNotes?: string;
  severity: IncidentSeverity;
  createdAt: Date;
  updatedAt: Date;

  constructor(incident: IncidentResult) {
    this.id = incident.id;
    this.reportedByUserId = incident.reportedByUserId;
    this.description = incident.description;
    this.location = incident.location;
    this.relatedBusId = incident.relatedBusId;
    this.relatedRouteId = incident.relatedRouteId;
    this.isResolved = incident.isResolved;
    this.resolutionNotes = incident.resolutionNotes;
    this.severity = incident.severity;
    this.createdAt = incident.createdAt;
    this.updatedAt = incident.updatedAt;
  }
}
