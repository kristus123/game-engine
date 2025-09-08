// doesn't behave same on phone and pc

export class Microphone {
	constructor() {
		if ('webkitSpeechRecognition' in window) {
			const recognition = new webkitSpeechRecognition()
			recognition.lang = 'en-US'
			recognition.continuous = true // Keep listening even after speech pauses
			recognition.interimResults = true // Show partial results while speaking
			recognition.start()

			recognition.onresult = (e) => {
				let transcript = ''
				for (let i = e.resultIndex; i < e.results.length; i++) {
					transcript += e.results[i][0].transcript
				}
				this.transcript = transcript
			}

			recognition.onerror = function(e) {
				console.error('Speech recognition error', e.error)
			}
		}
		else {
			alert('Speech recognition is not supported in your browser.')
		}
	}

	update() {
	}

	draw(draw) {
		draw.text(new Position(0, 0), this.transcript)
	}
}

