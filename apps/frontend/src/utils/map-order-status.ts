import type { OrderStatus } from "shared-types";

/**
 * Maps OrderStatus to human-readable labels and CI status colors.
 */
export function mapOrderStatus(status: OrderStatus) {
  switch (status) {
    case "pending":
      return {
        label: "รอดำเนินการ",
        status: "warning" as const,
      };
    case "completed":
      return {
        label: "เสร็จสิ้น",
        status: "success" as const,
      };
    case "hold":
      return {
        label: "พักไว้",
        status: "neutral" as const,
      };
    case "cancelled":
      return {
        label: "ยกเลิก",
        status: "failed" as const,
      };
    default:
      return {
        label: status,
        status: "neutral" as const,
      };
  }
}
