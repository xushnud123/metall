import type { LinguiConfig } from "@lingui/conf";

const locales = ["en", "ru", "uz"];

const config: LinguiConfig = {
  locales: locales,
  sourceLocale: "en",
  format: "po",
  catalogs: [
    {
      path: "src/translations/messages/{locale}",
      include: ["<rootDir>"],
      exclude: [
        "**/.next/**",
        "**/*.d.ts",
        "**/*.generated.ts",
        "**/node_modules/**",
      ],
    },
  ],
  compileNamespace: "ts",
  // this causing getFirstOrigin is not a function or its return value is not iterable
  // orderBy: 'origin',
};

export default config;
