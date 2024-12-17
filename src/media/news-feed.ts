import Parser from 'rss-parser';

export class NewsFeed {
  private parser: Parser | undefined;
  private static newsFeedInstance: NewsFeed | null = null;
  public feed: Parser.Output<{ [key: string]: any }> | undefined;

  private constructor() {}

  static getInstance() {
    if (this.newsFeedInstance === null) {
      this.newsFeedInstance = new NewsFeed();
    }
    return this.newsFeedInstance;
  }

  async fetchFeed(url: string) {
    if (!this.parser) this.parser = new Parser();
    try {
      this.feed = await this.parser.parseURL(url);
      return this.feed;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getTopTitles(n: number = 5) {
    if (!this.feed?.items)
      throw Error(
        'No Feed has been initilized, please use fetchFeed before printing Titles'
      );

    const copy = [...this.feed.items];
    const topNTitles = copy.splice(0, n);
    return topNTitles;
  }
}
