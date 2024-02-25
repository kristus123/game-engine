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

			if (distance > 800) {
				ForcePush(cargo).towards(connectedTo, distance * 40)
			}
			else if (distance > 400) {
				ForcePush(cargo).towards(connectedTo, distance * 20)
			}
			else if (distance > 100) {
				ForcePush(cargo).towards(connectedTo, distance, 0.05)
			}
			else if (distance > 50) {
				ForcePush(cargo).towards(connectedTo, distance, 0.01)
			}
			else if (distance > 20) {
				ForcePush(cargo).towards(connectedTo, distance, 0.1)
			}

			if (Collision.between(cargo, connectedTo)) {
				ForcePush(cargo).awayFrom(connectedTo, 40)
				ForcePush(connectedTo).awayFrom(cargo, 20)
			}

			Physics.enforceMaxDistance(connectedTo, cargo, 100, 0.1)
			Physics.enforceMinDistance(connectedTo, cargo, 20, 50)
		}
	}

	draw(draw) {
		this.cargos.forEach(c => {
			c.draw(draw)
		})
	}
}
