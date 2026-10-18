export function EnhanceBackend() {
	new Enhance_js_Array()
	new Enhance_js_Object()
	new Enhance_js_Number()
	new Enhance_js_String()
	new Enhance_js_Float32Array()

	if (typeof Blob != "undefined") {
		new Enhance_js_Blob()
	}
}
