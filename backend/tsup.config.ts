import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'tsup',
  target: 'node18',
  format: ['cjs', 'esm'],
  entry: ["./src/index.ts",],
  external: ["@prisma/client", "@marketplace/*"],
  skipNodeModulesBundle: true,
  dts: {
    resolve: true,
    // build types for `src/index.ts` only
    // otherwise `Options` will not be exported by `tsup`, not sure how this happens, probably a bug in rollup-plugin-dts
    entry: './src/index.ts',
  },
})