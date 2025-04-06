import { QueueRegulatorResult } from '@core/app/dtos/queue-regulator-result.dto';
import { GetQueueRegulatorsQuery } from './get-queue-regulators.query';
import { ApiError } from '@core/errors/api-error';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { Err, Ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { NotFoundError } from '@core/errors/not-found.error';
import { PaginatedResponse } from '@core/utils/paginated-response';
import { plainToClass } from 'class-transformer';

@injectable()
export class GetQueueRegulatorsHandler {
  execute = async (
    query: GetQueueRegulatorsQuery,
  ): Promise<Result<PaginatedResponse<QueueRegulatorResult>, ApiError>> => {
    const all = UserModel.find({});

    if (!all) return new Err(new NotFoundError('No queue regulators found'));

    const paginated = await all.skip(query.skip).limit(query.limit);

    const allLength = await all.countDocuments();

    return new Ok({
      items: paginated.map((user) => plainToClass(QueueRegulatorResult, user)),
      pagination: {
        currentPage: query.page,
        totalPages: Math.ceil(allLength / query.limit),
        totalItems: allLength,
        limit: query.limit,
      },
    } as PaginatedResponse<QueueRegulatorResult>);
  };
}
