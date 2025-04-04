// src/core/services/jwt.service.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import config from '@core/config';
import ms, { StringValue } from 'ms';

export interface IJwtPayload {
  userId: string;
  email: string;
  // Add other relevant claims like roles if needed
  [key: string]: any; // Allow other properties
}

export interface IJwtService {
  sign(payload: IJwtPayload): string;
  verify(token: string): IJwtPayload | null;
}

export const IJwtServiceMeta = {
  name: 'IJwtService',
};

@injectable()
export class JwtService implements IJwtService {
  private readonly secret = config.jwt.secret!;
  private readonly expiresIn = config.jwt.expiresIn;

  sign(payload: IJwtPayload): string {
    // Explicitly define the options object with the SignOptions type
    // const [time, unit] = this.expiresIn.split(" ")

    const expiresInSeconds = Math.floor(
      ms(this.expiresIn as StringValue) / 1000,
    );

    // Add error handling in case the config string is invalid
    if (isNaN(expiresInSeconds)) {
      console.error(
        `Invalid JWT duration string in config: '${this.expiresIn}'`,
      );
      // Choose how to handle: throw error, use a default, etc. Throwing is safer.
      throw new Error('Invalid JWT expiration configuration.');
    }
    const options: SignOptions = {
      expiresIn: expiresInSeconds, // Convert string to milliseconds
      // You can add other standard JWT options here if needed, e.g., algorithm: 'HS256'
    };
    // Pass the typed options object to jwt.sign
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): IJwtPayload | null {
    try {
      // Explicitly type the decoded payload
      const decoded = jwt.verify(token, this.secret) as IJwtPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null; // Return null or throw a specific error
    }
  }
}
