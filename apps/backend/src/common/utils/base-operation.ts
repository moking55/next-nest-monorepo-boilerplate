import { NotFoundException } from '@nestjs/common';

import {
  createSuccessResponse,
  createCreatedResponse,
  createPaginatedResponse,
} from './http-response';

import type { BaseQueryOptions } from '../interfaces/base-query-options';
import type { ServiceHooks } from '../interfaces/service-hooks';
import type { EntityWithId } from '../types/entity-with-id';
import type { PaginatedResponse } from '../types/paginated-response';
import type { ServiceResponse } from '../types/service-response';
import type {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  EntityManager,
} from 'typeorm';

// ────────────────────────────────────────────────────────────
// BaseServiceOperations
// ────────────────────────────────────────────────────────────

export abstract class BaseServiceOperations<
  Entity extends EntityWithId,
  CreateDto extends DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity>,
> {
  protected readonly entityName: string;
  protected hooks: ServiceHooks<Entity, CreateDto, UpdateDto> = {};

  constructor(
    entityName: string,
    protected readonly repository: Repository<Entity>,
  ) {
    this.entityName = entityName;
  }

  // ── Helpers ──────────────────────────────────────────────

  /**
   * Returns the repository, optionally scoped to a transaction.
   */
  protected getRepo(entityManager?: EntityManager): Repository<Entity> {
    return entityManager
      ? entityManager.getRepository<Entity>(this.repository.target)
      : this.repository;
  }

  /**
   * Get the repository for custom queries in derived classes.
   */
  protected getRepository(): Repository<Entity> {
    return this.repository;
  }

  // ── Create ───────────────────────────────────────────────

  /**
   * Create a new entity with lifecycle hooks.
   */
  async create(
    data: CreateDto,
    options?: { entityManager?: EntityManager },
  ): Promise<ServiceResponse<Entity>> {
    let processedData: CreateDto = data;

    if (this.hooks.beforeCreate) {
      processedData = await this.hooks.beforeCreate(data);
    }

    const repo = this.getRepo(options?.entityManager);

    const entity = repo.create(processedData);
    let result = await repo.save(entity as Entity);

    if (this.hooks.afterCreate) {
      result = await this.hooks.afterCreate(result);
    }

    return {
      message: `Create new ${this.entityName} successfully`,
      data: result,
    };
  }

  // ── Read ─────────────────────────────────────────────────

  /**
   * Find entities with filtering.
   */
  async find(
    filter?: FindOptionsWhere<Entity>,
    options?: BaseQueryOptions<Entity>,
  ): Promise<ServiceResponse<Entity[]>> {
    const entities = await this.repository.find({
      where: filter,
      select: options?.select,
      order: options?.orderBy,
      relations: options?.relations,
      withDeleted: options?.withDeleted,
    });

    return {
      message: `Find all ${this.entityName} successfully`,
      data: entities,
    };
  }

  /**
   * Find one entity.
   */
  async findOne(
    filter: FindOptionsWhere<Entity>,
    options?: BaseQueryOptions<Entity>,
  ): Promise<ServiceResponse<Entity | null>> {
    const entity = await this.repository.findOne({
      where: filter,
      select: options?.select,
      order: options?.orderBy,
      relations: options?.relations,
      withDeleted: options?.withDeleted,
    });

    return {
      message: `Find one ${this.entityName} successfully`,
      data: entity ?? null,
    };
  }

  /**
   * Find entity by ID with options.
   */
  async findById(
    id: Entity['id'],
    options?: BaseQueryOptions<Entity>,
  ): Promise<ServiceResponse<Entity | null>> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      select: options?.select,
      order: options?.orderBy,
      relations: options?.relations,
      withDeleted: options?.withDeleted,
    });

    return {
      message: `Find ${this.entityName} by id: ${String(id)} successfully`,
      data: entity ?? null,
    };
  }

  /**
   * Find entity by ID or throw NotFoundException.
   */
  async findByIdOrFail(
    id: Entity['id'],
    options?: BaseQueryOptions<Entity>,
  ): Promise<ServiceResponse<Entity>> {
    const result = await this.findById(id, options);

    if (!result.data) {
      throw new NotFoundException(
        `${this.entityName} with id ${String(id)} not found`,
      );
    }

    return result as ServiceResponse<Entity>;
  }

  /**
   * Find paginated entities.
   */
  async findPaginated(
    page: number,
    pageSize: number,
    filter?: FindOptionsWhere<Entity>,
    options?: BaseQueryOptions<Entity>,
  ): Promise<PaginatedResponse<Entity>> {
    const [entities, total] = await this.repository.findAndCount({
      where: filter,
      select: options?.select,
      order: options?.orderBy,
      relations: options?.relations,
      withDeleted: options?.withDeleted,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      message: `Find paginated ${this.entityName} successfully`,
      data: entities,
      meta: { page, pageSize, total, totalPages },
    };
  }

  /**
   * Count entities matching filter.
   */
  async count(
    filter?: FindOptionsWhere<Entity>,
  ): Promise<ServiceResponse<number>> {
    const total = await this.repository.count({ where: filter });

    return {
      message: `Count ${this.entityName} successfully`,
      data: total,
    };
  }

  /**
   * Check if entity exists.
   */
  async exists(
    filter: FindOptionsWhere<Entity>,
  ): Promise<ServiceResponse<boolean>> {
    const result = await this.count(filter);

    return {
      message: `Check ${this.entityName} existence successfully`,
      data: result.data > 0,
    };
  }

  // ── Update ───────────────────────────────────────────────

  /**
   * Update entity with lifecycle hooks.
   */
  async update(
    id: Entity['id'],
    data: UpdateDto,
    options?: {
      entityManager?: EntityManager;
      returnOptions?: BaseQueryOptions<Entity>;
    },
  ): Promise<ServiceResponse<Entity | null>> {
    let processedData: UpdateDto = data;

    if (this.hooks.beforeUpdate) {
      processedData = await this.hooks.beforeUpdate(id, data);
    }

    const repo = this.getRepo(options?.entityManager);

    await repo.update(id, processedData as DeepPartial<Entity>);

    let updatedEntity = await repo.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      select: options?.returnOptions?.select,
      order: options?.returnOptions?.orderBy,
      relations: options?.returnOptions?.relations,
      withDeleted: options?.returnOptions?.withDeleted,
    });

    if (updatedEntity && this.hooks.afterUpdate) {
      updatedEntity = await this.hooks.afterUpdate(updatedEntity);
    }

    return {
      message: `Update ${this.entityName} by id: ${String(id)} successfully`,
      data: updatedEntity ?? null,
    };
  }

  // ── Delete ───────────────────────────────────────────────

  /**
   * Delete entity with lifecycle hooks.
   */
  async delete(
    id: Entity['id'],
    softDelete = true,
    options?: { entityManager?: EntityManager },
  ): Promise<ServiceResponse<boolean>> {
    if (this.hooks.beforeDelete) {
      await this.hooks.beforeDelete(id);
    }

    const repo = this.getRepo(options?.entityManager);

    if (softDelete) {
      await repo.softDelete(id);
    } else {
      await repo.delete(id);
    }

    if (this.hooks.afterDelete) {
      await this.hooks.afterDelete(id);
    }

    return {
      message: `Delete ${this.entityName} by id: ${String(id)} successfully`,
      data: true,
    };
  }

  /**
   * Restore soft-deleted entity.
   */
  async restore(
    id: Entity['id'],
    options?: { entityManager?: EntityManager },
  ): Promise<ServiceResponse<boolean>> {
    const repo = this.getRepo(options?.entityManager);

    await repo.restore(id);

    return {
      message: `Restore ${this.entityName} by id: ${String(id)} successfully`,
      data: true,
    };
  }

  // ── Bulk ─────────────────────────────────────────────────

  /**
   * Bulk create entities.
   */
  async bulkCreate(
    data: CreateDto[],
    options?: { entityManager?: EntityManager },
  ): Promise<ServiceResponse<Entity[]>> {
    const repo = this.getRepo(options?.entityManager);

    const entities = repo.create(data);
    const results = await repo.save(entities as Entity[]);

    return {
      message: `Bulk create ${this.entityName} successfully`,
      data: results,
    };
  }

  /**
   * Bulk delete entities.
   */
  async bulkDelete(
    ids: Array<Entity['id']>,
    softDelete = true,
    options?: { entityManager?: EntityManager },
  ): Promise<ServiceResponse<boolean>> {
    const repo = this.getRepo(options?.entityManager);

    if (softDelete) {
      await repo.softDelete(ids as string[] | number[]);
    } else {
      await repo.delete(ids as string[] | number[]);
    }

    return {
      message: `Bulk delete ${this.entityName} successfully`,
      data: true,
    };
  }

  // ── Transaction ──────────────────────────────────────────

  /**
   * Execute operation in transaction.
   */
  async executeInTransaction<T>(
    operation: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.repository.manager.transaction((entityManager) =>
      operation(entityManager),
    );
  }
}

