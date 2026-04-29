export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UseProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};
