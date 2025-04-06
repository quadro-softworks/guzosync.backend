import { User } from '@core/domain/models/user.model';

// Public representation excluding sensitive data
export type ProfileResult = Omit<
  User,
  'password' | 'passwordResetToken' | 'passwordResetExpires'
>;
