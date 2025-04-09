import { DefaultPaginationParams } from './../../core/app/dtos/pagination-params.dto';
import { ResponseHandler } from './../../core/utils/api-response';
import { injectable } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { appContainer } from '@core/di/container';

import { RegisterBusHandler } from './features/register-bus/register-bus.handler';

// Add other handlers
import { RegisterPersonnelHandler } from './features/personnel/register-personnel/register-personnel.handler';
import { GetQueueRegulatorsHandler } from '@modules/operationsControl/features/personnel/get-queue-regulators/get-queue-regulators.handler';
import { GetQueueRegulatorsQuery } from '@modules/operationsControl/features/personnel/get-queue-regulators/get-queue-regulators.query';
import { DefaultFilterParams } from '@core/app/dtos/filter-params.dto';
// import { GetQueueRegulatorsHandler } from './features/personnel/get-queue-regulators/get-queue-regulators.handler';
// import { GetQueueRegulatorByIdHandler } from './features/personnel/get-queue-regulator-by-id/get-queue-regulator-by-id.handler';
// import { UpdateQueueRegulatorHandler } from './features/personnel/update-queue-regulator/update-queue-regulator.handler';
// import { DeleteQueueRegulatorHandler } from './features/personnel/delete-queue-regulator/delete-queue-regulator.handler';
// import { AssignQueueRegulatorToBusStopHandler } from './features/personnel/assign-queue-regulator/assign-queue-regulator.handler';

// import { GetBusDriversHandler } from './features/personnel/get-bus-drivers/get-bus-drivers.handler';
// import { GetBusDriverByIdHandler } from './features/personnel/get-bus-driver-by-id/get-bus-driver-by-id.handler';
// import { UpdateBusDriverHandler } from './features/personnel/update-bus-driver/update-bus-driver.handler';
// import { DeleteBusDriverHandler } from './features/personnel/delete-bus-driver/delete-bus-driver.handler';
// import { AssignBusToDriverHandler } from './features/personnel/assign-bus-to-driver/assign-bus-to-driver.handler';

@injectable()
export class ControlCenterController {
  private registerBusHandler = appContainer.resolve(RegisterBusHandler);
  private registerPersonnelHandler = appContainer.resolve(
    RegisterPersonnelHandler,
  );
  private getQueueRegulatorsHandler = appContainer.resolve(
    GetQueueRegulatorsHandler,
  );
  // private getQueueRegulatorByIdHandler = appContainer.resolve(
  //   GetQueueRegulatorByIdHandler,
  // );
  // private updateQueueRegulatorHandler = appContainer.resolve(
  //   UpdateQueueRegulatorHandler,
  // );
  // private deleteQueueRegulatorHandler = appContainer.resolve(
  //   DeleteQueueRegulatorHandler,
  // );
  // private assignQueueRegulatorHandler = appContainer.resolve(
  //   AssignQueueRegulatorToBusStopHandler,
  // );
  // private getBusDriversHandler = appContainer.resolve(GetBusDriversHandler);
  // private getBusDriverByIdHandler = appContainer.resolve(
  //   GetBusDriverByIdHandler,
  // );
  // private updateBusDriverHandler = appContainer.resolve(UpdateBusDriverHandler);
  // private deleteBusDriverHandler = appContainer.resolve(DeleteBusDriverHandler);
  // private assignBusToDriverHandler = appContainer.resolve(
  //   AssignBusToDriverHandler,
  // );

  public registerBus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const busCommand = req.body;
      const bus = await this.registerBusHandler.execute(busCommand);
      if (bus.isErr()) {
        ResponseHandler.sendApiError(res, bus.error);
      } else ResponseHandler.sendSuccess(res, bus, 'Bus created successfully.');
    } catch (error) {
      next(error);
    }
  };

  public registerPersonnel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const command = req.body;
      const result = await this.registerPersonnelHandler.execute(command);
      if (result.isErr()) {
        ResponseHandler.sendApiError(res, result.error);
      } else
        ResponseHandler.sendSuccess(
          res,
          result,
          'Personnel registered successfully.',
        );
    } catch (error) {
      next(error);
    }
  };

  public getQueueRegulators = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const filters: GetQueueRegulatorsQuery = {
        ...req.query,
        ...DefaultPaginationParams,
        ...DefaultFilterParams,
      };
      const result = await this.getQueueRegulatorsHandler.execute(filters);
      if (result.isErr()) {
        ResponseHandler.sendApiError(
          res,
          result.error,
          result.error.statusCode,
        );
      } else
        ResponseHandler.sendSuccess(
          res,
          result.value,
          'Queue regulators fetched successfully.',
        );
    } catch (error) {
      next(error);
    }
  };

  // public getQueueRegulatorById = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const result = await this.getQueueRegulatorByIdHandler.execute(
  //       req.params.regulatorId,
  //     );
  //     ResponseHandler.sendSuccess(res, result, 'Queue regulator details fetched successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public updateQueueRegulator = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const result = await this.updateQueueRegulatorHandler.execute({
  //       regulatorId: req.params.regulatorId,
  //       ...req.body,
  //     });
  //     ResponseHandler.sendSuccess(res, result, 'Queue regulator updated successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public deleteQueueRegulator = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const result = await this.deleteQueueRegulatorHandler.execute(
  //       req.params.regulatorId,
  //     );
  //     ResponseHandler.sendSuccess(res, result, 'Queue regulator removed successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public assignQueueRegulatorToBusStop = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const { regulatorId, busStopId } = req.params;
  //     const result = await this.assignQueueRegulatorHandler.execute({
  //       regulatorId,
  //       busStopId,
  //     });
  //     ResponseHandler.sendSuccess(res, result, 'Queue regulator assigned to bus stop.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public getBusDrivers = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const filters = req.query;
  //     const result = await this.getBusDriversHandler.execute(filters);
  //     ResponseHandler.sendSuccess(res, result, 'Bus drivers fetched successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public getBusDriverById = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const result = await this.getBusDriverByIdHandler.execute(
  //       req.params.driverId,
  //     );
  //     ResponseHandler.sendSuccess(res, result, 'Bus driver details fetched successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public updateBusDriver = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const result = await this.updateBusDriverHandler.execute({
  //       driverId: req.params.driverId,
  //       ...req.body,
  //     });
  //     ResponseHandler.sendSuccess(res, result, 'Bus driver updated successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public deleteBusDriver = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const result = await this.deleteBusDriverHandler.execute(
  //       req.params.driverId,
  //     );
  //     ResponseHandler.sendSuccess(res, result, 'Bus driver removed successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public assignBusToDriver = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   try {
  //     const { driverId, busId } = req.params;
  //     const result = await this.assignBusToDriverHandler.execute({
  //       driverId,
  //       busId,
  //     });
  //     ResponseHandler.sendSuccess(res, result, 'Bus assigned to driver successfully.');
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
