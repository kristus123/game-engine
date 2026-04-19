export function Enhance_js_String() {

	Getter(String.prototype, "uniqueWords", function() {
		return [...new Set(this.split(/\s+/))]
	})
}
