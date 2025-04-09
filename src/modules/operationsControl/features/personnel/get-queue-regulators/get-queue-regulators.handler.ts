import { QueueRegulatorResult } from '@core/app/dtos/queue-regulator-result.dto';
import { GetQueueRegulatorsQuery } from './get-queue-regulators.query';
import { ApiError } from '@core/errors/api-error';
import {
  IUserDocument,
  UserModel,
} from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { QueueRegulatorModel } from '@modules/userManagement/infrastructure/mongodb/schemas/queue-regulator.schema'; // Import QueueRegulatorModel
import { Err, Ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { NotFoundError } from '@core/errors/not-found.error';
import { PaginatedResponse } from '@core/utils/paginated-response';
import { User } from '@core/domain/models/user.model';
import {
  IQueueRegulator,
  QueueRegulator,
} from '@core/domain/models/queue-regulator.model';
import { UserId } from '@core/domain/valueObjects';
import { InternalServerError } from '@core/errors/internal.error';
import { Role } from '@core/domain/enums/role.enum';
import { UserResult } from '@core/app/dtos/user-result.dto';

@injectable()
export class GetQueueRegulatorsHandler {
  execute = async (
    query: GetQueueRegulatorsQuery,
  ): Promise<Result<PaginatedResponse<QueueRegulatorResult>, ApiError>> => {
    try {
      const queueRegulators = await QueueRegulatorModel.find()
        .populate('userId')
        .skip(query.skip) // Add pagination to the query
        .limit(query.limit);

      const totalItems = await QueueRegulatorModel.countDocuments(); // Count total queue regulators

      const queueRegulatorResults = queueRegulators
        .filter((qr) => qr.userId !== null)
        .map((qr) => {
          // Ensure qr.userId is populated before accessing its properties
          const user = qr.userId as unknown as IUserDocument; // Type assertion after populate

          const res = new QueueRegulatorResult(
            {
              ...new User(user.toObject()),
            },
            {
              ...new QueueRegulator(qr.toObject()),
            },
          );
          console.log('QR Result ,', res);
          return res;
        });

      return new Ok({
        items: queueRegulatorResults,
        pagination: {
          currentPage: query.page,
          totalPages: Math.ceil(totalItems / query.limit),
          totalItems: totalItems,
          limit: query.limit,
        },
      });
    } catch (error) {
      console.error('Error fetching queue regulators:', error);
      return new Err(
        new InternalServerError('Failed to fetch queue regulators'),
      );
    }
  };
}
