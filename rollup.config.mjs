import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.js", // Входной файл, с которого начинается сборка
  output: {
    file: "dist/main.js", // Итоговый бандл
    format: "esm", // Формат сборки (esm, cjs, umd, iife и т. д.)
  },
  plugins: [nodeResolve()],
};
