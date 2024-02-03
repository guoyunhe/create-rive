#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import i18n from 'i18n';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { init } from './init/init.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

i18n.configure({
  locales: ['en', 'zh'],
  directory: join(__dirname, 'locales'),
});

i18n.setLocale(process.env['LANG']?.substring(0, 2) || 'en');

const program = new Command('create-rive');

program
  .argument('[project]', i18n.__('project_argument_desc'))
  .option('-t, --template <name>', i18n.__('template_option_desc'))
  .option('-e, --esm-only', i18n.__('esm_only_option_desc'))
  .action(init);

program.helpOption('-h, --help', i18n.__('help_option_desc'));

program.version(packageJson.version, '-v, --version', i18n.__('version_option_desc'));

program.parse();
