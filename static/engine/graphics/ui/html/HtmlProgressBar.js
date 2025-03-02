export class HtmlProgressBar {

	static progress = 0


	static create() {
		return Html.div('progress-container', [
			Html.div('progress-bar')
		])
	}

	static change(increase) {
		this.progress += increase

		let progressBar = document.getElementsByClassName('progress-bar')[0]
		progressBar.style.width = this.progress + '%'
		progressBar.textContent = this.progress + '%'
	}

}


