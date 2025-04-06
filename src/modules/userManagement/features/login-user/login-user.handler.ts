// src/modules/user-management/features/login-user/login-user.handler.ts
import { injectable, inject } from 'tsyringe';
import { LoginUserCommand, LoginResponse } from './login-user.command';
import { IHashingService } from '@core/services/hashing.service';
import { IJwtService, IJwtPayload } from '@core/services/jwt.service';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { AuthResult } from '@core/app/dtos/auth-result.dto';

@injectable()
export class LoginUserHandler {
  constructor(
    @inject('IHashingService') private hashingService: IHashingService,
    @inject('IJwtService') private jwtService: IJwtService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginResponse> {
    // 1. Find user by email, explicitly selecting the password
    const user = await UserModel.findOne({ email: command.email }).select(
      '+password',
    );
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.'); // Generic message
    }

    // 2. Compare passwords
    const isPasswordValid = await this.hashingService.compare(
      command.password,
      user.password, // Accessing the selected password field
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password.'); // Generic message
    }

    // 3. Generate JWT
    const jwtPayload: IJwtPayload = {
      userId: user.id,
      email: user.email,
      // roles: user.roles // Include roles if needed for authorization
    };
    const token = this.jwtService.sign(jwtPayload);

    // 4. Prepare response (user data without password)
    const publicUserData = user.toJSON() as AuthResult; // Use schema's toJSON

    return {
      token,
      user: publicUserData,
    };
  }
}
