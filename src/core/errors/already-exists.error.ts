// src/core/errors/bad-request.error.ts
import { ApiError } from './api-error';

export class AlreadyExistsError extends ApiError {
  constructor(message: string = 'Already Exists') {
    super(409, message);
    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}
