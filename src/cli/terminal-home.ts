import { select } from '@inquirer/prompts';
import Terminal from './terminal';
import chalk from 'chalk';
import { NewsFeed } from '../media/news-feed';
import { exec } from 'child_process';
import radioPlayer from '../media/radio-player';

const FULL_ACTIONS = [
  { value: 'NEWS', name: 'Show News' },
  { value: 'RADIO', name: 'Listen to Radio' },
  { value: 'RADIO_STOP', name: 'Stop the Radio' },
  { value: 'EXIT', name: 'Exit Terminal Home' },
  { value: 'HOME', name: 'Back' },
] as const;
const ACTIONS_ONLY = FULL_ACTIONS.map((action) => action.value);

type Action = (typeof ACTIONS_ONLY)[number];

export default class TerminalHome extends Terminal {
  printWelcome() {
    const userName = process.env.USER || 'User';

    this.printContent([
      chalk.bold.greenBright(`Welcome ${userName}! 👋`),
      `📅 Today is ${new Date().toLocaleDateString('de')}. `,
      `🌧️ It is 4 degrees Celsus outside.`,
      '',
    ]);
    this.askForAction('HOME');
    // init news feed
    NewsFeed.getInstance().fetchFeed(
      'https://www.heise.de/rss/heise-top-alexa.xml'
    );
  }

  async printNews() {
    const topNews = NewsFeed.getInstance().getTopTitles(10);
    // Print the news and map them to { name: item.title, value: index }
    const pickedIndex = await select<number>({
      loop: false,
      message: 'Here are the latest news!',
      choices: topNews.map((item, index) => {
        return {
          name: `[${chalk.cyan(index + 1)}] ${item.title}`,
          value: index,
        };
      }),
    });

    const pickedNews = topNews[pickedIndex];

    const contentToPrint = [
      chalk.bgBlueBright.bold(pickedNews.title),
      chalk.blue(pickedNews.content),
      chalk.italic(pickedNews.link),
    ];

    if (pickedNews.isoDate) {
      contentToPrint.unshift(
        chalk.italic.underline(
          new Date(pickedNews.isoDate).toLocaleDateString('de')
        )
      );
    }

    this.printContent(contentToPrint);

    const answer = await select<'HOME' | 'OPEN'>({
      message: 'What now?',
      choices: [
        {
          name: 'Open Article in Browser',
          value: 'OPEN',
        },
        FULL_ACTIONS[4],
      ],
    });

    if (answer === 'OPEN') exec(`open ${pickedNews.link}`);
    this.askForAction('HOME');
  }

  async askForAction(action: Action) {
    switch (action) {
      case 'HOME':
        // Mainmenu
        const action = await select<Action>({
          message: 'What u wanna do?',
          choices: FULL_ACTIONS,
        });
        this.askForAction(action);
        break;
      case 'NEWS':
        this.printNews();
        break;
      case 'RADIO':
        // Start the radio
        radioPlayer.play('http://cdn.nrjaudio.fm/adwz1/de/56248/mp3_128.mp3');
        this.askForAction('HOME');
        break;
      case 'RADIO_STOP':
        radioPlayer.stop();
        this.askForAction('HOME');
        break;
      case 'EXIT':
        this.printContent('Byeee......🦭');
        radioPlayer.stop();
        process.exit(0);
    }
  }
}
