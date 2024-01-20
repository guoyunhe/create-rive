import merge from 'deepmerge';
import fse from 'fs-extra';
import { arrayMerge } from '../private/arrayMerge.js';

const baseTsconfig = {
  compilerOptions: {
    target: 'esnext',
    lib: ['esnext'],
    allowJs: true,
    checkJs: false,
    skipLibCheck: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: true,
    types: ['rive/globals'],
  },
  include: ['src'],
  exclude: ['**/*.spec.js', '**/*.spec.ts', '**/*.test.js', '**/*.test.ts'],
};

const nodeTsconfig = merge(
  baseTsconfig,
  {
    compilerOptions: {
      types: ['node'],
    },
  },
  { arrayMerge },
);

const reactTsconfig = merge(
  baseTsconfig,
  {
    compilerOptions: {
      target: 'esnext',
      lib: ['dom', 'dom.iterable'],
      module: 'esnext',
      jsx: 'react-jsx',
    },
    exclude: [
      '**/*.spec.jsx',
      '**/*.spec.tsx',
      '**/*.test.jsx',
      '**/*.test.tsx',
    ],
  },
  { arrayMerge },
);

const filePath = './tsconfig.json';

export async function initTsconfig(template: string) {
  let tsconfigOverride: Partial<unknown> = {};
  switch (template) {
    case 'react':
    case 'react-icons':
      tsconfigOverride = reactTsconfig;
      break;
    default:
      tsconfigOverride = nodeTsconfig;
  }

  let tsconfig: Partial<unknown>;
  try {
    tsconfig = (await fse.readJson(filePath, { throws: false })) || {};
    tsconfig = merge(tsconfig, tsconfigOverride, { arrayMerge });
  } catch (e) {
    tsconfig = tsconfigOverride;
  }

  await fse.outputJson(filePath, tsconfig, { spaces: 2 });
}
