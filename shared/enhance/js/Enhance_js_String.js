export class Enhance_js_String extends NativeEnhancer {

	constructor() {
		super(String.prototype)
	}

	get uniqueWords() {
		return [...new Set(this.split(/\s+/))]
	}

	contains(subString) {
		return this.includes(subString)
	}

	isDue() {
		return new LocalDate(this).isDue()
	}

	toOneLine(separator=" ") {
		return this.replace(/\r?\n/g, separator)
	}

	beforePunctuation() {
		return this.split(/[.,?]/)[0]
	}

	toHtml() {
		console.warn("toHtml() is buggy and not standardized yet, currently it returns firstchild")
		return new DOMParser() // .innerHTML is also an option
			.parseFromString(this, "text/html")
			.body
			.firstChild
	}

	dedent() { // todo might be buggy
		const string = this.replace(/^\n|\n\s*$/g, "")

		const amount = string.match(/^[ \t]*/)[0].length

		return string
			.split("\n")
			.map(line => line.slice(amount))
			.join("\n")
	}

}
