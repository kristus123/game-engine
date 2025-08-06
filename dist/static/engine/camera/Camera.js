import { Palette } from '/static/engine/Palette.js'; 
import { a } from '/static/engine/a.js'; 
import { Anchor } from '/static/engine/camera/Anchor.js'; 
import { LowLevelCamera } from '/static/engine/camera/LowLevelCamera.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Positions } from '/static/engine/position/Positions.js'; 
import { SmoothPosition } from '/static/engine/position/smooth/SmoothPosition.js'; 
import { SmoothValue } from '/static/engine/position/smooth/SmoothValue.js'; 

export class Camera {
	static initialize() { // initialize() Mouse first

		this.offset = {
			x: Palette.width / 2,
			y: Palette.height / 2,
		}

		this.palette = Palette.offscreen(() => {
			this.offset = {
				x: Palette.width / 2,
				y: Palette.height / 2,
			}
		})

		this.objectToFollow = new DynamicGameObject(new Position(0, 0, 1, 1), 1, 1)

		this.position = new Position(0, 0)
		this.smoothPosition = new SmoothPosition(this.position, 0.01)

		this.smoothZoom = new SmoothValue(1, 1, 0.5, 5)

		Mouse.scrollIn = () => {
			this.smoothZoom.targetValue += 0.1
			if (this.zoom.currentValue > 10) {
			}
		}

		Mouse.scrollOut = () => {
			this.smoothZoom.targetValue -= 0.1
			if (this.zoom.currentValue > 10) {
			}
		}

		this.anchoredPositions = new LocalObjects([
			// new Anchor(Mouse.position, 1_000, 0.1),
		])
	}

	static get zoom() {
		return this.smoothZoom.currentValue
	}

	static set zoom(x) {
		this.smoothZoom.targetValue = x
	}

	static context(run) {
		this.smoothZoom.update()

		this.smoothPosition.update(this.objectToFollow)
		this.position.x = this.smoothPosition.position.x
		this.position.y = this.smoothPosition.position.y


		// maybe ?
		// this.position.x = Math.round(this.position.x)
		// this.position.y = Math.round(this.position.y)

		this.anchoredPositions.update()
		// this.anchoredPositions.objects.forEach(a => {
		// 	console.log(a.smoothPosition.position.x)
		// })

		LowLevelCamera.context(this, run)
	}

	static follow(o) {
		this.objectToFollow = o
	}

	static goTo(o) { // this is wrong
		this.objectToFollow.x = o.x
		this.objectToFollow.y = o.y
	}

	static followInstantly(o) {
		this.objectToFollow = o

		this.position.x = o.position.x
		this.position.y = o.position.y
	}

	static p(p) { // screenPosition //todo improve ofc.
		return new Position(
			p.x - this.position.x + p.width + (Palette.width/2),
			p.y - this.position.y + p.height + (Palette.height/2),
		)
	}

	static coverObject(position) {
		const objRatio = position.width / position.height
		const viewRatio = Palette.width/ Palette.height

		if (objRatio > viewRatio) {
			this.zoom = Palette.height / position.height // fit height
		}
		else {
			this.zoom = Palette.width / position.width // fit width
		}

		this.zoom += 1.2


		const centerX = position.x + position.width / 2
		const centerY = position.y + position.height / 2

		this.follow(new Position(centerX, centerY))

	}

}

