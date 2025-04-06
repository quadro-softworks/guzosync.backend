import { ResponseHandler } from './../utils/api-response';
// src/core/middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@core/errors/api-error';
import config from '@core/config';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error occurred:', err); // Log the full error

  if (err instanceof ApiError) {
    ResponseHandler.sendApiError(res, err, err.statusCode, err.errors);
  } else {
    // Handle unexpected errors
    const message =
      config.nodeEnv === 'development'
        ? err.message
        : 'An unexpected internal server error occurred';
    ResponseHandler.sendGenericError(res, err, 500);
  }
};
