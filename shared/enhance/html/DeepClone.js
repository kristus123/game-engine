const rootStylesToSkip = new Set([
	"position",
	"top",
	"right",
	"bottom",
	"left",
	"width",
	"height",
	"margin-top",
	"margin-right",
	"margin-bottom",
	"margin-left",
	"opacity",
	"pointer-events",
	"filter",
])

export class DeepClone {
	static clone(element) {
		const clone = element.cloneNode(true)
		const sourceElements = [element, ...element.querySelectorAll("*")]
		const cloneElements = [clone, ...clone.querySelectorAll("*")]

		for (let elementIndex = 0; elementIndex < sourceElements.length; elementIndex++) {
			const sourceElement = sourceElements[elementIndex]
			const cloneElement = cloneElements[elementIndex]
			const computedStyle = getComputedStyle(sourceElement)
			for (let styleIndex = 0; styleIndex < computedStyle.length; styleIndex++) {
				const property = computedStyle[styleIndex]
				if (elementIndex == 0 && rootStylesToSkip.has(property)) {
					continue
				}
				cloneElement.style.setProperty(property, computedStyle.getPropertyValue(property))
			}
		}

		return clone
	}

	static SortableStylingThing(container, element, pointerEvent) {
		const dragStartIndex = [...container.children].indexOf(element)
		const originalVisibility = element.style.visibility
		const rect = element.getBoundingClientRect()
		const visual = this.clone(element)
		visual.classList.add("floating", "sortable-drag-visual")
		visual.style.width = `${rect.width}px`
		visual.style.height = `${rect.height}px`
		visual.style.boxSizing = "border-box"
		visual.style.margin = "0"
		visual.style.right = "auto"
		visual.style.bottom = "auto"
		visual.style.pointerEvents = "none"
		visual.style.transition = "none"
		visual.style.left = "0"
		visual.style.top = "0"
		document.body.appendChild(visual)

		const visualRect = visual.getBoundingClientRect()
		const pointerOffsetX = pointerEvent.clientX - (rect.left - visualRect.left)
		const pointerOffsetY = pointerEvent.clientY - (rect.top - visualRect.top)
		const move = event => {
			visual.style.left = `${event.clientX - pointerOffsetX}px`
			visual.style.top = `${event.clientY - pointerOffsetY}px`
		}

		visual.style.left = `${rect.left - visualRect.left}px`
		visual.style.top = `${rect.top - visualRect.top}px`
		move(pointerEvent)
		element.style.visibility = "hidden"

		return {
			dragStartIndex,
			move,
			remove: () => {
				visual.remove()
				element.style.visibility = originalVisibility
			},
		}
	}
}
