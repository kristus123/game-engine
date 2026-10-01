export function EnhanceBackend() {
	Enhance_js_Array()
	Enhance_js_Object()
	Enhance_js_Number()
	Enhance_js_String()
	Enhance_js_Float32Array()

	if (typeof Blob != "undefined") {
		Enhance_js_Blob()
	}
}
