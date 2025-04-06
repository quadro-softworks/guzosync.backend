import { BusDriver } from '@core/domain/models/bus-driver.model';
import { QueueRegulator } from '../../domain/models/queue-regulator.model';
import { User } from '@core/domain/models/user.model';
import { UserResultType } from '@core/app/dtos/user-result';

export type QueueRegulatorResultType = UserResultType & QueueRegulator;
