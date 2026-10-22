export class Enhance_html extends NativeEnhancer {
	constructor() {
		super(HTMLElement.prototype, { allowOverride: ["forEach", "map", "remove"] })
	}

	forEach(callback) {
		const children = this.children

		for (let i = 0; i < children.length; i++) {
			callback(children[i], i, this)
		}

		return this
	}

	filter(callback) {
		return this.children.filter(callback)
	}

	trigger(name, detail) {
		Assert.string(name)
		Assert.object(detail)

		this.dispatchEvent(new CustomEvent(name, {
			detail: detail
		}))

		return this
	}

	every(callback) {
		return this.children.every(callback)
	}

	randomizeOrder() {

		const children = [...this.children]

		for (let i = children.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))

			;[children[i], children[j]] = [children[j], children[i]]
		}

		for (const child of children) {
			this.appendChild(child)
		}

	}

	map(callback) {
		const children = this.children
		const x = []

		for (let i = 0; i < children.length; i++) {
			x.push(callback(children[i]))
		}

		return x
	}

	get tag() {
		return this.tagName.toLowerCase()
	}

	get isTextNode() {
		return
  			this.childNodes.length == 1 &&
  			this.firstChild.nodeType == Node.TEXT_NODE
	}

	get data() {
		return this.dataset
	}

	cloneTemplate({ slots={}, data={} } = {}) {
		Assert.true(this.tag == "template", "cloneTemplate can only be used on a template")
		const clone = this.content.cloneNode(true)
		const root = clone.firstElementChild
		Assert.value(root, "template must contain an element")

		for (const element of [root, ...clone.querySelectorAll("*")]) {
			for (const attribute of element.attributes) {
				for (const [name, value] of Object.entries(slots)) {
					if (attribute.value == "slot-" + name) {
						element.setAttribute(attribute.name, value)
					}
				}
			}
		}

		for (const slot of clone.querySelectorAll("slot")) {
			const name = slot.getAttribute("name")
			if (Object.prototype.hasOwnProperty.call(slots, name)) {
				slot.replaceWith(document.createTextNode(slots[name]))
			}
		}

		for (const [name, value] of Object.entries(data)) {
			root.data[name] = value
		}

		return root
	}

	get width() {
		return this.getBoundingClientRect().width
	}

	get height() {
		return this.getBoundingClientRect().height
	}

	orderBasedOnMousePosition(draggedItem, onChange= () => {}) { // Not the best name.

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
			onChange()
			this.insertBefore(draggedItem, nextItem)
		}
		else {
			onChange()
			this.appendChild(draggedItem)
		}
	}

	get last() {
		if (this.empty) {
			throw new Error("can't get last element if list is empty")
		}
		else {
			return this.children[this.children.length - 1]
		}
	}

	splitWords() {
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
	}

	splitLetters() {
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
	}

	listen(type, listener, options) {
		this._listeners ??= []

		const x = (e) => {
			listener(e)
		}

		this._listeners.push({ type, x, options })
		this.addEventListener(type, x, options)

		return this
	}

	OnChange(listener) {
		if (this.tag != "input" || this.type != "checkbox") {
			throw new Error("OnChange is currently only supported for checkboxes")
		}

		return this.listen("change", listener)
	}

	removeListener(typeToRemove) {
		this._listeners ??= []

		this._listeners.forEach(({ type, listener, options }) => {
			if (type == typeToRemove) {
				this.removeEventListener(type, listener, options)
			}
		})

		return this
	}

	removeAllListeners() {
		this._listeners ??= []

		this._listeners.forEach(({ type, listener, options }) => {
			this.removeEventListener(type, listener, options)
		})

		if (this._listeners) {
			this._listeners.clear()
		}

		return this
	}

	text(text) { // should be a get/set
		this.innerHTML = text
		return this
	}

	get parent() {
		return this.parentElement
	}

	onDragChild({ onDrag, whileDragging, onDrop } = {}) {

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

	}

	replace(oldText, newText) {
		this.textContent.replace(oldText, newText)
	}

	visible() {
		return this.css("visibility: visible;")
	}

	invisible() {
		return this.css("visibility: hidden;")
	}

	closestDraggable() {
		return this.closest("[draggable]")
	}

	offset_x(amount) {
		this.css(`transform: translateX(${amount}px); position: relative;`) // position relative might be possible to remove
		return this
	}

	offset_y(amount) {
		this.css(`transform: translateY(${amount}px); position: relative;`) // position relative might be possible to remove
		return this
	}

	transformPosition(p) {
		this.style.transform = `translate(${p.x}px, ${p.y}px)`
	}

	clearChildren() {
		this.replaceChildren()
	}

	clear() {
		if (this.tag == "input") {
			this.value = ""
		}
		else {
			throw new Error("unsupported: " + this.tag + " - you need to explcititly tell how this.clear should work")
		}
	}

	removeChildren() {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}
	}

	unshrink(duration = 200) {
		const width = this.width
		const height = this.height

		this.style.transition = "none"
		this.style.width = "0px"
		this.style.height = "0px"

		requestAnimationFrame(() => {
			this.style.transition = `width ${duration}ms, height ${duration}ms`
			this.style.width = `${width}px`
			this.style.height = `${height}px`
		})

	}


	shrink(duration) {
		const width = this.offsetWidth
		const height = this.offsetHeight

		this.style.transition = `width ${duration}ms, height ${duration}ms`
		this.style.width = `${width}px`
		this.style.height = `${height}px`

		requestAnimationFrame(() => {
			this.style.width = "0px"
			this.style.height = "0px"
		})
	}

	show(animationClassName) {
		// make it trigger this if it is modal
		// this.showModal()

		this.removeAttribute("hidden")

		if (animationClassName) {
			this.animate(animationClassName)
		}

		return this
	}

	hide(animationClassName=null) {
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
	}

	// removeAttribute already exists
	addAttribute(name) {
		this.setAttribute(name, "")
		return this
	}

	ids() {
		return Array.from(this.querySelectorAll("[id]")).map(e => e.id)
	}

	getId(id) {
		return Assert.value(this.querySelector(`#${id}`))
	}

	setId(id) {
		this.id = id
		return this
	}

	fontSize(size) {
		this.css(`font-size: ${size};`)
		return this
	}

	enable() {
		if (this.disabled) {
			this.removeAttribute("disabled")
			this.disabled = false
		}

	}

	get enabled() {
		return !this.hasAttribute("disabled")
	}

	get disabled() {
		return this.hasAttribute("disabled")
	}

	disable() {
		if (!this.disabled) {
			this.addAttribute("disabled")
			this.disabled = true
		}

		return this
	}

	removeOnClick() {
		this.removeListener("click")
		return this
	}

	onClick(run) {
		// todo throw error instead if already set?
		this.removeListener("click")

		this.listen("click", () => {
			run(this)
		})

		return this
	}

	onEnter(run) {
		console.log("this one is DANGEROUS")

		this.removeListener("keydown")

		this.listen("keydown", (e) => {
			if (e.key == "Enter") {
				e.preventDefault()
				console.log("hei")
				run(this.value)
			}
		})

		return this
	}

	set(elements) {
		while (this.firstChild) {
			this.removeChild(this.firstChild)
		}


		for (const e of Always.list(elements)) {
			this.appendChild(e)
		}
	}

	push(elements) {
		for (const e of Always.list(elements)) {
			this.appendChild(e)
		}
	}

	async add(elements) {
		const addedElements = []

		for (let e of Always.list(elements)) {
			if (A.string(e)) {
				e = e.toHtml()
			}

			const nodes = e.nodeType == Node.DOCUMENT_FRAGMENT_NODE ? [...e.childNodes] : [e]
			this.appendChild(e)
			addedElements.push(...nodes.filter(node => node.nodeType == Node.ELEMENT_NODE))
		}

		await Promise.all(addedElements
			.filter(element => element.isConnected && typeof element.onAdd == "function")
			.map(element => element.onAdd({ element, parent: this })))
		return this
	}

	remove() {
		if (!this.isConnected) {
			Element.prototype.remove.call(this)
			return Promise.resolve(this)
		}

		const parent = this.parentNode
		if (typeof this.onRemove != "function") {
			Element.prototype.remove.call(this)
			return Promise.resolve(this)
		}

		let animation
		try {
			animation = this.onRemove({ element: this, parent })
		}
		catch (error) {
			return Promise.reject(error)
		}

		return Promise.resolve(animation).then(() => {
			if (this.parentNode == parent) {
				Element.prototype.remove.call(this)
			}
			return this
		})
	}


	addAfter(e) {
		this.after(e)
	}

	addBefore(e) {
		this.before(e)
	}

	hasClass(className) {
		return this.classList.contains(className)
	}

	addClass(className) {
		for (const cc of Always.list(className)) {
			for (const c of cc.split(" ")) {
				this.classList.add(c)
			}
		}

		return this
	}

	removeClass(className) {
		this.classList.remove(className)
		return this
	}

	addCssVariable(key, value) {
		this.style.setProperty(`--${key}`, value)
		return this
	}

	css(newCss) {
		this.style.cssText += newCss
		return this
	}

	play(className, { variables={}, onStart, onHalf, onEnd } = {}) {
		this._activeAnimations ??= new Map()

		if (this._activeAnimations.has(className)) {
			throw new Error("todo handle this case one day")
		}

		for (const [name, value] of Object.entries(variables)) {
			this.addCssVariable(name, value)
		}

		return new Promise(resolve => {
			const cleanup = () => {
				this.removeEventListener("animationstart", animationListeners.animationStart)
				this.removeEventListener("animationend", animationListeners.animationEnd)
				this.removeEventListener("animationcancel", animationListeners.animationCancel)
				this._activeAnimations.delete(className)
			}

			const finish = e => {
				this.removeClass(className)
				cleanup()
				onEnd?.(e)
				resolve(this)
			}

			const animationListeners = {
				animationStart: e => {
					if (this == e.target && e.animationName == className) {
						onStart?.(e)

						const start = performance.now()
						const duration = parseFloat(getComputedStyle(this).animationDuration) * 1000
						const checkHalf = () => {
							if ((performance.now() - start) >= duration / 2) {
								onHalf?.(e)
							}
							else {
								requestAnimationFrame(checkHalf)
							}
						}
						requestAnimationFrame(checkHalf)
					}
				},
				animationEnd: e => {
					if (this == e.target && e.animationName == className) {
						finish(e)
					}
				},
				animationCancel: e => {
					if (this == e.target && e.animationName == className) {
						finish(e)
					}
				},
			}
			this._activeAnimations.set(className, animationListeners)

			this.addEventListener("animationstart", animationListeners.animationStart)
			this.addEventListener("animationend", animationListeners.animationEnd)
			this.addEventListener("animationcancel", animationListeners.animationCancel)

			this.addClass(className)
		})
	}

	playAndRemove(className, options = {}) {
		const onEnd = options.onEnd

		return this.play(className, {
			...options,
			onEnd: event => {
				onEnd?.(event)
				this.remove()
			},
		})
	}

	copy() {
		return this.cloneNode(true)
	}

	clone() {
		return this.cloneNode(true)
	}

	walk(action) {
		function walk(node) {
			for (const child of node.children) {
				walk(child)
				action?.(child)
			}
		}

		walk(this)

		return this
	}


	swap(o) {
		const parent = this.parentNode
		const placeholder = document.createElement("span")

		parent.insertBefore(placeholder, this)
		parent.insertBefore(this, o)
		parent.insertBefore(o, placeholder)

		placeholder.remove()
	}


	animateTowards(destination, duration=200) {
		const first = this.getBoundingClientRect()

		destination.appendChild(this)

		const last = this.getBoundingClientRect()

		const dx = first.left - last.left
		const dy = first.top - last.top

		// onStart?.();

		const animation = this.animate([
			{ transform: `translate(${dx}px, ${dy}px)` },
			{ transform: "translate(0, 0)" }
		], {
			duration: duration,
			easing: "ease-in-out"
		})

		animation.onfinish = () => {
			console.log("finish animating")
		}
	}

	worldPosition(position) {
		Assert.value(position)

		const p = Camera.p(position)
		this.style.left = `${p.x}px`
		this.style.top = `${p.y}px`

		return this
	}

	followMouse(offset_x=0, offset_y=0) {
		const x = DomMouse.x + offset_x - (this.width/2)
		const y = DomMouse.y + offset_y - (this.height/2)

		this.style.left = `${x}px`
		this.style.top = `${y}px`

		return this
	}


	placeOver(other) {
		const rect = other.getBoundingClientRect()

		this.style.left = `${rect.left}px`
		this.style.top = `${rect.top}px`

		this.style.width = `${rect.width}px`
		this.style.height = `${rect.height}px`
	}

	floating() {
		//assert that class is not already present
		this.addClass("floating")
		return this
	}

	overlay() {
		//assert that class is not already present
		this.addClass("overlay")
		return this
	}

	get x() {
		return this.getBoundingClientRect().left
	}

	set x(x) {
		this.style.left = `${x}px`
	}

	get content() {
		if (this.isTextNode) {
			return this.textContent
		}
		else {
			return this.children
		}

	}

	set content(x) {
		Assert.value(x)

		if (A.string(x)) {
			this.textContent = x
		}
		else {
			this.replaceChildren(x)
		}
	}

	get y() {
		return this.getBoundingClientRect().top
	}

	set y(y) {
		this.style.top = `${y}px`
	}


	get position() {
		if (this._position) { // todo set position field beforehand ?
			return this._position
		}
		else {
			this._position = WorldPosition(this.x, this.y)
		}
	}

	set position(p) {
		this._position = p
	}

}
