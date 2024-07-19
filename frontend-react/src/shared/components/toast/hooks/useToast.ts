import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { ToastMessage } from "primereact/toast";
import { useTranslation } from "react-i18next";
import { ToastI18NKeys } from "../../../../utils/translation/domain/toast/ToastI18N";
import { createNestedKey } from "../../../../utils/stringUtils";
import { TranslationResourceKeys } from "../../../../utils/translation/domain/TranslationResource";

export const useToast = () => {
  const { toast } = useContext(ToastContext);
  const { t } = useTranslation();

  const getToastTitle = (key: ToastI18NKeys) =>
    t(createNestedKey(TranslationResourceKeys.Toast, key));

  const info = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "info",
      summary: title ?? getToastTitle(ToastI18NKeys.Info),
      detail: message,
    });
  };

  const success = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "success",
      summary: title ?? getToastTitle(ToastI18NKeys.Success),
      detail: message,
    });
  };

  const warning = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "warn",
      summary: title ?? getToastTitle(ToastI18NKeys.Warning),
      detail: message,
    });
  };

  const error = (message: string, title?: string, options?: ToastMessage) => {
    toast?.show({
      ...options,
      severity: "error",
      summary: title ?? getToastTitle(ToastI18NKeys.Error),
      detail: message,
      sticky: true,
    });
  };

  return {
    info,
    success,
    warning,
    error,
  };
};
