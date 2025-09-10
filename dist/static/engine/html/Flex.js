import { Html } from '/static/engine/html/Html.js'; 

export class Flex {

	static container(elements) {
		return Html.div('flex-container', elements.map(e => this.item([e])))
	}

	static item(elements) {
		return Html.div('flex-item', elements)
	}
}
