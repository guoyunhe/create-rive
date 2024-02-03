#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRive } from '.';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command('create-rive');

program
  .argument('<first-name>', 'First name')
  .argument('<last-name>', 'Last name')
  .option('--last-name-upper-case', 'Transform last name to upper case')
  .action((firstName, lastName, options) => {
    console.log(createRive(firstName, lastName, options));
  });

program.helpOption('-h, --help', 'Show command help');

program.version(packageJson.version, '-v, --version', 'Show command version');

program.parse();
