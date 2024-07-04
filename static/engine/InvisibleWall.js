export class InvisibleWall extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 100
		this.position.height = 100

		this.objects = []
	}

	update() {
		for (const o of this.objects) {
			if (Collision.between(this, o)) {
				const currentPosition = { x: o.position.x, y: o.position.y }

				o.position.x = o.previousPosition.x
				if (!Collision.between(this, o)) {
					console.log('x axis collision')

					o.velocity.x = 0
					o.position.x = o.previousPosition.x
					return
				}
				else {
					o.position.x = currentPosition.x
				}

				o.position.y = o.previousPosition.y
				if (!Collision.between(this, o)) {
					console.log('y axis collision')

					o.velocity.y = 0
					o.position.y = o.previousPosition.y
					return
				}
				else {
					o.position.y = currentPosition.y
				}
			}
		}

	}

	draw(draw, guiDraw) {
		draw.transparentRedRectangle(this.position)
	}

	static mapFromJsonObject(json) {
		const o = new this(new Position(json.position.x, json.position.y, json.position.width, json.position.height))
		o.objectId = json.objectId

		return o
	}

	mapToJson() {
		return {
			className: this.constructor.name,
			objectId: this.objectId,
			position: {
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
			},
		}
	}

}
