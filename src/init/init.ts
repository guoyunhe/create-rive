import { basename, join } from 'path';
import { initEditorConfig } from './initEditorConfig.js';
import { initGitHubCI } from './initGitHubCI.js';
import { initGitIgnore } from './initGitIgnore.js';
import { initGitLabCI } from './initGitLabCI.js';
import { initPackageJson } from './initPackageJson.js';
import { initTSConfig } from './initTSConfig.js';
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
  template: 'react' | 'react-icons' | 'node' | 'cli';
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
  const name = project ? basename(project) : basename(process.cwd());

  removeConflictFiles();

  initEditorConfig();
  initGitIgnore();
  await initPackageJson(root, name, template, esmOnly);
  initTSConfig();
  initVSCodeExtensions();
  initVSCodeSettings();

  initGitLabCI();
  initGitHubCI();

  await runCommand(`${packageManager} update`);
  await runCommand(`${packageManager} run lint:fix`);
}
