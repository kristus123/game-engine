import { Html } from '/static/engine/html/Html.js'; 
import { HtmlElement } from '/static/engine/html/HtmlElement.js'; 

export class DeathText {

	static show(text = 'Good job!', duration = 2000) {
		const e = Html.addToScreen(HtmlElement('div', 'death show'))

		e.textContent = text

		setTimeout(() => {
			e.classList.remove('show')

			e.addEventListener('transitionend', () => {
				Html.remove(e)
			})

		}, duration)
	}
}
