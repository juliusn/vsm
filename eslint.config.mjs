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
              message: 'Please import from `@/i18n/routing` instead.',
            },
            {
              name: 'next/router',
              importNames: ['useRouter'],
              message: 'Please import from `@/i18n/routing` instead.',
            },
            {
              name: 'next/navigation',
              importNames: [
                'redirect',
                'permanentRedirect',
                'useRouter',
                'usePathname',
              ],
              message: 'Please import from `@/i18n/routing` instead.',
            },
          ],
        },
      ],
    },
  },
];

export default configs;
