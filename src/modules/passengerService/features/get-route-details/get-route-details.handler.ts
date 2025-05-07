import { injectable } from 'tsyringe';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { GetRouteDetailsQuery } from './get-route-details.query';
import { NotFoundError } from '@core/errors/not-found.error';

@injectable()
export class GetRouteDetailsHandler {
  async execute(query: GetRouteDetailsQuery): Promise<any> {
    const { routeId } = query;
    
    // Find route and populate bus stop information
    const route = await RouteModel.findById(routeId)
      .populate('stopIds'); // Populate bus stop information
    
    if (!route) {
      throw new NotFoundError(`Route with ID ${routeId} not found`);
    }
    
    // Get buses currently assigned to this route
    const buses = await BusModel.find({ 
      assignedRouteId: routeId,
      busStatus: 'ACTIVE' // We only want active buses
    })
    .select('id licensePlate busType capacity currentLocation'); // Select only needed fields
    
    return {
      ...route.toJSON(),
      buses: buses.map(bus => bus.toJSON())
    };
  }
} 