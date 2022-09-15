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

program.option('--template').action(init);

program.helpOption('-h, --help', i18n.__('help_cmd_desc'));

program.version(riveVersion, '-v, --version', i18n.__('version_cmd_desc'));

program.parse();
