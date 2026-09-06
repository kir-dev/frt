import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "coverage/**",
      ".local-verification/**",
      ".career-tests-*/**",
      "private/**",
      "next-env.d.ts",
      "node_modules/**",
      "src/payload-types.ts",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
  {
    // New React Compiler diagnostics stay visible without making this security
    // upgrade depend on unrelated component rewrites. Compiler is not enabled.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
