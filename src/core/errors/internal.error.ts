// src/core/errors/not-found.error.ts
import { ApiError } from './api-error';

export class InternalServerError extends ApiError {
  constructor(message: string = 'An internal server error has occured.') {
    super(500, message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
