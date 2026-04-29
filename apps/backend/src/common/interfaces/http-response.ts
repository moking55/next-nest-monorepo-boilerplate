export type Link = string | { href: string; meta?: Meta };

export interface Links {
  [rel: string]: Link;
}

export interface Meta {
  [key: string]: any;
}

export interface JsonApiObject {
  version?: string;
  meta?: Meta;
}

export interface ResourceIdentifierObject {
  id: string;
  type: string;
  meta?: Meta;
}

export interface Relationship {
  data?: ResourceIdentifierObject | ResourceIdentifierObject[] | null;
  links?: Links;
  meta?: Meta;
}

export interface ResourceObject<Attributes = any> {
  id?: string;
  type: string;
  attributes?: Attributes;
  relationships?: { [name: string]: Relationship };
  links?: Links;
  meta?: Meta;
}

export interface ErrorSource {
  pointer?: string; // e.g. "/data/attributes/title"
  parameter?: string; // e.g. "sort"
}

export interface ErrorObject {
  id?: string;
  links?: Links;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: ErrorSource;
  meta?: Meta;
}

export interface JsonApiResponse<Attributes = any> {
  data?: ResourceObject<Attributes> | ResourceObject<Attributes>[] | null;
  errors?: ErrorObject[];
  meta?: Meta;
  jsonapi?: JsonApiObject;
  links?: Links;
  included?: ResourceObject<any>[];
}
