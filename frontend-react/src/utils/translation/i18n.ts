import i18next, { Resource } from "i18next";
import translationPolish from "./resources/polish";
import { initReactI18next } from "react-i18next";

const resources: Resource = {
  pl: {
    translation: translationPolish,
  },
};

i18next.use(initReactI18next).init({
  resources: resources,
  lng: "pl",
});

export default i18next;
