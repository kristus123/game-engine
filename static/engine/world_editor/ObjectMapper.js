export class ObjectMapper {

	static fromFile(body) {
		body.objects.map(o => {
			o = JSON.parse(o)
			switch (o.type) {
			case 'GameObject':
				return new GameObject(o.x, o.y, o.width, o.height, o.weight, o.velocityFactor)
			default:
				throw new Error('could not map ' + o.type + ' in ObjectMapper')
			}
		})

		return body
	}

	static x(o) {
		o = JSON.parse(o)
		switch (o.type) {
		case 'GameObject':
			return new GameObject(o.x, o.y, o.width, o.height, o.weight, o.velocityFactor)
		default:
			throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}

	static toFile(body) {
		body.objects.map(o => {
			if (o instanceof GameObject) {
				return {
					type: 'GameObject',
					x: o.x,
					y: o.y,
					width: o.width ,
					height: o.height ,
					weight: o.weight ,
					velocityFactor: o.velocityFactor ,
				}
			}
			else {
				throw new Error('could not map ' + o.type + ' in ObjectMapper')
			}
		})

		return JSON.stringify(body, null, 4)
	}

	static toJson(o) {
		if (o instanceof GameObject) {
			return JSON.stringify({
				type: 'GameObject',
				x: o.x,
				y: o.y,
				width: o.width ,
				height: o.height ,
				weight: o.weight ,
				velocityFactor: o.velocityFactor ,
			}, null, 4)
		}
		else {
			throw new Error('could not map ' + o.type + ' in ObjectMapper')
		}
	}
}
