import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    workspace: [
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['./src/http/controllers/**/*.spec.ts'],
          environment: './prisma/setup-tests.ts',
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['./src/domain/**/*.spec.ts', './src/core/**/*.spec.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      watermarks: {
        statements: [80, 90],
        functions: [80, 90],
        branches: [80, 90],
        lines: [80, 90],
      },
      exclude: [
        ...coverageConfigDefaults.exclude,
        '.husky',
        'src/env',
        'prisma/setup-tests.ts',
        'src/app.ts',
        'src/server.ts',
        'src/repositories/*.ts',
      ],
    },
  },
});
