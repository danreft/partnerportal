// Flat ESLint config compatible with Next.js 15/ESLint 9
// Keeps linting non-blocking and avoids circular config issues.

import nextConfig from "eslint-config-next"

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Next.js recommended config (includes TS/React parser & rules)
  ...nextConfig,
  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
    ],
  },
  // Project-level rule tuning to keep lint non-blocking for runtime/dev
  {
    files: ["**/*.{js,jsx,ts,tsx}"]
    ,rules: {
      // Downgrade hook dependency rule to warning
      "react-hooks/exhaustive-deps": "warn",
      // Disable purity rule for now (impure calls in components allowed)
      "react-hooks/purity": "off",
    },
  },
]
