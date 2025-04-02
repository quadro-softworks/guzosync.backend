// src/core/utils/api-response.ts
import { Response } from "express";

export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public errors?: any[], // For validation errors primarily
  ) {}
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200,
) {
  res.status(statusCode).json(new ApiResponse<T>(true, message, data));
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any[],
) {
  res
    .status(statusCode)
    .json(new ApiResponse<null>(false, message, null, errors));
}
