import { PaginationParamsSchema } from '@core/app/dtos/pagination-params.dto';
import { z } from 'zod';
import { FilterParamsSchema } from '@core/app/dtos/filter-params.dto';

const _GetQueueRegulatorsSchema = z.object({
  query: z.object({}),
});

export const GetQueueRegulatorsSchema = _GetQueueRegulatorsSchema.extend({
  query: _GetQueueRegulatorsSchema.shape.query
    .merge(PaginationParamsSchema.innerType())
    .merge(FilterParamsSchema),
});

export type GetQueueRegulatorsQuery = z.infer<
  typeof GetQueueRegulatorsSchema
>['query'];
