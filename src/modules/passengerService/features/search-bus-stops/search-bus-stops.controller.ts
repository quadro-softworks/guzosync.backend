import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { SearchBusStopsHandler } from './search-bus-stops.handler';
import { appContainer } from '@core/di/container';
import { ResponseHandler } from '@core/utils/api-response';

@injectable()
export class SearchBusStopsController {
  private handler = appContainer.resolve(SearchBusStopsHandler);

  public searchBusStops = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = {
        search: req.query.search as string | undefined,
        filterBy: (req.query.filterBy as 'name' | 'location') || 'name',
        pn: req.query.pn ? Number(req.query.pn) : 1,
        ps: req.query.ps ? Number(req.query.ps) : 10,
        lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
        lng: req.query.lng ? parseFloat(req.query.lng as string) : undefined,
        distance: req.query.distance ? parseFloat(req.query.distance as string) : 5,
      };
      
      const result = await this.handler.execute(query);
      ResponseHandler.sendSuccess(
        res,
        result,
        'Bus stops retrieved successfully',
        200,
      );
    } catch (error) {
      next(error);
    }
  };
} 