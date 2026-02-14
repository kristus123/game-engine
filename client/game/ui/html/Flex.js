export class Flex {

	static row(elements) {
		return Html.div('flex-row', elements.map(e => this.item([e])))
	}

	static column(elements) {
		return Html.div('flex-column', elements.map(e => this.item([e])))
	}

	static h(elements) {
		return this.row(elements)
	}

	static v(elements) {
		return this.column(elements)
	}

	static item(elements) {
		return Html.div('flex-item', elements)
	}
}
