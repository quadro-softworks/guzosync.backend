import { injectable } from 'tsyringe';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { SearchBusStopsQuery } from './search-bus-stops.query';

interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

@injectable()
export class SearchBusStopsHandler {
  async execute(query: SearchBusStopsQuery): Promise<PaginatedResult<any>> {
    const { 
      search, 
      filterBy = 'name', 
      pn = 1, 
      ps = 10,
      lat,
      lng,
      distance = 5 // Default 5km if not specified
    } = query;
    
    // Build filter
    let filter: any = { isActive: true }; // Only return active bus stops
    
    if (search && filterBy === 'name') {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive name search
    }
    
    // Location-based search
    if (filterBy === 'location' && lat !== undefined && lng !== undefined) {
      filter = {
        ...filter,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat], // MongoDB uses [longitude, latitude]
            },
            $maxDistance: distance * 1000, // Convert km to meters
          },
        },
      };
    }
    
    // Execute count for pagination
    const totalItems = await BusStopModel.countDocuments(filter);
    
    // Execute query with pagination
    const busStops = await BusStopModel.find(filter)
      .sort({ name: 1 })
      .skip((pn - 1) * ps)
      .limit(ps);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / ps);
    
    // Return paginated result
    return {
      data: busStops.map(stop => stop.toJSON()),
      totalItems,
      totalPages,
      currentPage: pn,
      pageSize: ps
    };
  }
} 