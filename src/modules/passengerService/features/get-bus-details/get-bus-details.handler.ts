import { injectable } from 'tsyringe';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { GetBusDetailsQuery } from './get-bus-details.query';
import { NotFoundError } from '@core/errors/not-found.error';

@injectable()
export class GetBusDetailsHandler {
  async execute(query: GetBusDetailsQuery): Promise<any> {
    const { busId } = query;
    
    // Find bus and populate route information
    const bus = await BusModel.findById(busId)
      .populate('assignedRouteId') // Populate route information
      .populate('assignedDriverId', 'firstName lastName'); // Populate driver information (basic information only)
    
    if (!bus) {
      throw new NotFoundError(`Bus with ID ${busId} not found`);
    }
    
    // Get additional bus information such as ETA for next stops, if necessary
    // This might involve additional calculations or data retrieval
    
    return {
      ...bus.toJSON(),
      // You can add more computed fields here like ETA, current capacity, etc.
    };
  }
} 