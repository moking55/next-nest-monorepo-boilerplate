import type { PaginationMeta } from './pagination-meta';
import type { ServiceResponse } from './service-response';

/**
 * Response type for paginated service operations
 */
export type PaginatedResponse<T> = ServiceResponse<T[]> & {
  meta: PaginationMeta;
};
