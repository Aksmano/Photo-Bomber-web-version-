import { useState } from "react";
import { ToastContext } from "./ToastContext";
import { Toast } from "primereact/toast";

interface ToastContextProviderProps {
  children?: JSX.Element | JSX.Element[];
}

export const ToastContextProvider = ({
  children,
}: ToastContextProviderProps) => {
  const [toast, setToast] = useState<Toast | null>(null);

  return (
    <ToastContext.Provider value={{ toast: toast }}>
      <Toast ref={setToast} position="top-center" />
      {children}
    </ToastContext.Provider>
  );
};
