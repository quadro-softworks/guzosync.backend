import { injectable } from 'tsyringe';
import { NotFoundError } from '@core/errors/not-found.error';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { ProfileResult } from '@core/app/dtos/profile-result.dto';
import mongoose, { Schema } from 'mongoose';
import { UserResult } from '@core/app/dtos/user-result.dto';
import { Ok, Result } from 'neverthrow';
import { ApiError } from '@core/errors/api-error';

@injectable()
export class GetMyProfileHandler {
  // No external dependencies needed here usually
  constructor() {}

  async execute(userId: string): Promise<Result<ProfileResult, ApiError>> {
    const user = await UserModel.findById(userId); // findById automatically excludes fields with select:false

    if (!user) {
      // Should generally not happen if token was valid, but handle defensively
      throw new NotFoundError('User profile not found.');
    }

    console.log('Fetched ', user);
    // Use schema's toJSON transformation to remove password etc.
    return new Ok(
      new ProfileResult({
        ...new UserResult({
          ...user.toObject(),
        }),
      }),
    );
  }
}
