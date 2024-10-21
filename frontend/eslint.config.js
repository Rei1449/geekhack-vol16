import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

// FlatCompatを使用して旧式の設定もサポート
const compat = new FlatCompat();

export default [
  {
    ignores: [
      'node_modules/',
      '.next/',
      '.nuxt/',
      '.astro/',
      'build/',
      'dist/',
      'out/',
      'public/',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'vite.config.ts',
      'next.config.js',
      'next.config.mjs',
      'tsconfig.json',
      'eslint.config.js',
      'prettier.config.js',
      'src/env.d.ts',
      '*.cjs',
      '*.mjs',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  js.configs.recommended,
  eslintConfigPrettier, // Prettierとの競合を無効化
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  // この辺はよく見てないのでよしなに
  {
    // すべてのファイルに適用される共通ルール
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      // 一般的なルール
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
