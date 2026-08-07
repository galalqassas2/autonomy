import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

// eslint-config-next still ships eslintrc-style configs, so they are bridged
// rather than spread. Spreading them threw "nextVitals is not iterable".
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node QA and Lighthouse scripts. CommonJS on purpose, not app code.
    "*.js",
    "archive/**",
  ]),
]);

export default eslintConfig;
