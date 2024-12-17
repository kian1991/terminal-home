import { ChildProcess, spawn } from 'child_process';

// Handle cleanup
class RadioPlayer {
  private player: ChildProcess | null = null;

  play(url: string) {
    this.stop();
    this.player = spawn('mpv', [url]);

    process.on('SIGINT', () => {
      this.stop();
      process.exit(0);
    });
  }
  stop() {
    if (this.player) {
      this.player.kill();
      this.player = null;
    }
  }
}

// Singleton Pattern
let radioPlayerInstance: RadioPlayer | null = null;

function getInstance() {
  if (radioPlayerInstance === null) {
    radioPlayerInstance = new RadioPlayer();
  }
  return radioPlayerInstance;
}

export default getInstance();
