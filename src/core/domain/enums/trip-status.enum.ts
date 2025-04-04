export enum TripStatus {
  Scheduled = 'SCHEDULED', // Trip is scheduled but not yet started
  InProgress = 'IN_PROGRESS', // Trip is currently in progress
  Completed = 'COMPLETED', // Trip has been completed
  Cancelled = 'CANCELLED', // Trip has been cancelled
  Delayed = 'DELAYED', // Trip is delayed
  NoShow = 'NO_SHOW', // Passenger did not show up for the trip
  Other = 'OTHER', // Any other status not covered above
}
