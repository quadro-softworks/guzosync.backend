import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  MIN_PAGE_LIMIT,
} from '@core/constants/pagination.constants';
import { z } from 'zod';

export class PaginationParams {
  page: number;
  limit: number;
  skip: number;
  constructor(page: number = 1, limit: number = 10) {
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
  }
}

export const PaginationParamsSchema = z
  .object({
    page: z.coerce.number().int().positive().min(1).default(1),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .min(MIN_PAGE_LIMIT)
      .max(MAX_PAGE_LIMIT)
      .default(DEFAULT_PAGE_LIMIT),
    skip: z.number(),
  })
  .transform(({ page, limit }) => ({
    page,
    limit,
    skip: (page - 1) * limit,
  }));

export const DefaultPaginationParams = new PaginationParams();
