import { Passenger } from '@core/domain/models/passenger.model';

export interface IPassengerResult extends Passenger {}

export class PassengerResult implements IPassengerResult {
  id: string;
  preferredLanguage?: string;
  // personalizedAlerts?: string[];

  constructor(passenger: PassengerResult) {
    this.id = passenger.id;
    this.preferredLanguage = passenger.preferredLanguage;
    // this.personalizedAlerts = passenger.personalizedAlerts;
  }
}
