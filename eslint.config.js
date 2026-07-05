const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const prettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/interface-name-prefix": "off",
      "sort-imports": ["error", { ignoreCase: true }],
      "no-duplicate-imports": "error",
    },
  },
  prettierRecommended,
];
