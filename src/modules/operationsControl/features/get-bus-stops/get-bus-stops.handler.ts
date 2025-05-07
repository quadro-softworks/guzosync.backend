import { injectable } from 'tsyringe';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { GetBusStopsQuery } from './get-bus-stops.query';
import { BusStopResult } from '@core/app/dtos/bus-stop-result.dto';
import { plainToClass } from 'class-transformer';

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

@injectable()
export class GetBusStopsHandler {
  async execute(query: GetBusStopsQuery): Promise<PaginatedResult<BusStopResult>> {
    const { page = 1, limit = 10, name, isActive } = query;
    
    // Build filter
    const filter: Record<string, any> = {};
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    // Execute count for pagination
    const totalItems = await BusStopModel.countDocuments(filter);
    
    // Execute query with pagination
    const busStops = await BusStopModel.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    // Convert to DTOs
    const busStopResults = busStops.map(stop => 
      plainToClass(BusStopResult, stop.toJSON())
    );
    
    // Return paginated result
    return {
      data: busStopResults,
      totalItems,
      totalPages,
      currentPage: page,
      limit
    };
  }
} 