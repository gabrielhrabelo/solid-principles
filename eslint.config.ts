import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { '@stylistic': stylistic }, languageOptions: { globals: globals.node },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always']
    }
  },
  tseslint.configs.recommended,
])
