module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:rxjs/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['import', '@typescript-eslint', 'rxjs', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      modules: true,
      spread: true,
      restParams: true,
      jsx: true,
    },
    ecmaVersion: 2020,
    // createDefaultProgram: true,
  },
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
    es2021: true,
  },
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/indent': 'off',
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-no-literals': 'off',
    'react/jsx-sort-props': 'off',
    'react/jsx-newline': 'off',
    'react/jsx-max-depth': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/display-name': ['warn', { ignoreTranspilerName: true }],
    'react/default-props-match-prop-types': 'off',
    'react/function-component-definition': 'off',
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prefer-es6-class': 'error',
    'react/prop-types': 'off',
    'react/no-array-index-key': 'error',
    'react/no-set-state': 'off',
    'react/button-has-type': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-anonymous-default-export': 'off',
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/no-default-export': 'off',
    'import/prefer-default-export': 'off',
    'import/default': 'off',
    'import/export': 'off',
    'import/named': 'off',
    'import/order': 'off',
    'global-require': 'off',
    'no-underscore-dangle': 'off',
    'no-undef-init': 'off',
    'no-undef': 'off',
    'no-empty': 'off',
    'no-alert': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-confusing-arrow': 'off',
    'arrow-body-style': 'off',
    'object-curly-newline': 'off',
    'prefer-arrow-callback': 'off',
    'class-methods-use-this': 'off',
    'implicit-arrow-linebreak': 'off',
    'linebreak-style': 'off',
    'indent': 'off',
    'max-len': ['error', { code: 160, ignorePattern: 'className=".*"' }],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'eqeqeq': ['error', 'always'],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
  settings: {
    'import/ignore': ['node_modules'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
    'react': { pragma: 'React', version: 'detect' },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'rxjs/no-implicit-any-catch': ['warn', { allowExplicitAny: true }],
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
      env: { jest: true },
    },
    {
      files: ['**/*.stories.ts', '**/*.stories.tsx', '**/*.stories.js', '**/*.stories.jsx'],
      rules: { 'react/display-name': 'off', 'import/no-cycle': 'off' },
    },
  ],
};