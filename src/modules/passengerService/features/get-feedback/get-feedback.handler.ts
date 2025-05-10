import { injectable } from 'tsyringe';
import { FeedbackModel } from '../../infrastructure/mongodb/schemas/feedback.schema';
import { GetFeedbackQuery } from './get-feedback.query';
import { FeedbackResult } from '@core/app/dtos/feedback-result.dto';
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
export class GetFeedbackHandler {
  async execute(query: GetFeedbackQuery, userId: string): Promise<PaginatedResult<FeedbackResult>> {
    if (!userId) {
      throw new UnauthorizedError('User must be authenticated to view feedback');
    }
    
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    
    // Build filter
    const filter = { userId };
    
    // Build sort options
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };
    
    // Execute count for pagination
    const totalItems = await FeedbackModel.countDocuments(filter);
    
    // Execute query with pagination
    const feedback = await FeedbackModel.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Transform to DTOs
    const feedbackResults = feedback.map(item => 
      plainToClass(FeedbackResult, item.toJSON())
    );
    
    // Return paginated result
    return {
      data: feedbackResults,
      totalItems,
      totalPages,
      currentPage: page,
      limit
    };
  }
} 