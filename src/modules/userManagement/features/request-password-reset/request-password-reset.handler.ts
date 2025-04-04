import { injectable, inject } from 'tsyringe';
import crypto from 'crypto'; // Use built-in crypto
import { RequestPasswordResetCommand } from './request-password-reset.command';
import { IEmailService, IEmailServiceMeta } from '@core/services/email.service';
import { NotFoundError } from '@core/errors/not-found.error'; // Or maybe just return success silently
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';

@injectable()
export class RequestPasswordResetHandler {
  // Use crypto for token hashing here, bcrypt is overkill for reset tokens
  private readonly RESET_TOKEN_BYTES = 20;
  private readonly RESET_TOKEN_EXPIRY_MINUTES = 10;

  constructor(
    @inject(IEmailServiceMeta.name) private emailService: IEmailService,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<void> {
    const user = await UserModel.findOne({ email: command.email });

    // !! Important Security Note:
    // !! Even if user not found, DO NOT throw an error.
    // !! This prevents attackers from figuring out which emails are registered.
    // !! Silently succeed, but only proceed if user exists.
    if (user) {
      // 1. Generate plain token
      const plainToken = crypto
        .randomBytes(this.RESET_TOKEN_BYTES)
        .toString('hex');

      // 2. Hash token for storage (SHA256 is fine here)
      const hashedToken = crypto
        .createHash('sha256')
        .update(plainToken)
        .digest('hex');

      // 3. Set expiry
      const expires = new Date(
        Date.now() + this.RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000,
      );

      // 4. Update user document (including selecting the fields to update them)
      // We don't need the full user doc back usually
      await UserModel.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetToken: hashedToken,
            passwordResetExpires: expires,
          },
        },
      );

      // 5. Send email (catch errors within email service or handle here)
      try {
        await this.emailService.sendPasswordResetEmail(user.email, plainToken);
      } catch (emailError) {
        console.error(
          `Failed sending password reset to ${user.email}:`,
          emailError,
        );
        // Decide if this should cause the request to fail entirely
        // Often, we still return success to the user, but log the internal error
      }
    } else {
      // Log potential enumeration attempt if desired, but don't reveal info
      console.log(
        `Password reset requested for non-existent email: ${command.email}`,
      );
    }
    // Return void (controller sends generic success message)
  }
}
