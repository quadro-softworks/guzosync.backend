import { injectable } from 'tsyringe';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { GetRoutesQuery } from './get-routes.query';

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

@injectable()
export class GetRoutesHandler {
  async execute(query: GetRoutesQuery): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, name, isActive } = query;
    
    // Build filter
    const filter: any = {};
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    // Execute count for pagination
    const totalItems = await RouteModel.countDocuments(filter);
    
    // Execute query with pagination
    const routes = await RouteModel.find(filter)
      .sort({ name: 1 })
      .populate('stopIds', 'name location') // Populate bus stop references with name and location
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Return paginated result
    return {
      data: routes.map(route => route.toJSON()),
      totalItems,
      totalPages,
      currentPage: page,
      limit
    };
  }
} 