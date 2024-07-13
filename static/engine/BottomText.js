export class BottomText {
	constructor() {
	}

	static show(text) {

		const overlayText = document.createElement('p')
		overlayText.className = 'bottom-text'
		overlayText.textContent = text

		document.body.appendChild(overlayText);
	}

	static remove() {
		const overlayDiv = document.querySelector('.bottom-text');
		if (overlayDiv) {
			document.body.removeChild(overlayDiv);
		}
	}

}
