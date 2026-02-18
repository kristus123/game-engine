const bar = Html.div("lower-center-ui progress-container", [
	Html.div("progress-bar"),
])

Html.hide(bar)

export class HtmlProgressBar {

	static progress = 0

	static create() {
		Html.show(bar)
	}

	static change(increase) {
		this.progress += increase

		let progressBar = document.getElementsByClassName("progress-bar")[0]
		progressBar.style.width = this.progress + "%"
		progressBar.textContent = this.progress + "%"
	}

	static remove() {
		Html.hide(bar)
	}
}


