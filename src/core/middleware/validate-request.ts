// src/core/middleware/validate-request.ts
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ValidationError } from "@core/errors/validation.error";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Pass Zod issues directly to our custom error
        next(new ValidationError(error.issues));
      } else {
        // Handle unexpected errors during validation
        next(new Error("An unexpected error occurred during validation."));
      }
    }
  };
