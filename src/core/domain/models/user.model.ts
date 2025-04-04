import { Role } from '@core/domain/enums/role.enum';
import { BusId, BusStopId, UserId } from '@core/domain/valueObjects';

// Define referenced IDs as strings (representing ObjectIds)

// Base User Interface incorporating all roles (Single Collection strategy)
export interface User {
  id: UserId; // Corresponds to MongoDB _id
  name?: string; // Optional based on registration/update
  email: string; // Unique identifier
  password?: string; // Hashed password (optional if fetched without select)
  role: Role; // Discriminator field
  phoneNumber?: string; // Optional
  profileImage?: string; // URL or path to image
  roles?: Role[]; // Array if user can have multiple roles (overrides single role)
  createdAt: Date;
  updatedAt: Date;

  // --- Passenger Specific Fields ---
  preferredLanguage?: string; // Optional field for Passengers
  // personalizedAlerts?: string[]; // Consider managing alerts via NotificationSettings or separate AlertSubscription model

  // --- QueueRegulator Specific Fields ---
  assignedStopId?: BusStopId; // Reference to BusStop ID
  // incidentReports?: IncidentId[]; // Incidents usually link *to* the user via reportedBy

  // --- BusDriver Specific Fields ---
  assignedBusId?: BusId; // Reference to Bus ID
  // routeHistory?: RouteId[]; // Route history might be complex, potentially separate model

  // --- ControlCenter / Admin Specific Fields ---
  // Fields like dashboard, registeredDrivers etc. are usually not stored directly on the user.
  // Access control is managed via the 'ControlCenter' or 'Admin' role.

  // --- Fields for Password Reset (often excluded from general fetches) ---
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

// Public representation excluding sensitive data
export type PublicUser = Omit<
  User,
  'password' | 'passwordResetToken' | 'passwordResetExpires'
>;
