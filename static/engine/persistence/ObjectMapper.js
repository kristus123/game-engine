function positionFromJson(o) {
	return new Position(o.x, o.y, o.width, o.height)
}

function positionToJson(p) {
	return {
		x: p.x,
		y: p.y,
		width: p.width,
		height: p.height,
	}
}

export class ObjectMapper {

	static fromFile(body) {
		body.objects.map(o => {
			return ObjectMapper.mapSingleObject(o)
		})

		return body
	}

	static toFile(body) {
		body.objects.map(o => {
			return ObjectMapper.toJson(o)
		})

		return JSON.stringify(body, null, 4)
	}

	static toJson(o) {
		if (o instanceof StaticPicture) {
			return JSON.stringify({
				type: StaticPicture.name,
				position: positionToJson(o.position),
				imagePath: o.imagePath,
			}, null, 4)
		}

		else if (o instanceof Fire) {
			return JSON.stringify({
				type: Fire.name,
				position: positionToJson(o.position),
				objectId: o.objectId,
			}, null, 4)
		}

		else if (o instanceof Chicken) {
			return JSON.stringify({
				type: Chicken.name,
				position: positionToJson(o.position),
				objectId: o.objectId,
			}, null, 4)
		}
		else if (o instanceof DynamicGameObject) {
			return JSON.stringify({
				type: DynamicGameObject.name,
				position: positionToJson(o.position),
				weight: o.weight,
				velocityFactor: o.velocityFactor,
				srcPicture: o.srcPicture,
				objectId: o.objectId,
			}, null, 4)
		}
		else {
			throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}

	static mapSingleObject(o) {
		o = JSON.parse(o)

		switch (o.type) {
			case StaticPicture.name: {
				return new StaticPicture(positionFromJson(o.position), o.imagePath)
			}
			case Fire.name: {
				return new Fire(positionFromJson(o.position))
			}
			case Chicken.name: {
				const p = positionFromJson(o.position)

				const chicken = new Chicken(p)
				chicken.objectId = o.objectId
				chicken.handledByClientId = o.handledByClientId

				return chicken
			}
			case DynamicGameObject.name: {
				const p = positionFromJson(o.position)

				const xxx = new DynamicGameObject(p, o.weight, o.velocityFactor, o.imagePath)
				xxx.objectId = o.objectId
				xxx.handledByClientId = o.handledByClientId

				return xxx
			}
			default: {
				throw new Error('could not map ' + o.type + ' in ObjectMapper')
			}
		}
	}
}
