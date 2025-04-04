import { BusId, IncidentId, RouteId, UserId } from '@core/domain/valueObjects';
import { Location } from '@core/domain/valueObjects/location.vo';

// Incident model (potentially its own module or shared)
export interface Incident {
  id: IncidentId;
  reportedByUserId: UserId; // Reference to the reporting User (Driver/Regulator)
  description: string;
  location?: Location; // Optional location of incident
  relatedBusId?: BusId; // Optional reference
  relatedRouteId?: RouteId; // Optional reference
  isResolved: boolean;
  resolutionNotes?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH'; // Example severity levels
  createdAt: Date;
  updatedAt: Date;
}
