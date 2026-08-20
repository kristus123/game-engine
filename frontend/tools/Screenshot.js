export async function Screenshot() {
	const canvas = document.createElement("canvas")
	const width = document.documentElement.scrollWidth
	const height = document.documentElement.scrollHeight

	canvas.width = width
	canvas.height = height

	const ctx = canvas.getContext("2d")

	// White background
	ctx.fillStyle =
	getComputedStyle(document.body).backgroundColor || "white"

	ctx.fillRect(0, 0, width, height)

	const elements = document.querySelectorAll("body *")

	for (const element of elements) {
		const rect = element.getBoundingClientRect()
		const style = getComputedStyle(element)

		const x = rect.left + window.scrollX
		const y = rect.top + window.scrollY

		if (rect.width == 0 || rect.height == 0) {
  	continue
		}

		// --------------------------------
		// Background
		// --------------------------------

		if (
  	style.backgroundColor != "rgba(0, 0, 0, 0)" &&
  	style.backgroundColor != "transparent"
		) {
  	ctx.fillStyle = style.backgroundColor

  	ctx.fillRect(
    	x,
    	y,
    	rect.width,
    	rect.height
  	)
		}

		// --------------------------------
		// Border
		// --------------------------------

		const borderWidth = parseFloat(style.borderWidth)

		if (borderWidth > 0) {
  	ctx.strokeStyle = style.borderColor
  	ctx.lineWidth = borderWidth

  	ctx.strokeRect(
    	x,
    	y,
    	rect.width,
    	rect.height
  	)
		}

		// --------------------------------
		// Text
		// --------------------------------

		ctx.font = [
  	style.fontStyle,
  	style.fontWeight,
  	style.fontSize,
  	style.fontFamily
		].join(" ")

		ctx.fillStyle = style.color

		for (const node of element.childNodes) {
  	if (node.nodeType != Node.TEXT_NODE) {
    	continue
  	}

  	const text = node.textContent.trim()

  	if (!text) {
    	continue
  	}

  	// Find the actual position of this text node
  	const range = document.createRange()
  	range.selectNodeContents(node)

  	const rects = range.getClientRects()

  	for (const textRect of rects) {
    	const textX = textRect.left + window.scrollX
    	const textY =
      	textRect.top +
      	window.scrollY +
      	parseFloat(style.fontSize)

    	ctx.fillText(text, textX, textY)
  	}
		}
	}

	return canvas
}