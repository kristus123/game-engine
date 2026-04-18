export function Enhance_html() {


	Enhance(HTMLElement, "listen", function (type, listener, options) {
		this._listeners ??= []

		this._listeners.push({ type, listener, options })
		this.addEventListener(type, listener, options)

		return this
	})

	Enhance(HTMLElement, "removeListener", function (typeToRemove) {
		this._listeners ??= []

		this._listeners.forEach(({ type, listener, options }) => {
			if (type == typeToRemove) {
				this.removeEventListener(type, listener, options)
			}
		})

		return this
	})

	Enhance(HTMLElement, "removeListeners", function () {
		this._listeners ??= []

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
		return this
	})

	Enhance(HTMLElement, "replace", function (oldText, newText) {
		this.textContent.replace(oldText, newText)
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
		this.removeAttribute("hide")
		return this
	})

	Enhance(HTMLElement, "hide", function () {
		this.addAttribute("hide")
		return this
	})

	// removeAttribute already exists
	Enhance(HTMLElement, "addAttribute", function (name) {
		this.setAttribute(name, "")
		return this
	})

	Enhance(HTMLElement, "ids", function() {
		return Array.from(this.querySelectorAll("[id]")).map(e => e.id)
	})

	Enhance(HTMLElement, "getId", function(id) {
		return Assert.value(this.querySelector(`#${id}`))
	})

	Enhance(HTMLElement, "fontSize", function (size) {
		this.css(`font-size: ${size};`)
		return this
	})

	Enhance(HTMLElement, "enable", function () {
		Html.enable(this)
	})

	Getter(HTMLElement.prototype, "enabled", function () {
		return !this.hasAttribute("disabled")
	})

	Getter(HTMLElement.prototype, "disabled", function () {
		return this.hasAttribute("disabled")
	})

	Enhance(HTMLElement, "disable", function () {
		Html.disable(this)
	})

	Enhance(HTMLElement, "onClick", function (run) {
		this.removeListener("click")

		this.listen("click", () => {
			run(this)
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
			this.style.left = `${position.x}px`
			this.style.top = `${position.y}px`
		}

		return this
	})

	Enhance(HTMLElement, "dom", function () {
		Dom.add(this)
		return this
	})

	Enhance(HTMLElement, "removeFromDom", function () {
		Dom.remove(this)
		return this
	})

}
