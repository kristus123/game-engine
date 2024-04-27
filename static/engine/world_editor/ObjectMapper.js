function positionFromJson(o) {
	return new Position(o.x, o.y, o.width, o.height, o.weight)
}
export class ObjectMapper {

	static fromFile(body) {
		body.objects.map(o => {
			o = JSON.parse(o)
			switch (o.type) {
			case 'StaticPicture':
				return new StaticPicture(positionFromJson(o.position), "https://i.imgur.com/w9dZE0H.png")
			default:
				throw new Error('could not map ' + o.type + ' in ObjectMapper')
			}
		})

		return body
	}

	static x(o) {
		o = JSON.parse(o)
		switch (o.type) {
		case 'StaticPicture':
			return new StaticPicture(positionFromJson(o.position), "https://i.imgur.com/w9dZE0H.png")
		default:
			throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}

	static toFile(body) {
		body.objects.map(o => {
			if (o instanceof StaticPicture) {
				return {
					type: 'StaticPicture',
					position: {
						x: o.position.x,
						y: o.position.y,
						width: o.position.width ,
						height: o.position.height ,
					},
				}
			}
			else {
				throw new Error('could not map ' + o.type + ' in ObjectMapper')
			}
		})

		return JSON.stringify(body, null, 4)
	}

	static toJson(o) {
		if (o instanceof StaticPicture) {
			return JSON.stringify({
				type: 'StaticPicture',
				position: {
					x: o.position.x,
					y: o.position.y,
					width: o.position.width ,
					height: o.position.height ,
				},
			}, null, 4)
		}
		else {
			throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}
}
