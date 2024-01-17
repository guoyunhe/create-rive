import chalk from 'chalk';
import fs from 'fs-extra';
import { basename, join } from 'path';
import { initEditorConfig } from './initEditorConfig.js';
import { initGitHubCI } from './initGitHubCI.js';
import { initGitIgnore } from './initGitIgnore.js';
import { initPackageJson } from './initPackageJson.js';
import { initTsconfig } from './initTsconfig.js';
import { initVSCodeExtensions } from './initVSCodeExtensions.js';
import { initVSCodeSettings } from './initVSCodeSettings.js';
import { removeConflictFiles } from './removeConflictFiles.js';
import { runCommand } from './runCommand.js';

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
  /**
   * Package mangager to use.
   *
   * @default "npm"
   */
  packageManager: 'npm' | 'yarn' | 'pnpm';
}

export async function init(
  project: string | null,
  { template, esmOnly, packageManager }: InitOptions,
) {
  const root = project ? join(process.cwd(), project) : process.cwd();
  const packageJson = await fs.readJSON(join(root, 'package.json'), {
    throws: false,
  });
  const name = packageJson?.name || basename(root);

  const _template = template || packageJson?.rive?.template || 'react';

  console.log('Selected template:', chalk.cyan(_template));

  console.log('Generating files...');
  removeConflictFiles();
  initEditorConfig();
  initGitIgnore();
  await initPackageJson(root, name, _template, esmOnly);
  initTsconfig(_template);
  initVSCodeExtensions();
  initVSCodeSettings();
  initGitHubCI();
  console.log(chalk.green('Done'));

  console.log('Installing node modules...');
  await runCommand(`${packageManager} update`);
  console.log(chalk.green('Done'));

  console.log('Formating source codes...');
  await runCommand(`${packageManager} run lint:fix`);
  console.log(chalk.green('Done'));
}
