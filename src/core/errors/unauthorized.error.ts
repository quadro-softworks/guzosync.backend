// src/core/errors/unauthorized.error.ts
import { ApiError } from "./api-error";

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message); // HTTP 401 Unauthorized
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
