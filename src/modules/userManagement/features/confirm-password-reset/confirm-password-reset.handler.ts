import { injectable, inject } from 'tsyringe';
import crypto from 'crypto';

import { ConfirmPasswordResetCommand } from './confirm-password-reset.command';
import {
  IHashingService,
  IHashingServiceMeta,
} from '@core/services/hashing.service';
import { BadRequestError } from '@core/errors/bad-request.error';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';

@injectable()
export class ConfirmPasswordResetHandler {
  constructor(
    @inject(IHashingServiceMeta.name) private hashingService: IHashingService,
  ) {}

  async execute(command: ConfirmPasswordResetCommand): Promise<void> {
    // 1. Hash the incoming token to match the stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(command.token)
      .digest('hex');

    // 2. Find user by token and check expiry
    // Must explicitly select fields that have `select: false` in schema
    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }, // Check if expiry date is in the future
    }).select('+passwordResetToken +passwordResetExpires'); // Select needed fields

    if (!user) {
      throw new BadRequestError(
        'Password reset token is invalid or has expired.',
      );
    }

    // 3. Hash the new password
    const hashedNewPassword = await this.hashingService.hash(
      command.newPassword,
    );

    // 4. Update user: set new password, clear reset fields
    user.password = hashedNewPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // Use save() to trigger any Mongoose middleware if present

    // Alternative using updateOne:
    // await UserModel.updateOne(
    //     { _id: user._id },
    //     {
    //         $set: { password: hashedNewPassword },
    //         $unset: { passwordResetToken: "", passwordResetExpires: "" }
    //     }
    // );

    // Return void, controller sends success
  }
}
