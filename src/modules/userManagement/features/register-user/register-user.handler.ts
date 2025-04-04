// src/modules/user-management/features/register-user/register-user.handler.ts
import { injectable, inject } from 'tsyringe';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema'; // Adjust the import path as necessary
import { PublicUser } from '../../domain/models/user.model'; // Use PublicUser for return type
import { RegisterUserCommand } from './register-user.command';
import { IHashingService } from '@core/services/hashing.service';
import { BadRequestError } from '@core/errors/bad-request.error';
// Optional: Import event bus if publishing an event
// import { IEventBus } from '@core/events/event-bus';

@injectable()
export class RegisterUserHandler {
  constructor(
    @inject('IHashingService') private hashingService: IHashingService,
    // Optional: @inject('IEventBus') private eventBus: IEventBus
  ) {}

  async execute(command: RegisterUserCommand): Promise<PublicUser> {
    // 1. Check if user already exists
    const existingUser = await UserModel.findOne({ email: command.email });
    if (existingUser) {
      throw new BadRequestError(
        `User with email ${command.email} already exists.`,
      );
    }

    // 2. Hash the password
    const hashedPassword = await this.hashingService.hash(command.password);

    // 3. Create new user
    const newUser = new UserModel({
      email: command.email,
      password: hashedPassword,
      name: command.name,
      // roles: ['user'] // Handled by schema default
    });

    // 4. Save to DB
    const savedUser = await newUser.save();

    // 5. Optional: Publish UserRegisteredEvent
    // const event = { type: 'user.registered', payload: { userId: savedUser.id, email: savedUser.email }, timestamp: new Date() };
    // this.eventBus.publish(event);

    // 6. Return public user data (transformed by schema's toJSON)
    return savedUser.toJSON() as PublicUser;
  }
}
