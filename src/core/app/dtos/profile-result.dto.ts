import { IUserResult } from '@core/app/dtos/user-result.dto';
import { Role } from '@core/domain/enums/role.enum';
import { IUser, User } from '@core/domain/models/user.model';
import { UserId } from '@core/domain/valueObjects';

// Public representation excluding sensitive data
export interface IProfileResult
  extends Omit<
    User,
    'password' | 'passwordResetToken' | 'passwordResetExpires'
  > {}

export class ProfileResult {
  id: UserId;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: IUserResult) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.phoneNumber = user.phoneNumber;
    this.profileImage = user.profileImage;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
