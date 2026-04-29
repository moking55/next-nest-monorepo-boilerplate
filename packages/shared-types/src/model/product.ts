import type { ProductStatus } from '../enums/product-status';

export interface Product {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
}
