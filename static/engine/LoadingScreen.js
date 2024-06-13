const loading_screen = document.getElementById('loading_screen')

export class LoadingScreen {
	static show(text = 'Loading...') {

		const p = Html.p(text)
		loading_screen.appendChild(p)

		loading_screen.style.display = 'flex'
	}

	static close() {
		loading_screen.style.display = 'none'
		Html.removeChildElementsInId('loading_screen')
	}
}
