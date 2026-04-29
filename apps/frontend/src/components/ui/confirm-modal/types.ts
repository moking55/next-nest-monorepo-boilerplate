export interface ConfirmModalProps {
  confirmLabel?: string;
  isOpen: boolean;
  message: string;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
