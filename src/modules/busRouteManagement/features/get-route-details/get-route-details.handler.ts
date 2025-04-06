import { BusStop } from '@core/domain/models/bus-stop.model';
import { Route } from '@core/domain/models/route.model';
import { NotFoundError } from '@core/errors/not-found.error';
import { BusStopModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus-stop.schema';
import { RouteModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/route.schema';
import mongoose from 'mongoose';
import { injectable } from 'tsyringe';

// Response type including populated stops
export type RouteDetailsResponse = Omit<Route, 'stopIds' | 'id'> & {
  id: string;
  stops: BusStop[];
};

@injectable()
export class GetRouteDetailsHandler {
  async execute(routeId: string): Promise<RouteDetailsResponse> {
    // Populate the stopIds to get full BusStop documents
    const route = await RouteModel.findById(routeId).populate<{
      stopIds: (Omit<BusStop, 'id'> & { _id: mongoose.Types.ObjectId })[];
    }>({
      path: 'stopIds',
      model: BusStopModel, // Ensure correct model is specified for population
    });

    if (!route) {
      throw new NotFoundError('Route not found.');
    }

    // Manually transform populated stops if necessary (toJSON might handle it)
    const populatedStops = route.stopIds.map(
      (stopDoc) =>
        ({
          id: stopDoc._id.toString(),
          name: stopDoc.name,
          location: stopDoc.location, // Assuming location is included
          isActive: stopDoc.isActive,
          createdAt: stopDoc.createdAt,
          updatedAt: stopDoc.updatedAt,
          capacity: stopDoc.capacity, // Optional field
        }) as unknown as BusStop,
    );

    const response: RouteDetailsResponse = {
      id: route.id.toString(),
      name: route.name,
      description: route.description,
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
      isActive: route.isActive,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
      stops: populatedStops, // Use the array of populated stops
    };

    return response;
  }
}
