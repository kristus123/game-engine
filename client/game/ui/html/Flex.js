export class Flex {

	static row(elements) {
		return H.div("flex-row", elements.map(e => this.item([e])))
	}

	static column(elements) {
		return H.div("flex-column", elements.map(e => this.item([e])))
	}

	static h(elements) {
		return this.row(elements)
	}

	static v(elements) {
		return this.column(elements)
	}

	static item(elements) {
		return H.div("flex-item", elements)
	}
}
