import { List } from '/static/engine/List.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { HtmlElement } from '/static/engine/html/HtmlElement.js'; 

export class DeathText {
	constructor(text = 'Good job!', duration = 2000) {

				AssertNotNull(text, "argument text in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(duration, "argument duration in " + this.constructor.name + ".js should not be null")
			
		this.text = text; 
		this.duration = duration; 

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
