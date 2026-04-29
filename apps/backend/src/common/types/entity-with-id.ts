import type { ObjectLiteral } from 'typeorm';

/**
 * Shared constraint for entities with an `id` field
 */
export type EntityWithId = ObjectLiteral & {
  id: string | number;
};
