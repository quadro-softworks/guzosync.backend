import { Passenger } from '@core/domain/models/passenger.model';
import { PassengerId, UserId } from '@core/domain/valueObjects';

export interface IPassengerResult extends Passenger {}

export class PassengerResult implements IPassengerResult {
  id: PassengerId;
  preferredLanguage?: string;
  userId: UserId;
  // personalizedAlerts?: string[];

  constructor(passenger: PassengerResult) {
    this.id = passenger.id;
    this.preferredLanguage = passenger.preferredLanguage;
    this.userId = passenger.userId;
  }
}
