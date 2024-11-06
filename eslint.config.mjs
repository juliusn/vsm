import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const configs = [
  {
    ignores: ['.next/**'],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-console': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'next/link',
              importNames: ['default'],
              message:
                'Please use { Link } from "next-intl/navigation" instead.',
            },
            {
              name: 'next/navigation',
              importNames: ['redirect', 'usePathname', 'useRouter'],
              message:
                'Please use { redirect, usePathname, useRouter } from "next-intl/navigation" instead.',
            },
          ],
        },
      ],
    },
  },
];

export default configs;
