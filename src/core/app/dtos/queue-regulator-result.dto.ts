import { IUserResult, UserResult } from '@core/app/dtos/user-result.dto';
import { QueueRegulator } from '@core/domain/models/queue-regulator.model';
import { BusStopId, QueueRegulatorId, UserId } from '@core/domain/valueObjects';

export interface IQueueRegulatorResult extends Omit<QueueRegulator, 'userId'> {}

export class QueueRegulatorResult
  extends UserResult
  implements IQueueRegulatorResult
{
  queueRegulatorId: QueueRegulatorId;
  assignedStopId?: BusStopId;
  // incidentReports?: IncidentId[];
  /**
   *
   */
  constructor(user: IUserResult, queueRegulator: IQueueRegulatorResult) {
    super(user);
    this.queueRegulatorId = queueRegulator.id;
    this.assignedStopId = queueRegulator.assignedStopId;
  }
}
