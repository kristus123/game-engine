export class Picture {
	constructor(image) {
		this.canvas = document.createElement("canvas")
		this.ctx = this.canvas.getContext("2d")
		this.originalImage = image

		this.canvas.width = image.naturalWidth ?? image.width
		this.canvas.height = image.naturalHeight ?? image.height

		this.ctx.drawImage(image, 0, 0)

		this.offset = { x: 0, y: 0 }
		this.shakeOffset = { x: 0, y: 0 }

		this.shadowSprite = null
		this.shadowScale = { width: 0, height: 0 }
		this.shadowAngle = 0.0
	}

	shadow(r = 0, g = 0, b = 0, a = 1.0) {
		const shadowSprite = this.copy().mirrorY()
		shadowSprite.offset.y = shadowSprite.canvas.height * 4
		this.shadowSprite = shadowSprite

		this.shadowSprite.tint(r, g, b, a)
	}

	updateShadow(selfPosition, lightPos) {
		const distanceVector = { x: 0, y: 0 }

		distanceVector.x = lightPos.x - selfPosition.x
		distanceVector.y = lightPos.y - selfPosition.y

		const distanceDelta = Math.sqrt(
			(distanceVector.x * distanceVector.x) + (distanceVector.y * distanceVector.y)
		)

		const maxScale = 350
		const minScale = 1

		this.shadowScale.height = Math.max(
			minScale,
			maxScale - distanceDelta
		)

		const shadowDirection = { x: 0, y: 0 }
		shadowDirection.x = selfPosition.x - lightPos.x
		shadowDirection.y = selfPosition.y - lightPos.y

		const theta = Math.atan2(shadowDirection.y, shadowDirection.x) - Math.PI * 0.5

		this.shadowAngle = theta
	}

	flicker(intensity, r = 0, g = 0, b = 0) {
		this.tint(r, g, b, Math.random() * intensity)
	}

	shake(intensity, durationSeconds) {
		this.shakeOffset.x = Math.random()* intensity
		this.shakeOffset.y = Math.random() * intensity

		setTimeout(() => {
			this.shakeOffset = { x: 0, y: 0 }
		}, durationSeconds * 1000)
	}

	changeColor(colorMap) {
		const newCanvas = document.createElement("canvas")
		const newCtx = newCanvas.getContext("2d")

		newCanvas.width = this.canvas.width
		newCanvas.height = this.canvas.height

		newCtx.drawImage(this.canvas, 0, 0)

		const image = newCtx.getImageData(0, 0, this.canvas.width, this.canvas.height)
		const data = image.data

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i]
			const g = data[i + 1]
			const b = data[i + 2]

			if (colorMap[`rgb(${r},${g},${b})`]) {
				const color = colorMap[`rgb(${r},${g},${b})`]

				data[i] = color.r
				data[i + 1] = color.g
				data[i + 2] = color.b
			}
		}

		newCtx.putImageData(image, 0, 0)

		this.ctx = newCtx
		this.canvas = newCanvas

		this.ctx.drawImage(this.canvas, 0, 0)

		return this
	}

	reset() {
		const newCanvas = document.createElement("canvas")
		const newCtx = newCanvas.getContext("2d")

		newCanvas.width = this.canvas.width
		newCanvas.height = this.canvas.height

		newCtx.drawImage(this.originalImage, 0, 0)

		this.canvas = newCanvas
		this.ctx = newCtx

		return this
	}

	mirrorX() {
		const newCanvas = document.createElement("canvas")
		const newCtx = newCanvas.getContext("2d")

		newCanvas.width = this.canvas.width
		newCanvas.height = this.canvas.height

		newCtx.translate(this.canvas.width, 0)
		newCtx.scale(-1, 1)
		newCtx.drawImage(this.canvas, 0, 0)

		this.canvas = newCanvas
		this.ctx = newCtx

		return this
	}

	mirrorY() {
		const newCanvas = document.createElement("canvas")
		const newCtx = newCanvas.getContext("2d")

		newCanvas.width = this.canvas.width
		newCanvas.height = this.canvas.height

		newCtx.translate(0, this.canvas.height)
		newCtx.scale(1, -1)
		newCtx.drawImage(this.canvas, 0, 0)

		this.canvas = newCanvas
		this.ctx = newCtx

		return this
	}

	tint(r, g, b, a) {
		this.ctx.globalCompositeOperation = "source-atop"

		this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.canvas, 0, 0)

		return this
	}

	crop(sx, sy, sw, sh) {

		const newCanvas = document.createElement("canvas")
		const newCtx = newCanvas.getContext("2d")

		newCanvas.width = sw
		newCanvas.height = sh

		newCtx.drawImage(
			this.canvas,
			sx, sy, sw, sh, // source
			0, 0, sw, sh // destination
		)

		this.originalImage = newCanvas

		this.canvas = newCanvas
		this.ctx = newCtx

		return this
	}

	*visiblePixelsIn(picturePosition) {
		for (const xy of picturePosition.points()) {
			const c = this.pixelColor(xy)
			if (c.a != 0) {
				yield xy
			}
		}
	}

	copy() {
		return new Picture(this.canvas)
	}

	setPixel(p, r = 255, g = 255, b = 255, a = 255) {
		this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`
		this.ctx.fillRect(p.x, p.y, p.width, p.height)
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	erase(p) {
		this.ctx.clearRect(p.x, p.y, p.width, p.height)
	}

	pixelColor(p) {
		const data = this.ctx.getImageData(p.x, p.y, 1, 1).data

		return {
			r: data[0],
			g: data[1],
			b: data[2],
			a: data[3]
		}
	}

	update(p, drawLayer = D1) {
		Assert.value(p)

		if (this.shadowSprite) {
			drawLayer.ctx.save()

			drawLayer.ctx.translate(
				p.x + p.width * 0.5,
				p.y + this.shadowSprite.offset.y
			)

			drawLayer.ctx.rotate(this.shadowAngle)

			drawLayer.ctx.drawImage(
				this.shadowSprite.canvas,
				-(p.width + this.shadowScale.width) * 0.5,
				0,
				p.width + this.shadowScale.width,
				p.height + this.shadowScale.height
			)

			drawLayer.ctx.restore()
		}

		drawLayer.ctx.drawImage(
			this.canvas,
			p.x + this.offset.x + this.shakeOffset.x,
			p.y + this.offset.y + this.shakeOffset.y,
			p.width,
			p.height
		)
	}

}
