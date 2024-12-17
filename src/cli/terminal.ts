import chalk from 'chalk';

export default class Terminal {
  printContent(content: string | string[]) {
    Array.isArray(content)
      ? content.forEach((line) => console.log(line))
      : console.log(content);
  }

  printLine() {
    console.log(chalk.bold('-'.repeat(30)));
  }
}
