import merge from 'deepmerge';
import fse from 'fs-extra';
import { basename, join } from 'path';

const packageJsonConfig = {
  main: 'dist/index.cjs',
  module: 'dist/index.mjs',
  style: 'dist/index.css',
  types: 'dist/index.d.ts',
  files: ['dist', 'CHANGELOG.md', 'LICENSE', 'README.md'],
  scripts: {
    start: 'rive start',
    build: 'rive build',
    test: 'rive test',
    lint: 'rive lint',
    'lint:fix': 'rive lint --fix',
  },
  devDependencies: {
    '@testing-library/react': '^14.0.0',
    '@testing-library/user-event': '^14.0.0',
    '@types/react': '^18.0.0',
    '@types/react-dom': '^18.0.0',
    rive: 'latest',
    react: '^18.0.0',
    'react-dom': '^18.0.0',
    typescript: '^5.0.0',
  },
  eslintConfig: {
    extends: 'rive',
  },
  stylelint: {
    extends: 'stylelint-config-rive',
  },
};

const devDepsToRemove = [
  'vite',
  '@vitejs/plugin-react',
  'rollup',
  'esbuild',
  'webpack',
  'webpack-dev-server',
  'eslint',
  'postcss',
  'postcss-less',
  'postcss-scss',
  'stylelint',
  'stylelint-config-prettier',
  'stylelint-prettier',
  'stylelint-config-recommended-less',
  'stylelint-config-standard',
  'stylelint-scss',
  'stylelint-config-standard-scss',
  'stylelint-config-recommended-scss',
  'prettier',
  'tslint',
];

const attrsToRemove = ['jest'];

export async function initPackageJson(
  root: string,
  name: string,
  template: string,
  esmOnly: boolean,
) {
  const filePath = join(root, 'package.json');
  let packageJson = (await fse.readJson(filePath, { throws: false })) || {};

  // fill missing
  packageJson = merge({ name, version: '0.0.1' }, packageJson);
  // override existing
  packageJson = merge(packageJson, packageJsonConfig);

  if (esmOnly) {
    packageJson = merge(packageJson, { type: 'module' });
    delete packageJson.module;
  }

  if (template === 'cli') {
    packageJson.bin = `dist/${basename(name)}.js`;
  }

  // Remove conflict devDependencies
  devDepsToRemove.forEach((dep) => {
    delete packageJson.devDependencies[dep];
  });

  // Remove conflict attributes
  attrsToRemove.forEach((attr) => {
    delete packageJson[attr];
  });

  await fse.writeJson(filePath, packageJson, { spaces: 2 });
}
