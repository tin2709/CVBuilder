import { i18n } from "@lingui/core";

export const locales = {
  en: "English",
  vi: "Tiếng Việt",
};
export const defaultLocale = "vi";

// Khởi tạo sơ bộ
i18n.load(defaultLocale, {});
i18n.activate(defaultLocale);