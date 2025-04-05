import { BusStopId, QueueRegulatorId, UserId } from '@core/domain/valueObjects';

export interface QueueRegulator {
  queueRegulatorId: QueueRegulatorId; // Unique identifier for the QueueRegulator
  userId: UserId; // Reference to the User Table
  // --- QueueRegulator Specific Fields ---
  assignedStopId?: BusStopId; // Reference to BusStop ID
  // incidentReports?: IncidentId[]; // Incidents usually link *to* the user via reportedBy
}
