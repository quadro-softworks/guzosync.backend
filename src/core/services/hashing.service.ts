// src/core/services/hashing.service.ts
import * as bcrypt from 'bcrypt';
import { injectable } from 'tsyringe';
import config from '@core/config';

export interface IHashingService {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}

export const IHashingServiceMeta = {
  name: 'IHashingService',
};

@injectable()
export class BcryptHashingService implements IHashingService {
  private readonly saltRounds = config.hashing.saltRounds;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
