// hack to import necessary stuff
// new StaticPicture(
// new Chicken(
// new StaticGameObject(
// new Poop(

export class ObjectMapper {

	static positionFromJson(o) {
		return new Position(o.x, o.y, o.width, o.height)
	}

	static mapToJsonObject(o) {
		return {
			className: o.constructor.name,
			objectId: o.objectId,
			imagePath: o.imagePath,
			position: {
				x: o.x,
				y: o.y,
				width: o.width,
				height: o.height,
			},
		}
	}

	static mapToJsonString(o) {
		return JSON.stringify(this.mapToJsonObject(o), null, 4)
	}

	static fromFile(body) {
		body.map(o => {
			return this.mapSingleObject(o)
		})

		return body
	}

	static toFile(body) {
		body.map(o => {
			if (o.mapToJson) {
				return o.mapToJson()
			}
			else {
				throw new Error(`${o.constructor.name} needs to have a mapToJson method to persist it`)
			}
		})

		return JSON.stringify(body, null, 4)
	}

	static mapFromString(json) {
		json = JSON.parse(json)
		const c = eval(json.className)

		if (!c.mapFromJsonObject) {
			throw new Error(`you need to add 'static mapFromJsonObject' method in ${json.className} to be able to persist it`)
		}

		try {
			return c.mapFromJsonObject(json)
		}
		catch (error) {
			throw new Error(`error while mapping json object ${json.className} to js object:<hr>${error}`)
		}
	}
}
