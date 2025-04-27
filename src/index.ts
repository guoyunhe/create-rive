import { camelCase, pascalCase } from 'change-case';
import { f2elint } from 'f2elint';
import f2etest from 'f2etest';
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
  template?: 'react' | 'preact' | 'node' | 'cli' | 'web' | 'base';
}

export async function createRive(project: string | null, { template }: InitOptions) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const root = resolve(project || '.');

  let packageJson: any = {};
  try {
    packageJson = await fs.readJSON(join(root, 'package.json'), {
      throws: false,
    });
  } catch {
    //
  }

  const isGitRoot = await fs.exists(join(root, '.git'));

  const name = packageJson?.name || basename(root);
  const _template = template || packageJson?.rive?.template || 'base';

  await f2elint(root, {
    template: ['react', 'preact'].includes(_template) ? 'react' : 'base',
    stylelint: ['web', 'react', 'preact'].includes(_template),
    prettier: true,
    lintStaged: isGitRoot,
    commitlint: isGitRoot,
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

  const initTemplate = async (tpl: string) => {
    await init(join(__dirname, '../templates', tpl), root, params, {
      bumpDependencies: true,
      disableLog: true,
      prettier: prettierConfig,
    });
  };

  if (isGitRoot) {
    await initTemplate('github');
  }

  switch (_template) {
    case 'base':
      await f2etest(root, { template: 'base', disableLog: true });
      await initTemplate('base');
      break;
    case 'node':
      await f2etest(root, { template: 'base', disableLog: true });
      await initTemplate('base');
      await initTemplate('node');
      break;
    case 'cli':
      await f2etest(root, { template: 'base', disableLog: true });
      await initTemplate('base');
      await initTemplate('node');
      await initTemplate('cli');
      break;
    case 'web':
      await f2etest(root, { template: 'web', disableLog: true });
      await initTemplate('base');
      await initTemplate('web');
      break;
    case 'react':
      await f2etest(root, { template: 'react', disableLog: true });
      await initTemplate('base');
      await initTemplate('web');
      await initTemplate('react');
      break;
    case 'preact':
      await f2etest(root, { template: 'preact', disableLog: true });
      await initTemplate('base');
      await initTemplate('web');
      await initTemplate('preact');
      break;
    default:
      break;
  }
}
