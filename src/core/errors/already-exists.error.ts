// src/core/errors/bad-request.error.ts
import { ApiError } from './api-error';

export class AlreadyExistsError extends ApiError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}
