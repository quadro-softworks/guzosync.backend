import { injectable } from 'tsyringe';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import { GetRouteQuery } from './get-route.query';
import { NotFoundError } from '@core/errors/not-found.error';

@injectable()
export class GetRouteHandler {
  async execute(query: GetRouteQuery): Promise<any> {
    const { routeId } = query;
    
    const route = await RouteModel.findById(routeId)
      .populate('stopIds', 'name location capacity'); // Populate bus stop references
    
    if (!route) {
      throw new NotFoundError(`Route with ID ${routeId} not found`);
    }
    
    return route.toJSON();
  }
} 