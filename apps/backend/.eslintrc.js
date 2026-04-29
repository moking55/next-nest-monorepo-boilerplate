module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript', // ให้ import plugin เข้าใจ .ts/.tsx
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    // ให้ resolver อ่าน path/paths จาก tsconfig (รองรับ alias เช่น @/*)
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: __dirname + '/tsconfig.json',
      },
    },
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // ---- จัดกลุ่มและเรียง import ----
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node core: fs, path, 'node:*'
          'external', // npm packages
          'internal', // โค้ดในโปรเจกต์ (เช่น @/* -> src/*)
          'parent', // ../../ ออกนอกไดเรกทอรี
          'sibling', // ./../ ไฟล์พี่น้อง
          'index', // ./index
          'type', // type-only imports (TS)
        ],
        pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
          orderImportKind: 'asc',
        },
      },
    ],

    // ---- แยกและบังคับ import type ----
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],

    // ---- Naming convention (ของเดิม) ----
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      { selector: 'function', format: ['camelCase'] },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      { selector: 'method', format: ['camelCase'] },
      { selector: 'interface', format: ['PascalCase'] },
      { selector: 'class', format: ['PascalCase'] },
      { selector: 'enum', format: ['PascalCase'] },
      { selector: 'enumMember', format: ['UPPER_CASE'] },
      { selector: 'typeAlias', format: ['PascalCase'] },
    ],

    // ---- Restrict enum/interface/type alias (ของเดิม) ----
    // 'no-restricted-syntax': [
    //   'error',
    //   {
    //     selector: 'TSEnumDeclaration',
    //     message: 'Enums should only be defined in the common/types folder.',
    //   },
    //   {
    //     selector: 'TSInterfaceDeclaration',
    //     message:
    //       'Interfaces should only be defined in service files or the common/interfaces folder.',
    //   },
    //   {
    //     selector: 'TSTypeAliasDeclaration',
    //     message:
    //       'Type aliases should only be defined in the common/types folder.',
    //   },
    //   {
    //     selector: 'ExportNamedDeclaration > TSInterfaceDeclaration',
    //     message:
    //       'Exported interfaces should only be defined in the common/interfaces folder.',
    //   },
    // ],

    'prefer-arrow/prefer-arrow-functions': 'off', // บ่หื้อใจ้ Arrow function น๊ะจร๊ะ
    'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
    '@typescript-eslint/prefer-function-type': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'import/newline-after-import': ['error', { count: 1 }],
  },
  overrides: [
    {
      files: [
        'src/common/types/**/*.ts',
        'src/common/constants/**/*.ts',
        'src/common/interfaces/**/*.ts',
      ],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['**/*.service.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'TSEnumDeclaration',
            message: 'Enums should only be defined in the common/types folder.',
          },
          {
            selector: 'TSTypeAliasDeclaration',
            message:
              'Type aliases should only be defined in the common/types folder.',
          },
          {
            selector: 'ExportNamedDeclaration > TSInterfaceDeclaration',
            message:
              'Interfaces in service files should not be exported. Use internal interfaces or move to common/interfaces folder.',
          },
        ],
      },
    },
  ],
};
