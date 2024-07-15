export class Clipboard {

	static copyText() {
		var textToCopy = 'hello\nhow are you\ni\'m good'

		navigator.clipboard.writeText(textToCopy)
			.then(function() {
				console.log('Text copied to clipboard!')
			})
			.catch(function(err) {
				console.error('Unable to copy text to clipboard', err)
			})
	}
}
