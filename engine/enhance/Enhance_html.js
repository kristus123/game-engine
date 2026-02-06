export function Enhance_html() {
	Enhance(HTMLElement, 'changeText', function (text) {
		this.textContent = text
	})

	Enhance(HTMLElement, 'remove', function () {
		Html.remove(this)
	})

	Enhance(HTMLElement, 'clear', function () {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
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

	Enhance(HTMLElement, 'set', function (elements) {
		Html.removeChildElements(this)
		Html.append(this, elements)
	})

	Enhance(HTMLElement, 'push', function (elements) {
		Html.append(this, elements)
	})

	Enhance(HTMLElement, 'add', function (elements) {
		Html.append(this, elements)
	})

	Enhance(HTMLElement, 'addClass', function (className) {
		this.classList.add(className)
		return this
	})

	Enhance(HTMLElement, 'removeClass', function (className) {
		this.classList.remove(className)
		return this
	})

	Enhance(HTMLElement, 'animate', function (className, onEnd = () => {}) {
		this.addClass(className)

		this.addEventListener('animationstart', () => {
		})

		this.addEventListener('animationend', () => {
			// this.removeClass(className)
			this.remove()

			onEnd()
		})

		return this
	})

	Enhance(HTMLElement, 'floating', function () {
		this.addClass('floating')
		return this
	})

	Enhance(HTMLElement, 'dom', function () {
		Dom.add(this)
		return this
	})

	// used togeter with e.floating()
	Enhance(HTMLElement, 'position', function (p) {
		p = Camera.p(p) // todo imrpoveo ofc

		this.style.left = `${p.x}px`
		this.style.top = `${p.y}px`

		return this
	})

}


