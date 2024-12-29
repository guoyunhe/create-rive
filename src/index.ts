import { camelCase, pascalCase } from 'change-case';
import fs from 'fs-extra';
import { init } from 'init-roll';
import { basename, dirname, join, resolve } from 'path';
import prettier from 'prettier-config-rive';
import { fileURLToPath } from 'url';

export interface InitOptions {
  /**
   * Template to use.
   *
   * @default "react"
   */
  template?: 'react' | 'react-icons' | 'node' | 'cli';
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
    prettier,
  });

  switch (_template) {
    case 'node':
      await init(join(__dirname, '../templates/node'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier,
      });
      break;
    case 'cli':
      await init(join(__dirname, '../templates/node'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier,
      });
      await init(join(__dirname, '../templates/cli'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier,
      });
      break;
    case 'react':
      await init(join(__dirname, '../templates/react'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier,
      });
      break;
    case 'react-icons':
      await init(join(__dirname, '../templates/react'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier,
      });
      await init(join(__dirname, '../templates/react-icons'), root, params, {
        bumpDependencies: true,
        disableLog: true,
        prettier,
      });
      break;
    default:
      break;
  }
}
