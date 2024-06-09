export class LoadingScreen {
	static show(text = 'Loading...') {
		document.getElementById('loading_screen').style.display = 'flex'
		document.getElementById('loading_text').innerText = text
	}

	static close() {
		document.getElementById('loading_screen').style.display = 'none'
	}
}

