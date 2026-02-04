export type ConfirmModalProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  onConfirm: () => void;
  disabled?: boolean;
};
