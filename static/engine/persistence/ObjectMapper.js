// hack to import necessary stuff
// new StaticPicture(
// new Chicken(

export class ObjectMapper {

	static positionFromJson(o) {
		return new Position(o.x, o.y, o.width, o.height)
	}

	static mapToJson(o) {
		return JSON.stringify({
			className: o.constructor.name,
			objectId: o.objectId,
			position: {
				x: o.x,
				y: o.y,
				width: o.width,
				height: o.height,
			},
		}, null, 4)
	}

	static fromFile(body) {
		body.objects.map(o => {
			return ObjectMapper.mapSingleObject(o)
		})

		return body
	}

	static toFile(body) {
		body.objects.map(o => {
			if (o.mapToJson) {
				return o.mapToJson()
			}
			else {
				throw new Error(`${o.constructor.name} needs to have a mapToJson method to persist it`)
			}
		})

		return JSON.stringify(body, null, 4)
	}

	static mapSingleObject(json) {
		json = JSON.parse(json)
		const c = eval(json.className)

		if (c.mapFromJsonObject) {
			return c.mapFromJsonObject(json)
		}
		else {
			throw new Error(`you need to add 'static mapFromJsonObject' method in ${json.className} to be able to persist it`)
		}
	}
}
