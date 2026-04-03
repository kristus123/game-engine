export function Enhance_html() {


	Enhance(HTMLElement, "listen", function (type, listener, options) {
		this._listeners ??= []

		this._listeners.push({ type, listener, options })
		this.addEventListener(type, listener, options)

		return this
	})

	Enhance(HTMLElement, "removeListeners", function () {
		this._listeners.forEach(({ type, listener, options }) => {
			this.removeEventListener(type, listener, options)
		})

		if (this._listeners) {
			this._listeners.clear()
		}

		return this
	})

	Enhance(HTMLElement, "text", function (text) {
		this.textContent = text
	})

	Enhance(HTMLElement, "remove", function () {
		Html.remove(this)
	})

	Enhance(HTMLElement, "offset_y", function (amount) {
		this.css(`transform: translateY(${amount}px); position: relative;`)
		return this
	})

	Enhance(HTMLElement, "offset_x", function (amount) {
		this.css(`transform: translateX(${amount}px); position: relative;`)
		return this
	})

	Enhance(HTMLElement, "clear", function () {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
	})

	Enhance(HTMLElement, "show", function () {
		Html.show(this)
	})

	Enhance(HTMLElement, "hide", function () {
		Html.hide(this)
	})

	Enhance(HTMLElement, "id", function(id) {
		const e = this.querySelector(`#${id}`)
		return Assert.notNull(e, "Could not find id=" + id)
	})

	Enhance(HTMLElement, "fontSize", function (size) {
		this.css(`font-size: ${size};`)
		return this
	})

	Enhance(HTMLElement, "enable", function () {
		Html.enable(this)
	})

	Enhance(HTMLElement, "disable", function () {
		Html.disable(this)
	})

	Enhance(HTMLElement, "onClick", function (run) {
		this.listen("click", () => {
			run()
		})

		return this
	})

	Enhance(HTMLElement, "set", function (elements) {
		Html.removeChildElements(this)
		Html.append(this, elements)
	})

	Enhance(HTMLElement, "push", function (elements) {
		Html.append(this, elements)
	})

	Enhance(HTMLElement, "add", function (elements) {
		for (const e of Always.list(elements)) {
			this.appendChild(e)
		}
	})

	Enhance(HTMLElement, "contains", function (className) {
		this.classList.contains(className)
	})

	Enhance(HTMLElement, "addClass", function (className) {
		for (const cc of Always.list(className)) {
			for (const c of cc.split(" ")) {
				this.classList.add(c)
			}
		}

		return this
	})

	Enhance(HTMLElement, "removeClass", function (className) {
		this.classList.remove(className)
		return this
	})

	Enhance(HTMLElement, "css", function (newCss) {
		this.style.cssText += newCss
		return this
	})

	Enhance(HTMLElement, "animate", function (className, onEnd = () => {}) {
		this.addClass(className)

		this.addEventListener("animationstart", () => {
		})

		this.addEventListener("animationend", () => {
			// this.removeClass(className)
			this.remove()

			onEnd()
		})

		return this
	})

	Enhance(HTMLElement, "domFloat", function (position = null) {

		if (!document.contains(this)) {
			this.dom()
			this.addClass("domFloat")
		}

		if (position) {
			const p = Camera.p(position) // todo improve ofc

			this.style.left = `${p.x}px`
			this.style.top = `${p.y}px`
		}

		return this
	})

	Enhance(HTMLElement, "dom", function () {
		Dom.add(this)
		return this
	})

}
