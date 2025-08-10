import { Palette } from '/static/engine/Palette.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class ShowLogs {
	constructor(guiPalette, maxMessages = 10, consoleHeight = 200) {

				AssertNotNull(guiPalette, "argument guiPalette in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(maxMessages, "argument maxMessages in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(consoleHeight, "argument consoleHeight in " + this.constructor.name + ".js should not be null")
			
		this.guiPalette = guiPalette; 
		this.maxMessages = maxMessages; 
		this.consoleHeight = consoleHeight; 

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
		this.guiPalette.ctx.fillRect(0, Palette.height - this.consoleHeight, 500, this.consoleHeight)

		this.guiPalette.ctx.fillStyle = '#fff'
		this.guiPalette.ctx.font = '16px Arial'
		for (let i = 0; i < this.consoleMessages.length; i++) {
			this.guiPalette.ctx.fillText(this.consoleMessages[i], 10, Palette.height - this.consoleHeight + 20 + i * 20)
		}
	}
}

