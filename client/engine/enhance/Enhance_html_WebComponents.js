function _register(tagName) {
	class EmptyElement extends HTMLElement {}
	customElements.define(tagName, EmptyElement)
}

export function Enhance_html_WebComponents() {
	customElements.define("video-div", VideoDiv)
}
