"use client";

import { memo } from "react";
import { InlineIcon } from "@iconify/react";
import clsx from "clsx";
import styles from "./status-badge.module.css";
import type { StatusBadgeProps, StatusType } from "./types";

const statusConfig: Record<StatusType, { icon: string; className: string }> = {
  success: {
    icon: "heroicons:check-circle-20-solid",
    className: styles.success,
  },
  failed: {
    icon: "heroicons:x-circle-20-solid",
    className: styles.failed,
  },
  "in-progress": {
    icon: "heroicons:arrow-path-20-solid",
    className: styles.inProgress,
  },
  warning: {
    icon: "heroicons:exclamation-triangle-20-solid",
    className: styles.warning,
  },
  neutral: {
    icon: "heroicons:minus-circle-20-solid",
    className: styles.neutral,
  },
};

function StatusBadge({
  className,
  label,
  showIcon = true,
  status,
  ...rest
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={clsx(styles.badge, config.className, className)} {...rest}>
      {showIcon && (
        <InlineIcon
          icon={config.icon}
          width={16}
          height={16}
          className={status === "in-progress" ? styles.spinning : undefined}
        />
      )}
      <span>{label}</span>
    </span>
  );
}

export default memo(StatusBadge);
