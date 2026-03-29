export type Locale = "en" | "es";

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "es") return "es";
  return "en";
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/es\//, "/").replace(/^\/es$/, "/");
  if (locale === "en") return cleanPath;
  if (cleanPath === "/") return "/es/";
  return `/es${cleanPath}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}
