export class MovableElement {
	constructor(element) {
		this.element = element
		this.offsetX = 0
		this.offsetY = 0
		this.isDragging = false
		this.isClick = false

		this.init()
	}

	init() {
		this.element.style.position = "relative" // Set initial position to relative
		this.element.addEventListener("mousedown", this.onMouseDown.bind(this))
		document.addEventListener("mousemove", this.onMouseMove.bind(this))
		document.addEventListener("mouseup", this.onMouseUp.bind(this))
	}

	onMouseDown(e) {
		this.isDragging = true
		this.isClick = true
		this.offsetX = e.clientX - this.element.offsetLeft
		this.offsetY = e.clientY - this.element.offsetTop

		// Switch to absolute positioning when dragging starts
		this.element.style.position = "absolute"
		this.element.style.width = `${this.element.offsetWidth}px` // Fix width to prevent resizing
		this.element.style.transform = "none" // Remove centering transform
		this.element.style.cursor = "grabbing"
	}

	onMouseMove(e) {
		if (this.isDragging) {
			const moveX = e.clientX - this.offsetX
			const moveY = e.clientY - this.offsetY
			this.element.style.left = `${moveX}px`
			this.element.style.top = `${moveY}px`
			this.isClick = false
		}
	}

	onMouseUp() {
		if (this.isDragging) {
			this.isDragging = false
			this.element.style.cursor = "grab"

			if (this.isClick) {
				this.handleClick()
			}
		}
	}

	handleClick() {
		alert("Paragraph clicked!")
	}
}
