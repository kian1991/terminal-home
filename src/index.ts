import chalk from 'chalk';
import TerminalHome from './cli/terminal-home';

async function main() {
  const home = new TerminalHome();
  home.printWelcome();
}

main();
