#!/usr/bin/env node

import { cancel, confirm, intro, isCancel, outro, select, text } from '@clack/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import i18n from 'i18n';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { InitOptions, createRive } from '.';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

i18n.configure({
  locales: ['en', 'zh'],
  directory: join(__dirname, '../locales'),
});

i18n.setLocale(process.env['LANG']?.substring(0, 2) || 'en');

if (process.argv.length > 2 && !process.argv.includes('init')) {
  // Non-interactive
  const program = new Command('create-rive');

  program
    .argument('[project]', i18n.__('project_argument_desc'))
    .option('-t, --template <name>', i18n.__('template_option_desc'))
    .option('-e, --esm-only', i18n.__('esm_only_option_desc'))
    .action(createRive);

  program.helpOption('-h, --help', i18n.__('help_option_desc'));

  program.version(packageJson.version, '-v, --version', i18n.__('version_option_desc'));

  program.parse();
} else {
  // Interactive

  (async () => {
    // print an empty line
    console.log(' ');

    intro(`🚀 ${chalk.bold(chalk.cyan(packageJson.name))} ${chalk.dim(packageJson.version)}`);

    const project = await text({
      message: '📁 ' + i18n.__('project_argument_desc'),
      initialValue: process.cwd(),
      validate: (value) => {
        if (!value || value.length === 0) {
          return '根目录路径必填！';
        } else {
          return undefined;
        }
      },
    });

    if (isCancel(project)) {
      cancel('👋 ' + i18n.__('canceled'));
      process.exit(0);
    }

    const projectPath = resolve(project || '.');

    const template = await select<any, InitOptions['template']>({
      message: '🧰 ' + i18n.__('template_option_desc'),
      options: [
        { value: 'react', label: 'React' },
        { value: 'cli', label: 'CLI' },
        { value: 'node', label: 'Node.js' },
        { value: 'base', label: 'Base' },
      ],
    });

    if (isCancel(template)) {
      cancel('👋 ' + i18n.__('canceled'));
      process.exit(0);
    }

    const esmOnly = await confirm({
      message: '🧰 ' + i18n.__('esm_only_option_desc'),
    });

    if (isCancel(esmOnly)) {
      cancel('👋 ' + i18n.__('canceled'));
      process.exit(0);
    }

    try {
      await createRive(projectPath, {
        template,
        esmOnly,
      });
      outro('✅ ' + i18n.__('initialization_succeeded'));
    } catch (error) {
      outro('❌ ' + i18n.__('initialization_failed'));
      console.error(error);
      process.exit(1);
    }
  })();
}
