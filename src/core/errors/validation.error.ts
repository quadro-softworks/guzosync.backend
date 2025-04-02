import { ApiError } from "./api-error";
import { ZodIssue } from "zod";

export class ValidationError extends ApiError {
  constructor(errors: ZodIssue[], message: string = "Validation Failed") {
    super(422, message, errors); // 422 Unprocessable Entity is common for validation
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
