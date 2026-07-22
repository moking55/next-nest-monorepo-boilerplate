import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  align?: "left" | "center" | "right";
  cell?: (item: T) => ReactNode;
  header: ReactNode;
  key: string;
  sortable?: boolean;
  width?: string | number;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string;

  onRowClick?: (item: T) => void;
  onSelectionChange?: (keys: string[]) => void;
  onSort?: (key: string, direction: SortDirection) => void;

  className?: string;
  emptyState?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  isLoading?: boolean;
  selectable?: boolean;
  selectedKeys?: string[];
  sortColumn?: string;
  sortDirection?: SortDirection;
}
