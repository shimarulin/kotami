import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import css from '@eslint/css'
import js from '@eslint/js'
import markdown from '@eslint/markdown'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

const project = './tsconfig.json'
const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,mts,tsx}'],
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    languageOptions: {
      parserOptions: {
        project,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project,
        },
      },
      'import/external-module-folders': ['node_modules', 'node_modules/@types', '@girs'],
      'import/core-modules': [
        'gi://Adw',
        'gi://Gio',
        'gi://GLib',
        'gi://Pango',
      ],
    },
    rules: {
      'import/order': ['error', {
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'index', 'sibling'],
          'object',
        ],
        'pathGroups': [
          {
            pattern: 'gi://*',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@{apps,components,libs,services,stores,providers,utils,widgets}/**',
            group: 'internal',
            position: 'after',
          },
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
      }],
    },
  },
  stylistic.configs.recommended,
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
])
