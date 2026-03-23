export function Enhance_js_String() {

	Getter(String, 'uniqueWords', function() {
		return [...new Set(this.split(/\s+/))]
	})
}
