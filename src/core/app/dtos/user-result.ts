import { Role } from '@core/domain/enums/role.enum';
import { User } from '@core/domain/models/user.model';
import { Schema } from 'mongoose';

export type UserResultType = Omit<
  User,
  'password' | 'passwordResetToken' | 'passwordResetExpires'
>;

// export class UserResult implements UserResultType {
//   id: Schema.Types.ObjectId;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: Role;
//   phoneNumber: string;
//   profileImage?: string | undefined;
//   createdAt: Date;
//   updatedAt: Date;
//   isActive: boolean;

//   constructor(user: UserResultType) {
//     this.id = user.id;
//     this.firstName = user.firstName;
//     this.lastName = user.lastName;
//     this.email = user.email;
//     this.role = user.role;
//     this.phoneNumber = user.phoneNumber;
//     this.profileImage = user.profileImage;
//     this.createdAt = user.createdAt;
//     this.updatedAt = user.updatedAt;
//     this.isActive = user.isActive;
//   }
// }
