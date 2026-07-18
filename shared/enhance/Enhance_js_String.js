export function Enhance_js_String() {

	Getter(String.prototype, "uniqueWords", function() {
		return [...new Set(this.split(/\s+/))]
	})

	Enhance(String.prototype, "contains", function(subString) {
		return this.includes(subString)
	})

	Enhance(String.prototype, "toHtml", function() {
		return new DOMParser() // .innerHTML is also an option
			.parseFromString(this, "text/html")
			.body.firstChild
	})
}
