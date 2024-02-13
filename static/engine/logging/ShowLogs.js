export class ShowLogs {
	constructor(guiPalette, maxMessages = 5, consoleHeight = 200) {
		this.consoleMessages = []

		console.log = (message) => {
			this.consoleMessages.push(message)

			if (this.consoleMessages.length > maxMessages) {
				this.consoleMessages.shift()
			}
		}

		setInterval(() => {
			console.log('')
		}, 1000)
	}

	draw() {
		this.guiPalette.ctx.fillStyle = '#000'
		this.guiPalette.ctx.fillRect(0, this.guiPalette.canvas.height - this.consoleHeight, 500, this.consoleHeight)

		this.guiPalette.ctx.fillStyle = '#fff'
		this.guiPalette.ctx.font = '16px Arial'
		for (let i = 0; i < this.consoleMessages.length; i++) {
			this.guiPalette.ctx.fillText(this.consoleMessages[i], 10, this.guiPalette.canvas.height - this.consoleHeight + 20 + i * 20)
		}
	}
}

