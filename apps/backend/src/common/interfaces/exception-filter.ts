export interface JsonApiError {
  code: string;
  message: string;
  field?: string;
}

export interface ErrorOptions {
  status: number | string;
  code?: string;
  title?: string;
  detail?: string;
  pointer?: string;
  field?: string;
  meta?: any;
}

export interface ValidationItem {
  property?: string;
  constraints?: Record<string, string>;
  messages?: string[];
}
