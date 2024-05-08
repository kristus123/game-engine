function positionFromJson(o) {
	return new Position(o.x, o.y, o.width, o.height, o.weight)
}

function positionToJson(p) {
	return {
		x: p.x,
		y: p.y,
		width: p.width ,
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

		else if (o instanceof DynamicGameObject) {
			return JSON.stringify({
				type: DynamicGameObject.name,
				position: positionToJson(o.position),
				weight: o.weight,
				velocityFactor: o.velocityFactor,
				srcPicture: o.srcPicture,
				uuid: o.uuid,
			}, null, 4)
		}

		else {
			throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}

	static mapSingleObject(o) {
		o = JSON.parse(o)

		switch (o.type) {
			case StaticPicture.name:
				return new StaticPicture(positionFromJson(o.position), o.imagePath)
			case DynamicGameObject.name:
				const p = positionFromJson(o.position)
				const x =  new DynamicGameObject(new Position(p.x, p.y, p.width, p.height), o.weight, o.velocityFactor, o.imagePath)
				x.uuid = o.uuid
				return x
			default:
				throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}
}
