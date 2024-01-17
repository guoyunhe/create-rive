#!/usr/bin/env node

import { Command } from 'commander';
import i18n from 'i18n';
import { join } from 'path';
import { riveRootFullPath, riveVersion } from './config.js';
import { init } from './init/init.js';

i18n.configure({
  locales: ['en', 'zh'],
  directory: join(riveRootFullPath, 'locales'),
});

i18n.setLocale(process.env['LANG']?.substring(0, 2) || 'en');

const program = new Command('create-rive');

program
  .argument('[project]', i18n.__('project_argument_desc'))
  .option('-t, --template <name>', i18n.__('template_option_desc'))
  .option('-e, --esm-only', i18n.__('esm_only_option_desc'))
  .option(
    '-p, --package-manager <name>',
    i18n.__('package_manager_option_desc'),
    'npm',
  )
  .action(init);

program.helpOption('-h, --help', i18n.__('help_option_desc'));

program.version(riveVersion, '-v, --version', i18n.__('version_option_desc'));

program.parse();
