export class Clipboard {
	constructor() {

	}

	static paste(text) {
		navigator.clipboard.writeText(text)
			.then(function() {
				console.log('Text copied to clipboard!')
			})
			.catch(function(err) {
				console.error('Unable to copy text to clipboard: ' + err)
			})
	}
}
