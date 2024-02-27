export class Train {
	constructor(main, cargos) {
	}

	update() {
		for (const [index, cargo] of this.cargos.entries()) {

			let connectedTo

			if (index == 0) {
				connectedTo = this.main
			}
			else if (List.validIndex(this.cargos, index-1)) {
				connectedTo = this.cargos[index-1]
			}
			else {
				continue
			}

			const distance = Distance.between(cargo, connectedTo)

			// if (distance > 1000) {
			// 	ForcePush(cargo).towards(connectedTo, 1000)
			// }
			// else if (distance > 800) {
			// 	ForcePush(cargo).towards(connectedTo, 1000)
			// }
			// else if (distance > 600) {
			// 	ForcePush(cargo).towards(connectedTo, distance, 0.05)
			// }
			// else if (distance > 200) {
			// 	ForcePush(cargo).towards(connectedTo, distance, 0.001)
			// }
			if (distance > 100) {
				Push(cargo).towards(connectedTo, distance, 2)
			}
			console.log(distance)

			if (Collision.between(cargo, connectedTo)) {
				// ForcePush(cargo).awayFrom(connectedTo, 40)
				// ForcePush(connectedTo).awayFrom(cargo, 20)
			}

			Physics.enforceMaxDistance(connectedTo, cargo, 800, 0.1)
			Physics.enforceMinDistance(connectedTo, cargo, 400, 0.1)
		}
	}

	draw(draw) {
		this.cargos.forEach(c => {
			c.draw(draw)
		})
	}
}
