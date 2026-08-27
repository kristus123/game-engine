export function Enhance_html_collection() {

	Enhance(HTMLCollection.prototype, "except", function (e) {
		return [...this].filter(c => c != e)
	})

	Enhance(HTMLCollection.prototype, "find", function (...args) {
		return Array.from(this).find(...args)
	})

	Enhance(HTMLCollection.prototype, "filter", function (...args) {
		return Array.from(this).filter(...args)
	})

	Enhance(HTMLCollection.prototype, "forEach", function (...args) {
		return Array.from(this).forEach(...args)
	})

	Enhance(HTMLCollection.prototype, "map", function (...args) {
		return Array.from(this).map(...args)
	})

	Getter(HTMLCollection.prototype, "last", function () {
		return this[this.length - 1]
	})


}
