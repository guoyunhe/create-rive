import merge from 'deepmerge';
import fse from 'fs-extra';
import { basename, join } from 'path';

const packageJsonConfig = {
  main: 'dist/cjs/index.js',
  module: 'dist/index.js',
  style: 'dist/index.css',
  types: 'dist/index.d.ts',
  files: ['dist', 'CHANGELOG.md', 'LICENSE', 'README.md'],
  scripts: {
    start: 'rive start',
    build: 'rive build',
    'build:watch': 'rive build --watch',
    test: 'rive test',
    'test:watch': 'rive test --watch',
    lint: 'rive lint',
    'lint:fix': 'rive lint --fix',
    // things to remove
    format: undefined,
  },
  devDependencies: {
    '@testing-library/react': '^14.0.0',
    '@testing-library/user-event': '^14.0.0',
    '@types/react': '^18.0.0',
    '@types/react-dom': '^18.0.0',
    react: '^18.0.0',
    'react-dom': '^18.0.0',
    rive: 'latest',
    typescript: '^5.0.0',
    // things to remove...
    vite: undefined,
    '@vitejs/plugin-react': undefined,
    rollup: undefined,
    esbuild: undefined,
    webpack: undefined,
    'webpack-dev-server': undefined,
    eslint: undefined,
    postcss: undefined,
    'postcss-less': undefined,
    'postcss-scss': undefined,
    stylelint: undefined,
    'stylelint-config-prettier': undefined,
    'stylelint-prettier': undefined,
    'stylelint-config-recommended-less': undefined,
    'stylelint-config-standard': undefined,
    'stylelint-scss': undefined,
    'stylelint-config-standard-scss': undefined,
    'stylelint-config-recommended-scss': undefined,
    prettier: undefined,
    tslint: undefined,
  },
  eslintConfig: {
    extends: 'rive',
  },
  stylelint: {
    extends: 'stylelint-config-rive',
    ignoreFiles: undefined,
  },
  // things to remove...
  eslintIgnore: undefined,
  jest: undefined,
  typings: undefined,
};

export async function initPackageJson(
  root: string,
  name: string,
  template: string,
  esmOnly: boolean,
) {
  const filePath = join(root, 'package.json');
  let packageJson = (await fse.readJson(filePath, { throws: false })) || {};

  // fill missing
  packageJson = merge({ name, version: '0.0.1' }, packageJson, {
    arrayMerge: (target, source) => Array.from(new Set([...source, ...target])),
  });
  // override existing
  packageJson = merge(packageJson, packageJsonConfig);

  if (esmOnly) {
    packageJson = merge(packageJson, {
      type: 'module',
      main: './dist/index.js',
      module: undefined,
    });
  }

  if (template === 'cli') {
    packageJson.bin = esmOnly
      ? `dist/${basename(name)}.js`
      : `dist/cjs/${basename(name)}.js`;
  }

  await fse.writeJson(filePath, packageJson, { spaces: 2 });
}