// ────────────────────────────────────────────────────────────
// BaseControllerOperations
// ────────────────────────────────────────────────────────────

export class BaseControllerOperations<
  Entity extends EntityWithId,
  CreateDto extends DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity>,
  Service extends BaseServiceOperations<Entity, CreateDto, UpdateDto>,
> {
  constructor(
    protected readonly service: Service,
    protected readonly resourceType: string,
  ) {}

  /**
   * Create a new resource.
   */
  async create(createDto: CreateDto) {
    const result = await this.service.create(createDto);

    return {
      statusCode: 201,
      ...createCreatedResponse(
        this.resourceType,
        result.data,
        `/${this.resourceType}/${result.data.id}`,
        { id: String(result.data.id) },
      ),
    };
  }

  /**
   * Get all resources.
   */
  async findAll(filter?: FindOptionsWhere<Entity>) {
    const result = await this.service.find(filter);

    return createSuccessResponse(this.resourceType, result.data);
  }

  /**
   * Get a single resource by ID.
   */
  async findOne(id: string) {
    const result = await this.service.findById(id);

    return createSuccessResponse(this.resourceType, result.data, { id });
  }

  /**
   * Get paginated resources.
   */
  async findPaginated(
    page: number,
    pageSize: number,
    baseUrl: string,
    filter?: FindOptionsWhere<Entity>,
  ) {
    const result = await this.service.findPaginated(page, pageSize, filter);

    return createPaginatedResponse(
      this.resourceType,
      result.data,
      {
        page: result.meta.page,
        limit: result.meta.pageSize,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
      '/' + baseUrl,
    );
  }

  /**
   * Update a resource by ID.
   */
  async update(id: string, updateDto: UpdateDto) {
    const result = await this.service.update(id, updateDto);

    return createSuccessResponse(this.resourceType, result.data, { id });
  }

  /**
   * Delete a resource by ID (soft delete by default).
   */
  async remove(id: string, softDelete = true) {
    await this.service.delete(id, softDelete);
    return { statusCode: 200 };
  }

  /**
   * Search/filter resources.
   */
  async search(filter: FindOptionsWhere<Entity>) {
    const result = await this.service.find(filter);

    return createSuccessResponse(`${this.resourceType}s`, result.data);
  }
}
