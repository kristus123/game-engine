function _register(tagName) {
	class EmptyElement extends HTMLElement {}
	customElements.define(tagName, EmptyElement)
}

export function Enhance_html_WebComponents() {
	_register("phone-layout")
	_register("p-top")
	_register("p-mid")
	_register("p-bot")

	_register("flex-h")
	_register("flex-v")
	_register("f-i")
	_register("f-e")

	customElements.define("video-div", VideoDiv)
}
