import { Role } from '@core/domain/enums/role.enum';
import { BusId, BusStopId, UserId } from '@core/domain/valueObjects';

// Define referenced IDs as strings (representing ObjectIds)

// Base User Interface incorporating all roles (Single Collection strategy)
export interface User {
  id: UserId; // Corresponds to MongoDB _id
  firstName: string;
  lastName: string;
  email: string; // Unique identifier
  password: string; // Hashed password (optional if fetched without select)
  role: Role; // Discriminator field
  phoneNumber?: string; // Optional
  profileImage?: string; // URL or path to image
  createdAt: Date;
  updatedAt: Date;

  // --- Fields for Password Reset (often excluded from general fetches) ---
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
