import { Toast } from "primereact/toast";
import { createContext } from "react";

interface ToastContextProps {
  toast: Toast | null;
}

const defaultToastContext: ToastContextProps = {
  toast: null,
};

export const ToastContext =
  createContext<ToastContextProps>(defaultToastContext);
