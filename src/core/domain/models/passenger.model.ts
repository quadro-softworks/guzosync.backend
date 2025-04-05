export interface Passenger {
  id: string; // Unique identifier for the passenger
  // --- Passenger Specific Fields ---
  preferredLanguage?: string; // Optional field for Passengers
  // personalizedAlerts?: string[]; // Consider managing alerts via NotificationSettings or separate AlertSubscription model
}
