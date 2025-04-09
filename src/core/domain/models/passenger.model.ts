import { PassengerId, UserId } from '@core/domain/valueObjects';

export interface IPassenger {
  id: PassengerId; // Unique identifier for the passenger
  userId: UserId;
  preferredLanguage?: string; // Optional field for Passengers
  // personalizedAlerts?: string[]; // Consider managing alerts via NotificationSettings or separate AlertSubscription model
}

export class Passenger {
  id: PassengerId;
  userId: UserId;
  preferredLanguage?: string;
  // personalizedAlerts?: string[];

  constructor(passenger: IPassenger) {
    this.id = passenger.id;
    this.userId = passenger.userId;
    this.preferredLanguage = passenger.preferredLanguage;
    // this.personalizedAlerts = passenger.personalizedAlerts;
  }
}
