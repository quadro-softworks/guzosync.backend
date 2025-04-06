import { Role } from '@core/domain/enums/role.enum';
import { User } from '@core/domain/models/user.model';
import { UserId } from '@core/domain/valueObjects';

export interface IUserResult
  extends Omit<
    User,
    'password' | 'passwordResetToken' | 'passwordResetExpires'
  > {}

export class UserResult implements IUserResult {
  id: UserId;
  firstName: string;
  lastName: string;
  isActive: boolean;
  email: string;
  phoneNumber: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserResult) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isActive = user.isActive;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
