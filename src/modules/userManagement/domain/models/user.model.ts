export interface User {
  id: string;
  email: string;
  password: string; // This will be the HASHED password
  name?: string;
  roles?: string[]; // Example: ['admin', 'driver', 'passenger']
  createdAt: Date;
  updatedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date; // Optional: For password reset functionality
}

// Often useful to have a type for user data excluding sensitive fields
export type PublicUser = Omit<User, 'password'>;
