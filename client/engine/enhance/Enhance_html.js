export function Enhance_html() {

	Enhance(HTMLElement.prototype, "forEach", function (callback) {
		const children = this.children

		for (let i = 0; i < children.length; i++) {
			callback(children[i], i, this)
		}

		return this
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

	Enhance(HTMLElement.prototype, "onDragChild", function ({ onDrag, whileDragging, onDrop } = {}) {

		let draggedItem = null

		window.addEventListener("pointerdown", e => {
			draggedItem = e.target.closest("[draggable]")

			if (draggedItem) {
				draggedItem.style.opacity = "0.5"
				e.target.setPointerCapture(e.pointerId)

				draggedItem.addAttribute("being-dragged")
				onDrag(draggedItem)
			}
		})

		window.addEventListener("pointermove", e => {
			if (draggedItem) {
				whileDragging(draggedItem)

				const items = [...this.children].filter(el => el != draggedItem)

				const nextItem = items.find(item => {
					const rect = item.getBoundingClientRect()
					return e.clientY < rect.top + rect.height / 2
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
			stopDrag()
		})

		window.addEventListener("pointercancel", () => {
			stopDrag()
		})

	})

	Enhance(HTMLElement.prototype, "replace", function (oldText, newText) {
		this.textContent.replace(oldText, newText)
	})

	Enhance(HTMLElement.prototype, "remove", function () {
		return Dom.remove(this)
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
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
	})

	Enhance(HTMLElement.prototype, "show", function () {
		this.removeAttribute("hidden")
		return this
	})

	Enhance(HTMLElement.prototype, "hide", function () {
		this.addAttribute("hidden")
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
		H.enable(this)
	})

	Getter(HTMLElement.prototype, "enabled", function () {
		return !this.hasAttribute("disabled")
	})

	Getter(HTMLElement.prototype, "disabled", function () {
		return this.hasAttribute("disabled")
	})

	Enhance(HTMLElement.prototype, "disable", function () {
		H.disable(this)
	})

	Enhance(HTMLElement.prototype, "onClick", function (run) {
		this.removeListener("click")

		this.listen("click", () => {
			run(this)
		})

		return this
	})

	Enhance(HTMLElement.prototype, "set", function (elements) {
		H.removeChildElements(this)
		H.append(this, elements)
	})

	Enhance(HTMLElement.prototype, "push", function (elements) {
		H.append(this, elements)
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
		const uuid = crypto.randomUUID()

		variables.forEach((key, value) => {
			this.addCssVariable(key, value)
		})

		this.classList.add(className)
		this.dataset.uuid = uuid

		const handleStart = (e) => {
			if (e.target != this) {
				return
			}
			if (this.dataset.uuid != uuid) {
				return
			}

			onStart?.(e)
		}

		const handleEnd = (e) => {
			if (e.target != this) {
				return
			}
			if (e.animationName && e.animationName != className) {
				return
			}
			if (this.dataset.uuid != uuid) {
				return
			}

			this.classList.remove(className)
			delete this.dataset.uuid

			this.removeEventListener("animationstart", handleStart)
			this.removeEventListener("animationend", handleEnd)

			// this.remove()
			onEnd?.(e)
		}

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
