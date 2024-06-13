export class LoadingScreen {
	static show(text = 'Loading...') {
		const div = document.getElementById('loading_screen')

		const p = Html.p(text)
		div.appendChild(p)

		div.style.display = 'flex'
	}

	static close() {
		document.getElementById('loading_screen').style.display = 'none'
		Html.removeChildElementsInId('loading_screen')
	}
}

