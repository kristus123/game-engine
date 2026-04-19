export function Enhance_html() {


	Enhance(HTMLElement.prototype, "listen", function (type, listener, options) {
		this._listeners ??= []

		this._listeners.push({ type, listener, options })
		this.addEventListener(type, listener, options)

		return this
	})

	Enhance(HTMLElement.prototype, "removeListener", function (typeToRemove) {
		this._listeners ??= []

		this._listeners.forEach(({ type, listener, options }) => {
			if (type == typeToRemove) {
				this.removeEventListener(type, listener, options)
			}
		})

		return this
	})

	Enhance(HTMLElement.prototype, "removeListeners", function () {
		this._listeners ??= []

		this._listeners.forEach(({ type, listener, options }) => {
			this.removeEventListener(type, listener, options)
		})

		if (this._listeners) {
			this._listeners.clear()
		}

		return this
	})

	Enhance(HTMLElement.prototype, "text", function (text) {
		this.textContent = text
		return this
	})

	Enhance(HTMLElement.prototype, "replace", function (oldText, newText) {
		this.textContent.replace(oldText, newText)
	})

	Enhance(HTMLElement.prototype, "remove", function () {
		Html.remove(this)
	})

	Enhance(HTMLElement.prototype, "offset_y", function (amount) {
		this.css(`transform: translateY(${amount}px); position: relative;`)
		return this
	})

	Enhance(HTMLElement.prototype, "offset_x", function (amount) {
		this.css(`transform: translateX(${amount}px); position: relative;`)
		return this
	})

	Enhance(HTMLElement.prototype, "clear", function () {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
	})

	Enhance(HTMLElement.prototype, "show", function () {
		this.removeAttribute("hide")
		return this
	})

	Enhance(HTMLElement.prototype, "hide", function () {
		this.addAttribute("hide")
		return this
	})

	// removeAttribute already exists
	Enhance(HTMLElement.prototype, "addAttribute", function (name) {
		this.setAttribute(name, "")
		return this
	})

	Enhance(HTMLElement.prototype, "ids", function() {
		return Array.from(this.querySelectorAll("[id]")).map(e => e.id)
	})

	Enhance(HTMLElement.prototype, "getId", function(id) {
		return Assert.value(this.querySelector(`#${id}`))
	})

	Enhance(HTMLElement.prototype, "fontSize", function (size) {
		this.css(`font-size: ${size};`)
		return this
	})

	Enhance(HTMLElement.prototype, "enable", function () {
		Html.enable(this)
	})

	Getter(HTMLElement.prototype, "enabled", function () {
		return !this.hasAttribute("disabled")
	})

	Getter(HTMLElement.prototype, "disabled", function () {
		return this.hasAttribute("disabled")
	})

	Enhance(HTMLElement.prototype, "disable", function () {
		Html.disable(this)
	})

	Enhance(HTMLElement.prototype, "onClick", function (run) {
		this.removeListener("click")

		this.listen("click", () => {
			run(this)
		})

		return this
	})

	Enhance(HTMLElement.prototype, "set", function (elements) {
		Html.removeChildElements(this)
		Html.append(this, elements)
	})

	Enhance(HTMLElement.prototype, "push", function (elements) {
		Html.append(this, elements)
	})

	Enhance(HTMLElement.prototype, "add", function (elements) {
		for (const e of Always.list(elements)) {
			this.appendChild(e)
		}
	})

	Enhance(HTMLElement.prototype, "contains", function (className) {
		this.classList.contains(className)
	})

	Enhance(HTMLElement.prototype, "addClass", function (className) {
		for (const cc of Always.list(className)) {
			for (const c of cc.split(" ")) {
				this.classList.add(c)
			}
		}

		return this
	})

	Enhance(HTMLElement.prototype, "removeClass", function (className) {
		this.classList.remove(className)
		return this
	})

	Enhance(HTMLElement.prototype, "css", function (newCss) {
		this.style.cssText += newCss
		return this
	})

	Enhance(HTMLElement.prototype, "animate", function (className, onEnd = () => {}) {
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

	Enhance(HTMLElement.prototype, "domFloat", function (position = null) {

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

	Enhance(HTMLElement.prototype, "dom", function () {
		Dom.add(this)
		return this
	})

	Enhance(HTMLElement.prototype, "removeFromDom", function () {
		Dom.remove(this)
		return this
	})

}
