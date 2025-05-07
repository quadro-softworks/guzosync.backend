import { ApiError } from './api-error';

export class ConflictError extends ApiError {
  constructor(message: string, errors?: any[]) {
    super(409, message, errors);
    this.name = 'ConflictError';
  }
} 