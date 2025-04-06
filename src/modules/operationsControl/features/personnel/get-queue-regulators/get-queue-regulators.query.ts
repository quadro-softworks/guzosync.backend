import { SortBy } from '@core/app/enums/sort-by.enum';
import { SortOrder } from '@core/app/enums/sort-order.enum';
import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  MIN_PAGE_LIMIT,
} from '@core/constants/pagination.constants';
import { PaginationParamsSchema } from '@core/app/dtos/pagination-params.dto';
import { z } from 'zod';

const GetQueueRegulatorsSchemaWoPagination = z.object({
  query: z.object({
    search: z.string().optional(), // Search name/email
    sortBy: z.string().optional().default(SortBy.CREATED_AT), // e.g., 'name', 'createdAt'
    sortOrder: z
      .enum([SortOrder.ASC, SortOrder.DESC])
      .optional()
      .default(SortOrder.DESC),
    // Add specific filters like assignedStopId later if needed
  }),
});

export const GetQueueRegulatorsSchema =
  GetQueueRegulatorsSchemaWoPagination.extend({
    query: GetQueueRegulatorsSchemaWoPagination.shape.query.merge(
      PaginationParamsSchema.innerType(),
    ),
  });

export type GetQueueRegulatorsQuery = z.infer<
  typeof GetQueueRegulatorsSchema
>['query'];
