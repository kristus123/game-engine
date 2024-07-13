export class BottomText {
	constructor() {
	}

	static show(text) {
		const overlayDiv = document.createElement('div');
		overlayDiv.className = 'pokemon-overlay';

		const overlayText = document.createElement('p');
		overlayText.textContent = text

		overlayDiv.appendChild(overlayText);

		document.body.appendChild(overlayDiv);
	}

	static remove() {
		const overlayDiv = document.querySelector('.pokemon-overlay');
		if (overlayDiv) {
			document.body.removeChild(overlayDiv);
		}
	}

}
