const { spawn } = require('child_process');


module.exports = class {
  constructor(command) {
    this.command = command;
    this.process = null;
  }

  start() {
    if (this.process) this.stop();

    const [cmd, ...args] = this.command.split(' ');
    this.process = spawn(cmd, args, { stdio: 'inherit' });

    this.process.on('exit', (code) => {
      this.process = null;
      console.log(`Process exited with code ${code}`);
    });

    this.process.on('error', (err) => {
      console.error('Process error:', err);
    });
  }

  stop() {
    if (this.process) {
      this.process.kill('SIGKILL');
      this.process = null;
      console.log('Process killed');
    }
  }

	restart() {
		this.stop()
		this.start()
	}
}


