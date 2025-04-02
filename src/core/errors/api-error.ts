// src/core/errors/api-error.ts
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: any[]; // Optional detailed errors (e.g., validation)

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype); // Maintain prototype chain
  }
}
