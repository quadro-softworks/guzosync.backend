import { injectable } from 'tsyringe';
import { AlertModel } from '../../../passengerService/infrastructure/mongodb/schemas/alert.schema';
import { GetAlertsQuery } from './get-alerts.query';
import { AlertResult } from '@core/app/dtos/alert-result.dto';
import { plainToClass } from 'class-transformer';
import { UnauthorizedError } from '@core/errors/unauthorized.error';

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

@injectable()
export class GetAlertsHandler {
  async execute(query: GetAlertsQuery, userId: string): Promise<PaginatedResult<AlertResult>> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to view alerts');
    }
    
    const { page = 1, limit = 10, isActive, targetType, alertType } = query;
    
    // Build filter
    const filter: Record<string, any> = { userId };
    
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    if (targetType) {
      filter.targetType = targetType;
    }
    
    if (alertType) {
      filter.alertType = alertType;
    }
    
    // Execute count for pagination
    const totalItems = await AlertModel.countDocuments(filter);
    
    // Execute query with pagination
    const alerts = await AlertModel.find(filter)
      .sort({ createdAt: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Transform to DTOs
    const alertResults = alerts.map(alert => 
      plainToClass(AlertResult, alert.toJSON())
    );
    
    // Return paginated result
    return {
      data: alertResults,
      totalItems,
      totalPages,
      currentPage: page,
      limit
    };
  }
} 