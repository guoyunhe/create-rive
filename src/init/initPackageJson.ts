import merge from 'deepmerge';
import fse from 'fs-extra';
import { basename, join } from 'path';
import { arrayMerge } from '../private/arrayMerge.js';

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
    arrayMerge,
  });

  // common overriding
  packageJson = merge(
    packageJson,
    {
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
        deploy: 'gh-pages -d build',
        // things to remove
        format: undefined,
        watch: undefined,
      },
      devDependencies: {
        '@mdx-js/react': '^3.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'gh-pages': '^5.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-doc-ui': '^2.0.0',
        rive: '^2.0.0',
        typescript: '^5.0.0',

        // things to remove...
        babel: undefined,
        'babel-loader': undefined,
        '@babel/core': undefined,
        '@babel/runtime': undefined,
        '@babel/parser': undefined,
        '@babel/preset-env': undefined,
        '@babel/preset-typescript': undefined,
        '@babel/preset-react': undefined,
        'css-loader': undefined,
        esbuild: undefined,
        eslint: undefined,
        less: undefined,
        'less-loader': undefined,
        'node-sass': undefined,
        postcss: undefined,
        'postcss-less': undefined,
        'postcss-loader': undefined,
        'postcss-scss': undefined,
        prettier: undefined,
        rollup: undefined,
        sass: undefined,
        'sass-loader': undefined,
        'style-loader': undefined,
        stylelint: undefined,
        'stylelint-config-prettier': undefined,
        'stylelint-prettier': undefined,
        'stylelint-config-recommended-less': undefined,
        'stylelint-config-standard': undefined,
        'stylelint-scss': undefined,
        'stylelint-config-standard-scss': undefined,
        'stylelint-config-recommended-scss': undefined,
        tslint: undefined,
        tsdx: undefined,
        tsup: undefined,
        vite: undefined,
        '@vitejs/plugin-react': undefined,
        '@vitejs/plugin-react-swc': undefined,
        vitest: undefined,
        '@vitest/ui': undefined,
        webpack: undefined,
        'webpack-cli': undefined,
        'webpack-dev-server': undefined,
        'webpack-bundle-analyzer': undefined,
      },
      eslintConfig: {
        extends: 'eslint-config-rive',
      },
      prettier: 'prettier-config-rive',
      rive: {
        template,
        doc: {
          basename: `/${basename(name)}/`,
        },
      },

      // things to remove...
      eslintIgnore: undefined,
      jest: undefined,
      typings: undefined,
    },
    {
      arrayMerge,
    },
  );

  // esm overriding
  if (esmOnly) {
    packageJson = merge(
      packageJson,
      {
        type: 'module',
        main: './dist/index.js',
        module: undefined,
      },
      {
        arrayMerge,
      },
    );
  }

  // template specific overriding
  switch (template) {
    case 'react':
      packageJson = merge(
        packageJson,
        {
          devDependencies: {
            '@testing-library/react': '^14.0.0',
            '@testing-library/user-event': '^14.0.0',
          },
          eslintConfig: {
            extends: 'eslint-config-rive/react',
          },
          stylelint: {
            extends: 'stylelint-config-rive',
            ignoreFiles: undefined,
          },
        },
        {
          arrayMerge,
        },
      );
      break;
    case 'cli':
      packageJson = merge(
        packageJson,
        {
          bin: esmOnly
            ? `dist/${basename(name)}.js`
            : `dist/cjs/${basename(name)}.js`,
          dependencies: {
            commander: '^11.0.0',
          },
        },
        {
          arrayMerge,
        },
      );
      break;
    default:
      break;
  }

  await fse.writeJson(filePath, packageJson, { spaces: 2 });
}
