import { injectable } from 'tsyringe';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { GetBusStopQuery } from './get-bus-stop.query';
import { NotFoundError } from '@core/errors/not-found.error';

@injectable()
export class GetBusStopHandler {
  async execute(query: GetBusStopQuery): Promise<any> {
    const { busStopId } = query;
    
    const busStop = await BusStopModel.findById(busStopId);
    
    if (!busStop) {
      throw new NotFoundError(`Bus stop with ID ${busStopId} not found`);
    }
    
    return busStop.toJSON();
  }
} 