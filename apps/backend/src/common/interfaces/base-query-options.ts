import type {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

/**
 * Base options interface for TypeORM queries.
 * Generic over the entity type for full type-safety.
 */
export interface BaseQueryOptions<Entity> {
  select?: FindOptionsSelect<Entity>;
  orderBy?: FindOptionsOrder<Entity>;
  relations?: FindOptionsRelations<Entity>;
  withDeleted?: boolean;
}

/**
 * Paginated query options extending base query options.
 */
export interface PaginatedQueryOptions<
  Entity,
> extends BaseQueryOptions<Entity> {
  page: number;
  pageSize: number;
  where?: FindOptionsWhere<Entity>;
}
