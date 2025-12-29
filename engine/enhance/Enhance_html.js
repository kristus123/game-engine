export function Enhance_html() {
	Enhance(HTMLElement, 'changeText', function (text) {
		this.textContent = text
	})

	Enhance(HTMLElement, 'remove', function () {
		Html.remove(this)
	})

	Enhance(HTMLElement, 'show', function () {
		Html.show(this)
	})

	Enhance(HTMLElement, 'hide', function () {
		Html.hide(this)
	})

	Enhance(HTMLElement, 'enable', function () {
		Html.enable(this)
	})

	Enhance(HTMLElement, 'disable', function () {
		Html.disable(this)
	})

	Enhance(HTMLElement, 'onClick', function (run) {
		Html.onClick(this, run)
	})

	Enhance(HTMLElement, 'add',  function (elements) {
		Html.removeChildElements(this)
		Html.append(this, elements)
	})

	Enhance(HTMLElement, 'push', function (elements) {
		Html.append(this, elements)
	})
}
