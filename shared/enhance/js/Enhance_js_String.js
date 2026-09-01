export function Enhance_js_String() {

	Getter(String.prototype, "uniqueWords", function() {
		return [...new Set(this.split(/\s+/))]
	})

	Enhance(String.prototype, "contains", function(subString) {
		return this.includes(subString)
	})

	Enhance(String.prototype, "toOneLine", function(separator=" ") {
		return this.replace(/\r?\n/g, separator)
	})

	Enhance(String.prototype, "beforePunctuation", function() {
		return this.split(/[.,?]/)[0]
	})

	Enhance(String.prototype, "toHtml", function() {
		console.warn("toHtml() is buggy and not standardized yet, currently it returns firstchild")
		return new DOMParser() // .innerHTML is also an option
			.parseFromString(this, "text/html")
			.body
			.firstChild
	})

	Enhance(String.prototype, "dedent", function() {
		const string = this.replace(/^\n|\n\s*$/g, "")

		const amount = string.match(/^[ \t]*/)[0].length

		return string
			.split("\n")
			.map(line => line.slice(amount))
			.join("\n")
	})

}
