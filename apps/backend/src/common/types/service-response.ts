/**
 * Base response type for service operations
 */
export type ServiceResponse<T> = {
  message: string;
  data: T;
};
