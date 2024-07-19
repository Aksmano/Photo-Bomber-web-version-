import { CSSProperties, useState } from "react";
import { ToastContext } from "./ToastContext";
import { Toast } from "primereact/toast";
import "./ToastContext.css";
interface ToastContextProviderProps {
  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
}

export const ToastContextProvider = ({
  children,
}: ToastContextProviderProps) => {
  const [toast, setToast] = useState<Toast | null>(null);

  return (
    <ToastContext.Provider value={{ toast: toast }}>
      <Toast className="custom-toast" ref={setToast} position="top-center" />
      {children}
    </ToastContext.Provider>
  );
};
