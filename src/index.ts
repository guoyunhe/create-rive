import chalk from 'chalk';
import fs from 'fs-extra';
import { init } from 'init-roll';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { runCommand } from './private/runCommand';

export interface InitOptions {
  /**
   * Template to use.
   *
   * @default "react"
   */
  template?: 'react' | 'react-icons' | 'node' | 'cli';
  /**
   * By default, rive generates both CJS and ESM. If esmOnly is enabled, CJS will NOT be generated.
   */
  esmOnly: boolean;
}

export async function createRive(project: string | null, { template, esmOnly }: InitOptions) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const root = project ? join(process.cwd(), project) : process.cwd();

  let packageJson: any;
  try {
    packageJson = await fs.readJSON(join(root, 'package.json'), {
      throws: false,
    });
  } catch (e) {
    //
  }

  const name = packageJson?.name || basename(root);
  const _template = template || packageJson?.rive?.template || 'react';
  const params = {
    name,
    description: packageJson.description || '',
    esmOnly,
    basename: basename(name),
  };

  console.log('Selected template:', chalk.cyan(_template));

  console.log('Generating files...');
  await init(join(__dirname, '../template/base'), root, params);
  switch (_template) {
    case 'node':
      await init(join(__dirname, '../template/node'), root, params);
      break;
    case 'cli':
      await init(join(__dirname, '../template/node'), root, params);
      await init(join(__dirname, '../template/cli'), root, params);
      break;
    case 'react':
      await init(join(__dirname, '../template/react'), root, params);
      break;
    case 'react-icons':
      await init(join(__dirname, '../template/react'), root, params);
      await init(join(__dirname, '../template/react-icons'), root, params);
      break;
    default:
      break;
  }

  console.log(chalk.green('Done'));

  console.log('Installing node modules...');
  await runCommand(`${process.env.npm_command} update`);
  console.log(chalk.green('Done'));

  console.log('Formating source codes...');
  await runCommand(`${process.env.npm_command} run lint:fix`);
  console.log(chalk.green('Done'));
}
