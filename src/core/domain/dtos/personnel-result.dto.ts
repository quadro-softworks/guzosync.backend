import { User } from '@core/domain/models/user.model';

export type PersonnelResult = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'role'
>;
