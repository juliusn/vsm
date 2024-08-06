import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
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
