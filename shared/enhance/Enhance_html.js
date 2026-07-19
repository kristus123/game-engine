export function Enhance_html() {

	Enhance(HTMLElement.prototype, "forEach", function (callback) {
		const children = this.children

		for (let i = 0; i < children.length; i++) {
			callback(children[i], i, this)
		}

		return this
	})

	Getter(HTMLElement.prototype, "tag", function () {
		return this.tagName.toLowerCase()
	})

	Getter(HTMLElement.prototype, "width", function () {
		return this.getBoundingClientRect().width
	})

	Getter(HTMLElement.prototype, "height", function () {
		return this.getBoundingClientRect().height
	})

	Enhance(HTMLElement.prototype, "orderBasedOnMousePosition", function (draggedItem) { // Not the best name.

		const items = [...this.children].filter(c => c != draggedItem)

		const nextItem = items.find(i => {
			const r = i.getBoundingClientRect()

			if (this.tag == "flex-v") {
				return DomMouse.y < r.top + r.height / 2
			}
			else if (this.tag == "flex-h") {
				return DomMouse.x < r.left + r.width / 2
			}
			else {
				throw new Error("unsupported thing")
			}
		})

		if (nextItem) {
			this.insertBefore(draggedItem, nextItem)
		}
		else {
			this.appendChild(draggedItem)
		}
	})

	Getter(HTMLElement.prototype, "last", function () {
		if (this.empty) {
			throw new Error("can't get last element if list is empty")
		}
		else {
			return this.children[this.children.length - 1]
		}
	})

	Enhance(HTMLElement.prototype, "splitWords", function () {
		const walker = document.createTreeWalker(
			this,
			NodeFilter.SHOW_TEXT
		)

		const textNodes = []

		while (walker.nextNode()) {
			textNodes.push(walker.currentNode)
		}

		for (const node of textNodes) {
			const text = node.nodeValue

			// skip whitespace-only nodes
			if (!text.trim()) {
				continue
			}

			const frag = document.createDocumentFragment()

			const tokens = text.split(/(\s+)/)

			for (const token of tokens) {
				if (!token) {
					continue
				}

				if (/\s+/.test(token)) {
					frag.appendChild(document.createTextNode(token))
					continue
				}

				const span = document.createElement("span")
				span.className = "word"
				span.textContent = token

				frag.appendChild(span)
			}

			node.replaceWith(frag)
		}

		return this
	})

	Enhance(HTMLElement.prototype, "splitLetters", function () {
		this.splitWords()

		this.querySelectorAll("span.word").forEach(word => {
			// only split spans we created
			if (word.dataset.splitLetters) {
				return
			}

			const text = word.textContent
			word.textContent = ""

			const frag = document.createDocumentFragment()

			for (let i = 0; i < text.length; i++) {
				const span = document.createElement("span")
				span.textContent = text[i]
				span.dataset.index = i

				frag.appendChild(span)
			}

			word.dataset.splitLetters = "true"
			word.appendChild(frag)
		})

		return this
	})

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

	Enhance(HTMLElement.prototype, "removeAllListeners", function () {
		this._listeners ??= []

		this._listeners.forEach(({ type, listener, options }) => {
			this.removeEventListener(type, listener, options)
		})

		if (this._listeners) {
			this._listeners.clear()
		}

		return this
	})

	Enhance(HTMLElement.prototype, "text", function (text) { // should be a get/set
		this.innerHTML = text
		return this
	})

	Getter(HTMLElement.prototype, "parent", function () {
		return this.parentElement
	})

	Enhance(HTMLElement.prototype, "onDragChild", function ({ onDrag, whileDragging, onDrop } = {}) {

		let draggedItem = null

		window.addEventListener("pointerdown", e => {
			draggedItem = e.target.closest("[draggable]") // it should also check that the draggable is inside of "this"
			// or maybe it can be replaced with this.addEventListener
			// right now it is scary and global

			if (draggedItem) {
				draggedItem.style.opacity = "0.5"
				e.target.setPointerCapture(e.pointerId)

				draggedItem.addAttribute("being-dragged") // only one element should have attribute 'being-dragged' at any given time
				onDrag(draggedItem)
			}
		})

		window.addEventListener("pointermove", e => {
			// or maybe it can be replaced with this.addEventListener
			// right now it is scary and global
			if (draggedItem) {
				whileDragging(draggedItem)

				const items = [...this.children].filter(c => c != draggedItem)

				const nextItem = items.find(i => {
					const r = i.getBoundingClientRect()
					return e.clientY < r.top + r.height / 2
				})

				if (nextItem) {
					this.insertBefore(draggedItem, nextItem)
				}
				else {
					this.appendChild(draggedItem)
				}
			}
		})

		const stopDrag = () => {
			if (draggedItem) {
				draggedItem.removeAttribute("being-dragged")
				draggedItem.style.opacity = "1"

				onDrop(draggedItem)
				draggedItem = null
			}
		}

		window.addEventListener("pointerup", e => {
			// or maybe it can be replaced with this.addEventListener
			// right now it is scary and global
			stopDrag()
		})

		window.addEventListener("pointercancel", () => {
			// or maybe it can be replaced with this.addEventListener
			// right now it is scary and global
			stopDrag()
		})

	})

	Enhance(HTMLElement.prototype, "replace", function (oldText, newText) {
		this.textContent.replace(oldText, newText)
	})

	Enhance(HTMLElement.prototype, "remove", function () {
		return Dom.remove(this)
	})

	Enhance(HTMLElement.prototype, "visible", function () {
		return this.css("visibility: visible;")
	})

	Enhance(HTMLElement.prototype, "invisible", function () {
		return this.css("visibility: hidden;")
	})

	Enhance(HTMLElement.prototype, "closestDraggable", function () {
		return this.closest("[draggable]")
	})

	Enhance(HTMLElement.prototype, "offset_x", function (amount) {
		this.css(`transform: translateX(${amount}px); position: relative;`) // position relative might be possible to remove
		return this
	})

	Enhance(HTMLElement.prototype, "offset_y", function (amount) {
		this.css(`transform: translateY(${amount}px); position: relative;`) // position relative might be possible to remove
		return this
	})

	Enhance(HTMLElement.prototype, "transformPosition", function (p) {
		this.style.transform = `translate(${p.x}px, ${p.y}px)`
	})

	Enhance(HTMLElement.prototype, "clear", function () {
		if (this.tag == "input") {
			this.value = ""
		}
		else {
			throw new Error("unsupported: " + this.tag + " - you need to explcititly tell how this.clear should work")
		}
	})

	Enhance(HTMLElement.prototype, "removeChildren", function () {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
	})

	Enhance(HTMLElement.prototype, "show", function (animationClassName) {
		// make it trigger this if it is modal
		// this.showModal()

		this.removeAttribute("hidden")

		if (animationClassName) {
			this.animate(animationClassName)
		}

		return this
	})

	Enhance(HTMLElement.prototype, "hide", function (animationClassName) {
		// if modal
		// d.close()

		if (animationClassName) {
			this.animate(animationClassName, {
				onEnd: () => {
					this.addAttribute("hidden")
				},
			})
		}
		else {
			this.addAttribute("hidden")
		}

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
		if (this.disabled) {
			this.removeAttribute("disabled")
			this.disabled = false
		}

	})

	Getter(HTMLElement.prototype, "enabled", function () {
		return !this.hasAttribute("disabled")
	})

	Getter(HTMLElement.prototype, "disabled", function () {
		return this.hasAttribute("disabled")
	})

	Enhance(HTMLElement.prototype, "disable", function () {
		if (!this.disabled) {
			this.addAttribute("disabled")
			this.disabled = true
		}
	})

	Enhance(HTMLElement.prototype, "onClick", function (run) {
		this.removeListener("click")

		this.listen("click", () => {
			run(this)
		})

		return this
	})

	Enhance(HTMLElement.prototype, "onEnter", function (run) {
		this.removeListener("keydown")

		this.listen("keydown", (e) => {
			if (e.key == "Enter") {
				console.log("hei")
				run(this.value)
			}
		})

		return this
	})

	Enhance(HTMLElement.prototype, "set", function (elements) {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}


		for (const e of Always.list(elements)) {
			this.appendChild(e)
		}
	})

	Enhance(HTMLElement.prototype, "push", function (elements) {
		for (const e of Always.list(elements)) {
			this.appendChild(e)
		}
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

	Enhance(HTMLElement.prototype, "addCssVariable", function (key, value) {
		this.style.setProperty(`--${key}`, value)
		return this
	})

	Enhance(HTMLElement.prototype, "css", function (newCss) {
		this.style.cssText += newCss
		return this
	})

	Enhance(HTMLElement.prototype, "animate", function (className, { variables={}, onStart, onEnd } = {}) {
		// Clean up any existing animation on this element
		if (this._animClassName) {
			this.classList.remove(this._animClassName)
			if (this._animHandleStart) {
				this.removeEventListener("animationstart", this._animHandleStart)
			}
			if (this._animHandleEnd) {
				this.removeEventListener("animationend", this._animHandleEnd)
			}
		}

		const uuid = crypto.randomUUID()

		if (variables) {
			for (const [name, value] of Object.entries(variables)) {
				this.addCssVariable(name, value)
			}
		}

		this.classList.add(className)
		this.dataset.uuid = uuid

		const handleStart = (e) => {
			if (this == e.target && this.dataset.uuid == uuid) {
				console.log("sstart")
				onStart?.(e)
			}
		}

		const handleEnd = e => {
			if (
				this == e.target &&
				(e.animationName ?? "") == className &&
				this.dataset.uuid == uuid
			) {
				console.log("end")
				onEnd?.(e)

				this.classList.remove(className)
				delete this.dataset.uuid

				this.removeEventListener("animationstart", handleStart)
				this.removeEventListener("animationend", handleEnd)

				this._animClassName = null
				this._animHandleStart = null
				this._animHandleEnd = null
			}
		}

		this._animClassName = className
		this._animHandleStart = handleStart
		this._animHandleEnd = handleEnd

		this.addEventListener("animationstart", handleStart)
		this.addEventListener("animationend", handleEnd)

		return this
	})

	Enhance(HTMLElement.prototype, "worldPosition", function (position) {
		Assert.value(position)

		const p = Camera.p(position)
		this.style.left = `${p.x}px`
		this.style.top = `${p.y}px`

		return this
	})

	Enhance(HTMLElement.prototype, "followMouse", function (offset_x=0, offset_y=0) {

		this.style.left = `${DomMouse.x + offset_x}px`
		this.style.top = `${DomMouse.y + offset_y}px`

		return this
	})

	Enhance(HTMLElement.prototype, "floating", function () {
		//assert that class is not already present
		this.addClass("floating")
		return this
	})

	Enhance(HTMLElement.prototype, "overlay", function () {
		//assert that class is not already present
		this.addClass("overlay")
		return this
	})

	Setter(HTMLElement.prototype, "x", {
		get() {
			return parseFloat(this.style.left) || 0
		},
		set(x) {
			this.style.left = `${x}px`
		},
	})

	Setter(HTMLElement.prototype, "y", {
		get() {
			return parseFloat(this.style.top) || 0
		},
		set(y) {
			this.style.top = `${y}px`
		},
	})

	Setter(HTMLElement.prototype, "position", {

		get() {
			if (this._position) { // todo set position field beforehand
				return this._position
			}
			else {
				this._position = WorldPosition(this.x, this.y)
			}
		},
		set(p) {
			this._position = p
		},
	})

}
