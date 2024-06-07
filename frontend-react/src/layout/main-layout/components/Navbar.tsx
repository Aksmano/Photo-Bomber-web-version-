import { useTranslation } from "react-i18next";
import { NavbarI18NKeys } from "../../../utils/translation/domain/navbar/NavbarI18N";
import { createNestedKey } from "../../../utils/stringUtils";
import { TranslationResourceKeys } from "../../../utils/translation/domain/TranslationResource";

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <div className="flex pl-3 h-4rem bg-primary align-items-center justify-content-start">
      <div className="text-2xl font-bold">
        {t(
          createNestedKey(TranslationResourceKeys.Navbar, NavbarI18NKeys.Title)
        )}
      </div>
    </div>
  );
};
