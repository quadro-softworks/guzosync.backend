export interface IPassenger {
  id: string; // Unique identifier for the passenger
  // --- Passenger Specific Fields ---
  preferredLanguage?: string; // Optional field for Passengers
  // personalizedAlerts?: string[]; // Consider managing alerts via NotificationSettings or separate AlertSubscription model
}

export class Passenger {
  id: string;
  preferredLanguage?: string;
  // personalizedAlerts?: string[];

  constructor(passenger: IPassenger) {
    this.id = passenger.id;
    this.preferredLanguage = passenger.preferredLanguage;
    // this.personalizedAlerts = passenger.personalizedAlerts;
  }
}
