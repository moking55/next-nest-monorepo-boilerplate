/**
 * Lifecycle hooks interface for service operations
 */
export interface ServiceHooks<T, CreateType, UpdateType> {
  beforeCreate?(data: CreateType): Promise<CreateType> | CreateType;
  afterCreate?(result: T): Promise<T> | T;
  beforeUpdate?(
    id: string | number,
    data: UpdateType,
  ): Promise<UpdateType> | UpdateType;
  afterUpdate?(result: T): Promise<T> | T;
  beforeDelete?(id: string | number): Promise<void> | void;
  afterDelete?(id: string | number): Promise<void> | void;
}
