import type { ComponentPropsWithoutRef } from "react";

export type StatusType =
  | "success"
  | "failed"
  | "in-progress"
  | "warning"
  | "neutral";

export interface StatusBadgeProps extends ComponentPropsWithoutRef<"span"> {
  status: StatusType;
  label: string;
  showIcon?: boolean;
}
