import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Aplicamos la configuración a todos los archivos relevantes
    plugins: { "react-hooks": pluginReactHooks }, // Agregamos el plugin de react-hooks
    rules: {
      "react-hooks/rules-of-hooks": "error", // Detecta violaciones a las reglas de los hooks
      "react-hooks/exhaustive-deps": "warn", // Advierte dependencias faltantes en useEffect
      "prettier/prettier": "error",
    },
  },
]);