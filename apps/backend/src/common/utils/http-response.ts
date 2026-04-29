import type {
  JsonApiResponse,
  ResourceObject,
  ErrorObject,
  Meta,
  Links,
} from '@/common/interfaces/http-response';

/**
 * Creates a successful JSON:API response with a single resource
 */
export function createSuccessResponse<T = any>(
  type: string,
  data: T,
  options?: {
    id?: string;
    meta?: Meta;
    links?: Links;
    included?: ResourceObject<any>[];
  },
): JsonApiResponse<T> {
  const resource: ResourceObject<T> = {
    type,
    attributes: data,
  };

  if (options?.id) {
    resource.id = options.id;
  }

  if (options?.meta) {
    resource.meta = options.meta;
  }

  if (options?.links) {
    resource.links = options.links;
  }

  const response: JsonApiResponse<T> = {
    data: resource,
  };

  if (options?.meta) {
    response.meta = options.meta;
  }

  if (options?.included) {
    response.included = options.included;
  }

  return response;
}

/**
 * Creates a successful JSON:API response with multiple resources
 */
export function createSuccessCollectionResponse<T = any>(
  type: string,
  data: T[],
  options?: {
    meta?: Meta;
    links?: Links;
    included?: ResourceObject<any>[];
    idField?: keyof T;
  },
): JsonApiResponse<T> {
  const resources: ResourceObject<T>[] = data.map((item, index) => {
    const resource: ResourceObject<T> = {
      type,
      attributes: item,
    };

    // Use specified id field or fallback to index
    if (options?.idField && item[options.idField]) {
      resource.id = String(item[options.idField]);
    } else if ((item as any).id) {
      resource.id = String((item as any).id);
    } else {
      resource.id = String(index);
    }

    return resource;
  });

  const response: JsonApiResponse<T> = {
    data: resources,
  };

  if (options?.meta) {
    response.meta = options.meta;
  }

  if (options?.links) {
    response.links = options.links;
  }

  if (options?.included) {
    response.included = options.included;
  }

  return response;
}

/**
 * Creates an error JSON:API response
 */
export function createErrorResponse(
  status: string | number,
  title: string,
  detail: string,
  options?: {
    id?: string;
    code?: string;
    source?: {
      pointer?: string;
      parameter?: string;
    };
    meta?: Meta;
    links?: Links;
  },
): JsonApiResponse {
  const error: ErrorObject = {
    status: String(status),
    title,
    detail,
  };

  if (options?.id) {
    error.id = options.id;
  }

  if (options?.code) {
    error.code = options.code;
  }

  if (options?.source) {
    error.source = options.source;
  }

  if (options?.meta) {
    error.meta = options.meta;
  }

  if (options?.links) {
    error.links = options.links;
  }

  return {
    errors: [error],
  };
}

/**
 * Creates a validation error response for multiple field errors
 */
export function createValidationErrorResponse(
  errors: Array<{
    field: string;
    message: string;
    code?: string;
  }>,
  options?: {
    title?: string;
    meta?: Meta;
  },
): JsonApiResponse {
  const errorObjects: ErrorObject[] = errors.map((error) => ({
    status: '400',
    title: options?.title || 'Validation Error',
    detail: error.message,
    code: error.code || error.field,
    source: {
      pointer: `/data/attributes/${error.field}`,
    },
  }));

  const response: JsonApiResponse = {
    errors: errorObjects,
  };

  if (options?.meta) {
    response.meta = options.meta;
  }

  return response;
}

/**
 * Creates a paginated collection response with pagination links
 */
export function createPaginatedResponse<T = any>(
  type: string,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  baseUrl: string,
  options?: {
    meta?: Meta;
    included?: ResourceObject<any>[];
    idField?: keyof T;
  },
): JsonApiResponse<T> {
  const { page, limit, total, totalPages } = pagination;

  // Create pagination links
  const links: Links = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
  };

  if (page > 1) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }

  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }

  // Create meta with pagination info
  const meta: Meta = {
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    ...options?.meta,
  };

  return createSuccessCollectionResponse(type, data, {
    meta,
    links,
    included: options?.included,
    idField: options?.idField,
  });
}

/**
 * Creates a no content response (204 No Content)
 */
export function createNoContentResponse(): JsonApiResponse {
  return {
    data: null,
  };
}

/**
 * Creates a created response (201 Created) with location
 */
export function createCreatedResponse<T = any>(
  type: string,
  data: T,
  location: string,
  options?: {
    id?: string;
    meta?: Meta;
    links?: Links;
    included?: ResourceObject<any>[];
  },
): JsonApiResponse<T> {
  const links: Links = {
    self: location,
    ...options?.links,
  };

  return createSuccessResponse(type, data, {
    ...options,
    links,
  });
}

/**
 * Utility function to extract resource attributes from JSON:API data
 */
export function extractAttributes<T = any>(
  jsonApiData: ResourceObject<T> | ResourceObject<T>[] | null,
): T | T[] | null {
  if (!jsonApiData) {
    return null;
  }

  if (Array.isArray(jsonApiData)) {
    return jsonApiData.map((resource) => resource.attributes!);
  }

  return jsonApiData.attributes!;
}

/**
 * Utility function to build query parameters for pagination and filtering
 */
export function buildQueryParams(params: {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}): string {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append('page', String(params.page));
  }

  if (params.limit) {
    searchParams.append('limit', String(params.limit));
  }

  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  if (params.filter) {
    Object.entries(params.filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(`filter[${key}]`, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
