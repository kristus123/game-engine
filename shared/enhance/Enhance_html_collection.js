export function Enhance_html_collection() {

	Enhance(HTMLCollection.prototype, "except", function (e) {
		return [...this].filter(c => c != e)
	})

	Enhance(HTMLCollection.prototype, "find", function (...args) {
		return Array.from(this).find(...args)
	})

}
