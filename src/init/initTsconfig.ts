import merge from 'deepmerge';
import fse from 'fs-extra';
import { arrayMerge } from '../private/arrayMerge.js';

const nodeTsconfig = {
  compilerOptions: {
    target: 'esnext',
    lib: ['esnext'],
    allowJs: false,
    skipLibCheck: false,
    esModuleInterop: false,
    allowSyntheticDefaultImports: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    module: 'esnext',
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: true,
    types: ['vitest/globals'],
  },
};

const reactTsconfig = merge(
  nodeTsconfig,
  {
    compilerOptions: {
      target: 'esnext',
      lib: ['dom', 'dom.iterable'],
      module: 'esnext',
      jsx: 'react-jsx',
    },
  },
  { arrayMerge },
);

const filePath = './tsconfig.json';

export async function initTsconfig(template: string) {
  let tsconfigOverride: any = {};
  switch (template) {
    case 'react':
    case 'react-icons':
      tsconfigOverride = reactTsconfig;
      break;
    default:
      tsconfigOverride = nodeTsconfig;
  }

  let tsconfig: any;
  try {
    tsconfig = (await fse.readJson(filePath, { throws: false })) || {};
    tsconfig = merge(tsconfig, tsconfigOverride, { arrayMerge });
  } catch (e) {
    tsconfig = tsconfigOverride;
  }

  await fse.outputJson(filePath, tsconfig, { spaces: 2 });
}
