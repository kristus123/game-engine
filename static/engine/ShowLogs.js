export class ShowLogs {
  constructor(palette, maxMessages = 10) {
	this.canvas = palette.canvas
	this.ctx = palette.ctx
	this.maxMessages = maxMessages;
	this.consoleMessages = [];

	// Redirect console.log to addToConsole
	this.redirectConsole();
  }

  redirectConsole() {
	const self = this;
	console.log = function(message) {
	  self.addToConsole(message);
	  // Optionally, you can also log to the browser console
	  originalConsoleLog(message);
	};

	// Save the original console.log
	this.originalConsoleLog = console.log;
  }

  addToConsole(message) {
	this.consoleMessages.push(message);

	// Keep only the last maxMessages messages for display
	if (this.consoleMessages.length > this.maxMessages) {
	  this.consoleMessages.shift();
	}

	// Redraw the console
	this.drawConsole();
  }

  drawConsole() {
	this.ctx.fillStyle = '#000';
	this.ctx.fillRect(0, this.canvas.height - 60, this.canvas.width, 60);

	this.ctx.fillStyle = '#fff';
	this.ctx.font = '16px Arial';
	for (let i = 0; i < this.consoleMessages.length; i++) {
	  this.ctx.fillText(this.consoleMessages[i], 10, this.canvas.height - 30 + i * 20);
	}
  }
}
