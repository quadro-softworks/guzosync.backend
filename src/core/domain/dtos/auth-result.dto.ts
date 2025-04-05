import { User } from '@core/domain/models/user.model';

// Public representation excluding sensitive data
export type AuthResult = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'role'
>;
