// @ts-check

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

let ignoreConfig = {
    ignores: ['**/dist', '*.config.js'],
};

const projectConfig = {
    languageOptions: {
        parserOptions: {
            project: ['./tsconfig.eslint.json', './packages/**/tsconfig.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
};

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.stylisticTypeChecked,
    {
        extends: tseslint.configs.strictTypeChecked,
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
    ignoreConfig,
    projectConfig,
    eslintConfigPrettier,
);
