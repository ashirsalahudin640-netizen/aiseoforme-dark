import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber mutates scene objects inside useFrame by design —
    // that is the frame loop, not render-time mutation.
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  {
    // Vendored VengeanceUI registry components, kept as shipped.
    files: [
      "src/components/ui/image-reveal-list.tsx",
      "src/components/ui/reveal-loader.tsx",
      "src/components/ui/scroll-dissolve-reveal.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
