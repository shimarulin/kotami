import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import stylistic from '@stylistic/eslint-plugin'
import markdown from '@eslint/markdown'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  stylistic.configs.recommended,
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
])
