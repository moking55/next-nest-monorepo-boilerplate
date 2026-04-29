export type ProductContainerProps = Record<string, never>;

export type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: string;
  isActive: boolean;
};
