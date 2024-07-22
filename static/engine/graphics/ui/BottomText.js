export class BottomText {
	constructor() {
	}

	static show(text, removeAfterMs=null) {

		const overlayText = document.createElement('p')
		overlayText.className = 'bottom-text'
		overlayText.textContent = text

		document.body.appendChild(overlayText)

		if (removeAfterMs) {
			setTimeout(() => {
				this.remove()
			}, removeAfterMs);
		}
	}

	static remove() {
		const overlayDiv = document.querySelector('.bottom-text')
		if (overlayDiv) {
			document.body.removeChild(overlayDiv)
		}
	}

}
