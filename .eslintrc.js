module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  ignorePatterns: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "react/no-unescaped-entities": "off",
  },
};
