import { QueueRegulator } from '@core/domain/models/queue-regulator.model';
import { BusStopId, QueueRegulatorId, UserId } from '@core/domain/valueObjects';

export interface IQueueRegulatorResult extends QueueRegulator {}

export class QueueRegulatorResult implements IQueueRegulatorResult {
  id: QueueRegulatorId;
  userId: UserId;
  assignedStopId?: BusStopId;
  // incidentReports?: IncidentId[];

  constructor(queueRegulator: QueueRegulatorResult) {
    this.id = queueRegulator.id;
    this.userId = queueRegulator.userId;
    this.assignedStopId = queueRegulator.assignedStopId;
    // this.incidentReports = queueRegulator.incidentReports;
  }
}
