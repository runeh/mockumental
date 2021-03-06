#!/usr/bin/env node

const pkg = require('../package.json');

const program = require('commander');

program
  .version(pkg.version)
  .command('serve', 'start server', {isDefault: true})
  .command('list', 'show routes')
  .command('explain', 'explain how a file name will be parsed')
  .parse(process.argv);
