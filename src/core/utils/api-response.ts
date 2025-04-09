// src/core/utils/api-response.ts
import { ApiError } from '@core/errors/api-error';
import { Response } from 'express';

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public errors?: any[], // For validation errors primarily
  ) {}
}

export class ResponseHandler {
  static sendSuccess<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): void {
    res.status(statusCode).json(new ApiResponse<T>(true, message, data));
  }

  static sendApiError(
    res: Response,
    error: ApiError,
    statusCode?: number,
    errors?: any[],
  ): void {
    res
      .status(error.statusCode || statusCode || 500)
      .json(new ApiResponse<null>(false, error.message, null, errors));
  }

  static sendGenericError(
    res: Response,
    error: Error,
    statusCode: number = 500,
    errors?: any[],
  ): void {
    res
      .status(statusCode)
      .json(new ApiResponse<null>(false, error.message, null, errors));
  }
}
