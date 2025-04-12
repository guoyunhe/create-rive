import { camelCase, pascalCase } from 'change-case';
import { f2elint } from 'f2elint';
import fs from 'fs-extra';
import { init } from 'init-roll';
import { basename, dirname, join, resolve } from 'path';
import prettierConfig from 'prettier-config-ali';
import { fileURLToPath } from 'url';

export interface InitOptions {
  /**
   * Template to use.
   *
   * @default "react"
   */
  template?: 'react' | 'react-icons' | 'node' | 'cli' | 'web' | 'base';
}

export async function createRive(project: string | null, { template }: InitOptions) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const root = resolve(project || '.');

  let packageJson: any = {};
  try {
    packageJson = await fs.readJSON(join(root, 'package.json'), {
      throws: false,
    });
  } catch (e) {
    //
  }

  const name = packageJson?.name || basename(root);
  const _template = template || packageJson?.rive?.template || 'base';

  await f2elint(root, {
    template: ['react', 'react-icons'].includes(_template) ? 'react' : 'base',
    stylelint: ['web', 'react', 'react-icons'].includes(_template),
    prettier: true,
    lintStaged: true,
    commitlint: true,
    disableLog: true,
  });

  const params = {
    name,
    basename: basename(name),
    functionName: camelCase(basename(name)),
    componentName: pascalCase(basename(name)),
    description: packageJson?.description || '',
    template: _template,
  };

  await init(join(__dirname, '../templates/base'), root, params, {
    bumpDependencies: true,
    disableLog: true,
    prettier: prettierConfig,
  });

  switch (_template) {
    case 'node':
      await init(join(__dirname, '../templates/node'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier: prettierConfig,
      });
      break;
    case 'cli':
      await init(join(__dirname, '../templates/node'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier: prettierConfig,
      });
      await init(join(__dirname, '../templates/cli'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier: prettierConfig,
      });
      break;
    case 'react':
      await init(join(__dirname, '../templates/react'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier: prettierConfig,
      });
      break;
    case 'react-icons':
      await init(join(__dirname, '../templates/react'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier: prettierConfig,
      });
      await init(join(__dirname, '../templates/react-icons'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier: prettierConfig,
      });
      break;
    default:
      break;
  }
}
