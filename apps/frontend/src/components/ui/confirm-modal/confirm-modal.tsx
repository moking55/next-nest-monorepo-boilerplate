"use client";

import { memo } from "react";
import type { ConfirmModalProps } from "./types";
import styles from "./confirm-modal.module.css";

function ConfirmModal({
  confirmLabel = "ยืนยัน",
  isOpen,
  message,
  title,
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button
            className={styles.modalCancelButton}
            onClick={onCancel}
            type="button"
            disabled={isLoading}
          >
            ย้อนกลับ
          </button>
          <button
            className={styles.modalConfirmButton}
            onClick={onConfirm}
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "กำลังลบ..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ConfirmModal);
