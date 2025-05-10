import { injectable, inject } from 'tsyringe';
import { UpdateMyProfileCommand } from './update-my-profile.command';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { NotFoundError } from '@core/errors/not-found.error';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { ProfileResult } from '@core/app/dtos/profile-result.dto';
import { plainToClass } from 'class-transformer';

@injectable()
export class UpdateMyProfileHandler {
  constructor(
    @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: UpdateMyProfileCommand, userId: string): Promise<ProfileResult> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to update profile');
    }
    
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Apply updates - Filter out any fields that shouldn't be updated
    // Note: This prevents updating critical fields like role, email, etc.
    const allowedUpdates: {[key: string]: any} = {
      firstName: command.firstName,
      lastName: command.lastName,
      phoneNumber: command.phoneNumber,
      dateOfBirth: command.dateOfBirth,
      gender: command.gender,
      profilePicture: command.profilePicture,
      bio: command.bio,
      address: command.address,
      emergencyContact: command.emergencyContact,
      travelPreferences: command.travelPreferences,
    };
    
    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });
    
    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }
    
    // Transform to DTO
    const profileResult = plainToClass(ProfileResult, updatedUser.toJSON());
    
    // Publish event
    this.eventBus.publish({
      type: 'profile.updated',
      payload: profileResult,
      timestamp: new Date()
    });
    
    return profileResult;
  }
} 