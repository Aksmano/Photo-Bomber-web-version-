import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { ToastMessage } from "primereact/toast";

export const useToast = () => {
  const { toast } = useContext(ToastContext);

  const info = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "info",
      summary: title ?? "Info",
      detail: message,
    });
  };

  const success = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "success",
      summary: title ?? "Success",
      detail: message,
    });
  };

  const warning = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "warn",
      summary: title ?? "Warning",
      detail: message,
    });
  };

  const error = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "error",
      summary: title ?? "Error",
      detail: message,
      sticky: true
    });
  };

  return {
    info,
    success,
    warning,
    error,
  };
};
