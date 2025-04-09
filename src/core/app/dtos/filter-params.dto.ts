import { SearchBy } from '@core/app/enums/search-by.enum';
import { SortBy } from '@core/app/enums/sort-by.enum';
import { SortOrder } from '@core/app/enums/sort-order.enum';
import { object, z } from 'zod';

export interface IFilterParams {
  search: SearchBy;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
export class FilterParams {
  search: SearchBy;
  sortBy: SortBy;
  sortOrder: SortOrder;

  constructor(filter: IFilterParams) {
    this.search = filter.search;
    this.sortBy = filter.sortBy;
    this.sortOrder = filter.sortOrder;
  }
}

export const FilterParamsSchema = z.object({
  search: z
    .enum(Object.values(SearchBy) as [string, ...string[]])
    .default(SearchBy.NAME), // Search name, email, etc..
  sortBy: z
    .enum(Object.values(SortBy) as [string, ...string[]])
    .default(SortBy.CREATED_AT), // e.g., 'name', 'createdAt'
  sortOrder: z
    .enum(Object.values(SortOrder) as [string, ...string[]])
    .default(SortOrder.DESC), // asc desc
});

export const DefaultFilterParams = new FilterParams({
  search: SearchBy.NAME,
  sortBy: SortBy.NAME,
  sortOrder: SortOrder.DESC,
});
