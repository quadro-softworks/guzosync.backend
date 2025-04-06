import { IncidentSeverity } from '@core/domain/enums/incident-severity.enum';
import { BusId, IncidentId, RouteId, UserId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

export interface IIncident {
  id: IncidentId;
  reportedByUserId: UserId; // Reference to the reporting User (Driver/Regulator)
  description: string;
  location?: Location; // Optional location of incident
  relatedBusId?: BusId; // Optional reference
  relatedRouteId?: RouteId; // Optional reference
  isResolved: boolean;
  resolutionNotes?: string;
  severity: IncidentSeverity;
  createdAt: Date;
  updatedAt: Date;
}

export class Incident {
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

  constructor(incident: IIncident) {
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
