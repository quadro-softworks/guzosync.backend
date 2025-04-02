export interface User {
  id: string;
  email: string;
  password: string; // This will be the HASHED password
  name?: string;
  roles?: string[]; // Example: ['admin', 'driver', 'passenger']
  createdAt: Date;
  updatedAt: Date;
}

// Often useful to have a type for user data excluding sensitive fields
export type PublicUser = Omit<User, "password">;
