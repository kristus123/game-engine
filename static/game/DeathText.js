export class DeathText {
	constructor(text = 'Good job!', duration = 2000) {
	}

	show() {
		const e = Html.addToScreen(HtmlElement('div', 'death show'))

		e.textContent = this.text

		setTimeout(() => {
			e.classList.remove('show')

			e.addEventListener('transitionend', () => {
				Html.remove(e)
			})

		}, this.duration)
	}
}
