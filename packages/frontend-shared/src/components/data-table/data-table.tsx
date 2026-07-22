import clsx from "clsx";

import { InlineIcon } from "@iconify/react";

import styles from "./data-table.module.css";

import type { DataTableProps, SortDirection } from "./types";

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  onSelectionChange,
  onSort,
  className,
  emptyState,
  footer,
  hoverable,
  isLoading,
  selectable,
  selectedKeys = [],
  sortColumn,
  sortDirection,
}: DataTableProps<T>) {
  const allKeys = data.map(keyExtractor);
  const allSelected =
    allKeys.length > 0 && allKeys.every((k) => selectedKeys.includes(k));
  const someSelected =
    !allSelected && allKeys.some((k) => selectedKeys.includes(k));

  function handleSelectAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allKeys);
    }
  }

  function handleSelectRow(key: string) {
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  }

  function handleSort(key: string) {
    if (!onSort) return;
    let nextDirection: SortDirection = "asc";
    if (sortColumn === key && sortDirection === "asc") {
      nextDirection = "desc";
    }
    onSort(key, nextDirection);
  }

  function renderSortIcon(colKey: string) {
    const isActive = sortColumn === colKey;
    if (!isActive) {
      return (
        <InlineIcon
          className={styles.sortIconIdle}
          icon="heroicons:chevron-up-down-20-solid"
        />
      );
    }
    return (
      <InlineIcon
        className={styles.sortIconActive}
        icon={
          sortDirection === "asc"
            ? "heroicons:chevron-up-20-solid"
            : "heroicons:chevron-down-20-solid"
        }
      />
    );
  }

  return (
    <div className={clsx(styles.tableContainer, className)}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
        </div>
      )}

      <div className={styles.tableScroll}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {selectable && (
                <th className={styles.checkboxCell}>
                  <input
                    checked={allSelected}
                    onChange={handleSelectAll}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    type="checkbox"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSortable = col.sortable && onSort;
                return (
                  <th
                    className={clsx(isSortable && styles.sortableHeader)}
                    key={col.key}
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                    style={{
                      width: col.width,
                      textAlign: col.align || "left",
                    }}
                  >
                    <span className={styles.headerContent}>
                      {col.header}
                      {isSortable && renderSortIcon(col.key)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className={styles.emptyStateContainer}>
                    {emptyState || "ไม่มีข้อมูล"}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                const isSelected = selectedKeys.includes(key);
                return (
                  <tr
                    className={clsx(
                      (hoverable || onRowClick) && styles.rowHoverable,
                      isSelected && styles.rowSelected,
                    )}
                    key={key}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {selectable && (
                      <td className={styles.checkboxCell}>
                        <input
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          onClick={(e) => e.stopPropagation()}
                          type="checkbox"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          textAlign: col.align || "left",
                        }}
                      >
                        {col.cell
                          ? col.cell(item)
                          : ((item as Record<string, unknown>)[
                              col.key
                            ] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
