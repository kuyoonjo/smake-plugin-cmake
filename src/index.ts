import { Command } from 'commander';
import { cmake } from './cmake';

function command(program: Command) {
  program
    .command('cmake <dir>')
    .description('cmake commands')
    .option('-t, --target <triple>', 'target triple')
    .action((dir, opt) => {
      cmake(dir, opt.target, process.argv.slice(7));
    });
}

export { command };
