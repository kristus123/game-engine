export class Microphone {
	constructor() {
		if ('webkitSpeechRecognition' in window) {
			const recognition = new webkitSpeechRecognition()
			recognition.lang = 'en-US'
			recognition.continuous = true // Keep listening even after speech pauses
			recognition.interimResults = true // Show partial results while speaking
			recognition.start()

			// Handle results
			recognition.onresult = function(event) {
				let transcript = ''
				for (let i = event.resultIndex; i < event.results.length; i++) {
					transcript += event.results[i][0].transcript
				}
				console.log(transcript)
			}

			recognition.onerror = function(event) {
				console.error('Speech recognition error', event.error)
			}
		}
		else {
			alert('Speech recognition is not supported in your browser.')
		}
	}
}
