import { Role } from '@core/domain/enums/role.enum';
import { BusId, BusStopId, UserId } from '@core/domain/valueObjects';

export interface IUser {
  id: UserId; // Corresponds to MongoDB _id
  firstName: string;
  lastName: string;
  email: string; // Unique identifier
  password: string; // Hashed password (optional if fetched without select)
  role: Role; // Discriminator field
  phoneNumber: string;
  profileImage?: string; // URL or path to image
  createdAt: Date;
  updatedAt: Date;

  // --- Fields for Password Reset (often excluded from general fetches) ---
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
}
// Base User Interface incorporating all roles (Single Collection strategy)

export class User {
  id: UserId; // Corresponds to MongoDB _id

  firstName: string;

  lastName: string;

  email: string; // Unique identifier

  password: string; // Hashed password (optional if fetched without select)

  role: Role; // Discriminator field

  phoneNumber: string;

  profileImage?: string; // URL or path to image

  createdAt: Date;

  updatedAt: Date;

  // --- Fields for Password Reset (often excluded from general fetches) ---

  passwordResetToken?: string;

  passwordResetExpires?: Date;

  isActive: boolean;

  constructor(user: IUser) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.phoneNumber = user.phoneNumber;
    this.profileImage = user.profileImage;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.passwordResetToken = user.passwordResetToken;
    this.passwordResetExpires = user.passwordResetExpires;
    this.isActive = user.isActive;
  }
}
