// src/core/middleware/validate-request.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '@core/errors/validation.error';

export const validateRequest =
  (schema: AnyZodObject, type: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the body, query, and params separately
      if (type === 'query') await schema.parseAsync(req.query);
      else if (type === 'params') await schema.parseAsync(req.params);
      else if (type === 'body') await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Pass Zod issues directly to our custom error handler
        next(new ValidationError(error.issues));
      } else {
        // Handle unexpected errors during validation
        next(new Error('An unexpected error occurred during validation.'));
      }
    }
  };
