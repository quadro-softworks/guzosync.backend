// src/core/errors/not-found.error.ts
import { ApiError } from "./api-error";

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
