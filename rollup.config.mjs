import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
/*
export default {
  input: "src/main.js", // Входной файл, с которого начинается сборка
  output: {
    file: "dist/main.js", // Итоговый бандл
    format: "esm", // Формат сборки (esm, cjs, umd, iife и т. д.)
  },
  plugins: [nodeResolve()],
};
*/
export default [
  {
    input: "src/main.js",
    output: {
      dir: "dist/prod",
      format: "esm",
      entryFileNames: "qcast.min.js",
      chunkFileNames: "[name]-[hash].min.js",
    },
    plugins: [
      nodeResolve(),
      terser({
        format: {
          comments: false,
        },
        compress: {
          drop_console: true,
        },
      }),
    ],
  },
  {
    input: "src/main.js",
    output: {
      file: "dist/dev/qcast.js",
      format: "esm",
      inlineDynamicImports: true,
    },
    plugins: [nodeResolve()],
  },
];
