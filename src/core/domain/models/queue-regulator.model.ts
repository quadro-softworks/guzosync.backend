import { BusStopId, QueueRegulatorId, UserId } from '@core/domain/valueObjects';

export interface IQueueRegulator {
  id: QueueRegulatorId; // Unique identifier for the QueueRegulator
  userId: UserId; // Reference to the User Table
  // --- QueueRegulator Specific Fields ---
  assignedStopId?: BusStopId; // Reference to BusStop ID
  // incidentReports?: IncidentId[]; // Incidents usually link *to* the user via reportedBy
}

export class QueueRegulator {
  id: QueueRegulatorId;
  userId: UserId;
  assignedStopId?: BusStopId;
  // incidentReports?: IncidentId[];

  constructor(queueRegulator: IQueueRegulator) {
    this.id = queueRegulator.id;
    this.userId = queueRegulator.userId;
    this.assignedStopId = queueRegulator.assignedStopId;
    // this.incidentReports = queueRegulator.incidentReports;
  }
}
