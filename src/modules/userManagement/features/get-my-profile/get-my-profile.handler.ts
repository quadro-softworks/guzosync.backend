import { injectable } from 'tsyringe';
import { NotFoundError } from '@core/errors/not-found.error';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { ProfileResult } from '@core/domain/dtos/profile-result.dto';

@injectable()
export class GetMyProfileHandler {
  // No external dependencies needed here usually
  constructor() {}

  async execute(userId: string): Promise<ProfileResult> {
    const user = await UserModel.findById(userId); // findById automatically excludes fields with select:false

    if (!user) {
      // Should generally not happen if token was valid, but handle defensively
      throw new NotFoundError('User profile not found.');
    }

    // Use schema's toJSON transformation to remove password etc.
    return user.toJSON() as ProfileResult;
  }
}
